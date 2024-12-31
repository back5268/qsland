import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { databaseDate } from "@/lib/convertDate";

import { useDetailExchange } from "../util";
import { updateExchange, addExchange } from "../api";
import { useListCompany } from "../../company/util";
import { useListUserV2 } from "@/modules/users/user/util";

import { DropdownForm, InputForm, InputSwitchForm, AddForm } from "@/components/AddForm";
import { removePropObject } from "@/utils";
import { Accordion, AccordionTab } from 'primereact/accordion';

const UpdateExchange = () => {
    const { id } = useParams();
    const exchangeInfo = useDetailExchange(id);
    const [infos, setInfos] = useState({
        name: '', code: '', phone_contact: '', address: '',
        date_active: '', date_inactive: '', status: true
    });

    const companys = useListCompany();
    const users = useListUserV2();

    useEffect(() => {
        let newExchangeInfo = { ...infos, ...exchangeInfo };
        newExchangeInfo = {
            ...newExchangeInfo, date_active: databaseDate(newExchangeInfo.date_active, false, 'date'),
            date_inactive: databaseDate(newExchangeInfo.date_inactive, false, 'date'),
            status: exchangeInfo.status === 0 ? false : true,
        };
        if (newExchangeInfo.id) setInfos(newExchangeInfo);
    }, [exchangeInfo]);

    const handleData = () => {
        if (!infos.company_id) {
            return "Vui lòng chọn công ty"
        };
        let info = {
            ...infos, status: infos.status ? 1 : 0,
        };
        info = {
            ...removePropObject(info, exchangeInfo), id: exchangeInfo.id,
            date_active: databaseDate(info.date_active),
            date_inactive: databaseDate(info.date_inactive),
        };
        return info;
    };

    return (
        <AddForm checkId={Number(id)} title='phòng ban' handleData={handleData}
            route={Number(id) ? '/exchange/update' : '/exchange/add'}
            actions={{ add: addExchange, update: updateExchange }}
            refreshObjects={[setInfos]} >
            <Accordion multiple activeIndex={[0]}>
                <AccordionTab header="Thông tin cơ bản">
                    <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                        <div className="grid formgrid">
                            <div className="col-12 lg:col-6">
                                <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên phòng ban (*)' required />
                                <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã phòng ban (*)' required type='code' />
                                <DropdownForm label='Công ty (*)' value={infos.company_id} options={companys}
                                    onChange={(e) => setInfos({ ...infos, company_id: e.target.value })} />
                                <DropdownForm label='Người phụ trách' value={infos.user_id_representative}
                                    onChange={(e) => (setInfos({ ...infos, user_id_representative: e.target.value }))} options={users} />
                                <InputForm id='phone_contact' value={infos.phone_contact} onChange={(e) => setInfos({ ...infos, phone_contact: e.target.value })} type='phone' label='SĐT người phụ trách' />
                                <InputForm id='address' value={infos.address} onChange={(e) => setInfos({ ...infos, address: e.target.value })} label='Địa chỉ' />
                                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                            </div>
                            <div className="col-12 lg:col-6">
                                <InputForm id='date_active' value={infos.date_active} onChange={(e) => (setInfos({ ...infos, date_active: e.target.value }))} label='Ngày hoạt động' type='date' />
                                <InputForm id='date_inactive' value={infos.date_inactive} onChange={(e) => (setInfos({ ...infos, date_inactive: e.target.value }))} label='Ngày dừng hoạt động' type='date' />
                            </div>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
            <div className='mb-4'></div>
        </AddForm>
    )
}

export default UpdateExchange;
