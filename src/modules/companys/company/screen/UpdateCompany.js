import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { databaseDate } from "@/lib/convertDate";

import { addCompany, updateCompany } from "../api";
import { useDetailCompany } from "../util";
import { useListUserV2 } from "@/modules/users/user/util";
import { removePropObject } from "@/utils";

import { AddForm, DropdownForm, InputForm, InputSwitchForm } from "@/components/AddForm";
import { UploadImg } from "@/components/UploadImages";
import { Accordion, AccordionTab } from 'primereact/accordion';

const InfoRequired = ({ infos, setInfos }) => {
    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã công ty' type='code' required />
                    <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên công ty' required />
                    <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                </div>
                <div className="col-12 lg:col-6">
                    <InputForm id='code_in' value={infos.code_in} onChange={(e) => (setInfos({ ...infos, code_in: e.target.value }))} label='Mã nội bộ' type='code' required />
                    <InputForm id='address' value={infos.address} onChange={(e) => (setInfos({ ...infos, address: e.target.value }))} label='Địa chỉ' required />
                </div>
            </div>
        </div>
    )
};

const BaseInfo = ({ infos, setInfos }) => {
    const users = useListUserV2();

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <InputForm id='code_enterprise' value={infos.code_enterprise} onChange={(e) => setInfos({ ...infos, code_enterprise: e.target.value })} label='Mã số doanh nghiệp' />
                    <InputForm id='code_tax' value={infos.code_tax} onChange={(e) => setInfos({ ...infos, code_tax: e.target.value })} label='Mã số thuế' />
                    <InputForm id='date_code' value={infos.date_code} onChange={(e) => setInfos({ ...infos, date_code: e.target.value })} label='Ngày cấp' type='date' />
                    <InputForm id='address_code' value={infos.address_code} onChange={(e) => setInfos({ ...infos, address_code: e.target.value })} label='Nơi cấp' />
                    <DropdownForm label='Người đại diện' value={infos.user_id_representative}
                        onChange={(e) => setInfos({ ...infos, user_id_representative: e.target.value })} options={users} />
                </div>
                <div className="col-12 lg:col-6">
                    <InputForm id='hotline' value={infos.hotline} onChange={(e) => setInfos({ ...infos, hotline: e.target.value })} label='Hotline' type='number' />
                    <InputForm id='fax' value={infos.fax} onChange={(e) => setInfos({ ...infos, fax: e.target.value })} label='Fax' type='Fax' />
                    <InputForm id='email' value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })} label='Email' type='email' />
                    <InputForm id='website' value={infos.website} onChange={(e) => setInfos({ ...infos, website: e.target.value })} label='Website' />
                    <InputForm id='phone_contact' value={infos.phone_contact} onChange={(e) => setInfos({ ...infos, phone_contact: e.target.value })} label='Số điện thoại' type='phone' />
                </div>
            </div>
        </div>
    )
};

const UpdateCompany = () => {
    const { id } = useParams();
    const companyInfo = useDetailCompany({ id: id });
    const [avatar, setAvatar] = useState(null);
    const [infos, setInfos] = useState({
        code_enterprise: '', code_tax: '', date_code: '', address_code: '', hotline: '', code: '', name: '',
        code_in: '', address: '', fax: '', email: '', website: '', phone_contact: '', status: true,
    });

    useEffect(() => {
        let newCompanyInfo = { ...infos, ...companyInfo, status: companyInfo.status === 0 ? false : true };
        newCompanyInfo = { ...newCompanyInfo, date_code: databaseDate(newCompanyInfo.date_code, false, 'date') }
        if (newCompanyInfo.id) setInfos(newCompanyInfo);
    }, [companyInfo]);

    useEffect(() => {
        if (companyInfo && companyInfo.avatar)
            setAvatar({ ...avatar, preview: companyInfo.avatar });
    }, [companyInfo])

    const handleData = () => {
        let info = {
            ...infos, status: infos.status ? 1 : 0, file: avatar,
        };
        info = {
            ...removePropObject(info, companyInfo), id: companyInfo.id,
            date_code: databaseDate(info.date_code), avatar: avatar ? companyInfo.avatar : [],
        };
        return info
    };

    return (
        <AddForm checkId={Number(id)} title='công ty' handleData={handleData}
            route={Number(id) ? '/company/update' : '/company/add'}
            actions={{ add: addCompany, update: updateCompany }}
            refreshObjects={[ setInfos, setAvatar ]} >
            <Accordion multiple activeIndex={[0]}>
                <AccordionTab header="Thông tin cơ bản">
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-2">
                            <UploadImg image={avatar} setImage={setAvatar} title='Ảnh công ty' />
                        </div>
                        <div className="col-12 lg:col-10 mt-8 lg:mt-0">
                            <InfoRequired infos={infos} setInfos={setInfos} />
                        </div>
                    </div>
                </AccordionTab>
                <AccordionTab header="Thông tin chi tiết">
                    <BaseInfo infos={infos} setInfos={setInfos} />
                </AccordionTab>
            </Accordion>
            <div className='mb-4'></div>
        </AddForm>
    )
}

export default UpdateCompany;