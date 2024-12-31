import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { databaseDate } from "@/lib/convertDate";
import { Accordion, AccordionTab } from 'primereact/accordion';

import { updateUser } from "../api";
import { useDetailUser, genders, marital_statuss } from "../util";
import { listToast, useListCity, useListDistrict, useListWard } from "@/utils";
import { useListCompany } from "@/modules/companys/company/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListGroupSaleV2 } from "../../group_sale/util";
import { removePropObject } from "@/utils";
import { useNavigate } from "react-router-dom";
import { UploadImg } from "@/components/UploadImages";
import { DropdownForm, InputForm } from "@/components/AddForm";
import { Button } from '@/uiCore';

const DetailUser = ({ user_id }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(null);
    const [signature, setSignature] = useState(null);
    const [loading, setLoading] = useState(false);
    const getUserInfo = useDetailUser(user_id);
    const [userInfo, setUserInfo] = useState({});
    const [infos, setInfos] = useState({
        full_name: '', code_staff: '', username: '', phone: '', email: '',
        position: '', social_insurance_code: '', birthday: '', place_birth: '',
        cmt_number: '', cmt_date: '', cmt_province: '', cmt_expiry: '',
        email_contact: '', address: '', cb_address: '',
    });

    const companys = useListCompany();
    const exchanges = useListExchange({ company_id: infos.company_id });
    const groupSale = useListGroupSaleV2({ exchange_id: infos.exchange_id });

    const citys = useListCity();
    const districts = useListDistrict(infos.city_id);
    const wards = useListWard(infos.district_id);
    const cb_districts = useListDistrict(infos.cb_city_id);
    const cb_wards = useListWard(infos.cb_district_id);

    useEffect(() => {
        let newUserInfo = {
            ...infos, ...getUserInfo.group, ...getUserInfo.user_info, ...getUserInfo.user,
            group_sale_id: getUserInfo.group && getUserInfo.group.id,
        };
        newUserInfo = {
            ...newUserInfo, cmt_date: databaseDate(newUserInfo.cmt_date, false, 'date'),
            birthday: databaseDate(newUserInfo.birthday, false, 'date'),
            cmt_expiry: databaseDate(newUserInfo.cmt_expiry, false, 'date')
        };
        if (newUserInfo.id) {
            setInfos(newUserInfo);
            setUserInfo(newUserInfo);
        };
    }, [getUserInfo])

    useEffect(() => {
        if (userInfo.avatar && JSON.parse(userInfo.avatar)[0])
            setAvatar({ ...avatar, preview: JSON.parse(userInfo.avatar)[0] })
        if (userInfo.signature && JSON.parse(userInfo.signature)[0])
            setSignature({ ...signature, preview: JSON.parse(userInfo.signature)[0] })
    }, [userInfo]);

    async function fetchDataSubmit(info) {
        const response = await updateUser(info);
        if (response) setLoading(false);
        if (response.data.status) {
            dispatch(showToast({ ...listToast[0], detail: 'Cập nhật người dùng thành công!' }));
            navigate(0);
        } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let info = {
            ...infos, file: avatar, signature: signature ? signature : undefined
        };
        if (Number(userInfo.id)) {
            info = {
                ...removePropObject(info, userInfo), id: Number(userInfo.id),
                birthday: info.birthday ? databaseDate(info.birthday) : undefined,
                cmt_date: info.cmt_date ? databaseDate(info.cmt_date) : undefined,
                cmt_expiry: info.cmt_expiry ? databaseDate(info.cmt_expiry) : undefined,
            };
            info.signature = userInfo.signature ? (signature ? (String(signature.preview) === JSON.parse(userInfo.signature)[0] ? undefined : signature) : []) : (signature ? signature : undefined);
            info.avatar = avatar ? infos.avatar : []
        };
        setLoading(true);
        fetchDataSubmit(info);
    };

    return (
        <div className="grid formgrid mt-2">
            <div className="col-12 lg:col-2">
                <UploadImg image={avatar} setImage={setAvatar} title='Ảnh đại diện' />
                <div className='mt-8'></div>
                <UploadImg image={signature} setImage={setSignature} title='Ảnh chữ ký' />
            </div>
            <form onSubmit={handleSubmit} className="col-12 lg:col-10 lg:mt-0">
                <Accordion multiple activeIndex={[0]}>
                    <AccordionTab header="Thông tin bắt buộc">
                        <div className="w-full">
                            <div style={{ backgroundColor: '#f8f9fa' }} className="card grid formgrid">
                                <div className="col-12 lg:col-6">
                                    <InputForm id='full_name' value={infos.full_name} onChange={(e) => setInfos({ ...infos, full_name: e.target.value })} label='Tên nhân viên' required />
                                    <InputForm id='code_staff' disabled value={infos.code_staff} onChange={(e) => setInfos({ ...infos, code_staff: e.target.value })} label='Mã nhân viên' required />
                                    <InputForm id='username' disabled value={infos.username} onChange={(e) => setInfos({ ...infos, username: e.target.value })} label='Tài khoản' required />
                                    <InputForm id='email' value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })} label='Email đăng ký' disabled type='email' />
                                </div>
                                <div className="col-12 lg:col-6">
                                    <DropdownForm label='Công ty' disabled value={infos.company_id} options={companys} />
                                    <DropdownForm label='Phòng ban' disabled value={infos.exchange_id} options={infos.company_id ? exchanges : []} />
                                    <DropdownForm label='Nhóm' disabled value={infos.group_sale_id} options={infos.exchange_id ? groupSale : []} />
                                    <InputForm id='phone' value={infos.phone} onChange={(e) => setInfos({ ...infos, phone: e.target.value })} label='Số điện thoại' type='phone' />
                                </div>
                            </div>
                        </div>
                    </AccordionTab>
                    <AccordionTab header="Thông tin cơ bản">
                        <div className="w-full">
                            <div style={{ backgroundColor: '#f8f9fa' }} className="card grid formgrid">
                                <div className="col-12 lg:col-6">
                                    <DropdownForm label='Giới tính' value={infos.gender} onChange={(e) => setInfos({ ...infos, gender: e.target.value })} options={genders} />
                                    <InputForm id='position' value={infos.position} onChange={(e) => setInfos({ ...infos, position: e.target.value })} label='Chức danh' />
                                    <InputForm id='social_insurance_code' value={infos.social_insurance_code} onChange={(e) => setInfos({ ...infos, social_insurance_code: e.target.value })} label='Mã số BHXH' />
                                    <InputForm id='birthday' value={infos.birthday} onChange={(e) => setInfos({ ...infos, birthday: e.target.value })} label='Ngày sinh' type='date' />
                                    <InputForm id='place_birth' value={infos.place_birth} onChange={(e) => setInfos({ ...infos, place_birth: e.target.value })} label='Nơi sinh' />
                                </div>
                                <div className="col-12 lg:col-6">
                                    <InputForm id='cmt_number' value={infos.cmt_number} onChange={(e) => setInfos({ ...infos, cmt_number: e.target.value })} label='CMND / CCCD' />
                                    <InputForm id='cmt_date' value={infos.cmt_date} onChange={(e) => setInfos({ ...infos, cmt_date: e.target.value })} label='Ngày cấp' type='date' />
                                    <InputForm id='cmt_province' value={infos.cmt_province} onChange={(e) => setInfos({ ...infos, cmt_province: e.target.value })} label='Nơi cấp' />
                                    <InputForm id='cmt_expiry' value={infos.cmt_expiry} onChange={(e) => setInfos({ ...infos, cmt_expiry: e.target.value })} label='Hạn' type='date' />
                                    <DropdownForm label='Tình trạng hôn nhân' value={infos.marital_status} onChange={(e) => setInfos({ ...infos, marital_status: e.target.value })} options={marital_statuss} />
                                </div>
                            </div>
                        </div>
                    </AccordionTab>
                    <AccordionTab header="Thông tin liên hệ">
                        <div className="w-full">
                            <div style={{ backgroundColor: '#f8f9fa' }} className="card grid formgrid">
                                <div className="col-12 lg:col-6">
                                    <InputForm id='email_contact' value={infos.email_contact} onChange={(e) => setInfos({ ...infos, email_contact: e.target.value })} label='Email cá nhân' type='email' />
                                    <DropdownForm label='Tỉnh / TP cư trú' optionValue="value" value={infos.city_id} onChange={(e) => setInfos({ ...infos, city_id: e.target.value, district_id: undefined, ward_id: undefined })} optionLabel='text' options={citys} />
                                    <DropdownForm label='Quận / Huyện cư trú' optionValue="value" value={infos.district_id} onChange={(e) => setInfos({ ...infos, district_id: e.target.value, ward_id: undefined })} optionLabel='text' options={districts} />
                                    <DropdownForm label='Phường / Xã cư trú' optionValue="value" value={infos.ward_id} onChange={(e) => setInfos({ ...infos, ward_id: e.target.value })} optionLabel='text' options={wards} />
                                    <InputForm id='address' value={infos.address} onChange={(e) => setInfos({ ...infos, address: e.target.value })} label='Địa chỉ cư trú' />
                                </div>
                                <div className="col-12 lg:col-6">
                                    <DropdownForm label='Tỉnh / TP thường trú' optionValue="value" value={infos.cb_city_id} onChange={(e) => setInfos({ ...infos, cb_city_id: e.target.value, cb_district_id: undefined, cb_ward_id: undefined })} optionLabel='text' options={citys} />
                                    <DropdownForm label='Quận / Huyện thường trú' optionValue="value" value={infos.cb_district_id} onChange={(e) => setInfos({ ...infos, cb_district_id: e.target.value, cb_ward_id: undefined })} optionLabel='text' options={cb_districts} />
                                    <DropdownForm label='Phường / Xã thường trú' optionValue="value" value={infos.cb_ward_id} onChange={(e) => setInfos({ ...infos, cb_ward_id: e.target.value })} optionLabel='text' options={cb_wards} />
                                    <InputForm id='cb_address' value={infos.cb_address} onChange={(e) => setInfos({ ...infos, cb_address: e.target.value })} label='Địa chỉ thường trú' />
                                </div>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
                <div className="w-full justify-content-end flex mt-4">
                    <Button type='submit' loading={loading} label="Cập nhật"
                        className="mt-2" severity="info" size="small" raised />
                </div>
            </form>
        </div>
    )
};

export default DetailUser;