import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { databaseDate } from "@/lib/convertDate";
import { Accordion, AccordionTab } from 'primereact/accordion';

import { updateCustomer, addCustomer } from "../api";
import { listToast, refreshObject, scrollToTop, useListCity, useListDistrict, useListWard } from "@/utils";
import { useDetailCustomer, approachForm, interactiveStatus, genders, countrys } from "../util";
import { useListSource } from "../../source_customer/util";
import { useListGroupCustomer } from "../../group_customer/util";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { removePropObject } from "@/utils";
import { UploadImg } from "@/components/UploadImages";
import { InputForm, DropdownForm, AddForm } from "@/components/AddForm";

const InfoRequired = (props) => {
    const { infos, setInfos, role_master } = props;
    const sources = useListSource();
    const category = useListCategoryV2();
    const listGroupCustomers = useListGroupCustomer();

    return (
        <div className="w-full">
            <div style={{ backgroundColor: '#f8f9fa' }} className="card grid formgrid">
                <div className="col-12 lg:col-6">
                    <InputForm id='full_name' value={infos.full_name} onChange={(e) => setInfos({ ...infos, full_name: e.target.value })} label='Khách hàng (*)' required />
                    <InputForm id='phone' value={infos.phone} disabled={!role_master && infos.create_type === 1} onChange={(e) => setInfos({ ...infos, phone: e.target.value })}
                        label='Số điện thoại (*)' type={infos.id ? 'text' : 'number'} required />
                </div>
                <div className="col-12 lg:col-6">
                    <DropdownForm label='Nguồn (*)' disabled={!role_master && infos.create_type === 1} value={infos.source_id}
                        onChange={(e) => setInfos({ ...infos, source_id: e.target.value })} options={sources} />
                    <DropdownForm label='Nhóm khách hàng (*)' value={infos.group_customer_id} disabled={!role_master}
                        onChange={(e) => setInfos({ ...infos, group_customer_id: e.target.value })} options={listGroupCustomers} />
                    <DropdownForm label={role_master ? 'Dự án (*)' : 'Dự án'} value={infos.category_id}
                        onChange={(e) => setInfos({ ...infos, category_id: e.target.value })} options={category} />
                </div>
            </div>
        </div>
    )
};

const MoreInfo = (props) => {
    const { infos, setInfos, role_master, imgBack, imgFront, setImgBack, setImgFront } = props;
    return (
        <div className="w-full">
            <h6 className="mb-2">Tình trạng khách hàng</h6>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card grid formgrid">
                <div className="col-12 lg:col-8">
                    <div className="grid formgrid mb-2">
                        <div className="col-12 sm:col-4 mb-2">
                            <div className="flex flex-column gap-3">
                                {interactiveStatus.map((s, index) => (
                                    <div key={s.id} className="flex align-items-center">
                                        <RadioButton
                                            inputId={`interactiveStatus_${s.id}`}
                                            name="interactiveStatus"
                                            value={`interactiveStatus_${s.id}`}
                                            onChange={() => setInfos({ ...infos, interactive_status: s.id })}
                                            checked={infos.interactive_status === (s.id)}
                                        />
                                        <label htmlFor={`interactiveStatus_${s.id}`} className="ml-2">{s.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 sm:col-8 mb-2">
                            <label className="block text-900 font-medium mr-2">Mô tả chi tiết (*)</label>
                            <InputTextarea required={true} autoResize value={infos.note} onChange={(e) => setInfos({ ...infos, note: e.target.value })} rows={6} cols={40} />
                            <label className="block text-900 font-medium mt-4 mb-2">Hình thức tương tác</label>
                            <div className="flex gap-3">
                                {approachForm.map((s, index) => (
                                    <div key={index + 1} className="flex align-items-center">
                                        <RadioButton
                                            inputId={`interactive_form_${index + 1}`}
                                            name="interactive_form"
                                            value={`interactive_form_${index + 1}`}
                                            onChange={() => setInfos({ ...infos, interactive_form: index + 1 })}
                                            checked={infos.interactive_form === (index + 1)}
                                        />
                                        <label htmlFor={`interactive_form_${index + 1}`} className="ml-2">{s}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-4">
                    <label className="block mb-5 text-900 font-medium">Ảnh xác minh của khách</label>
                    <div className="flex align-items-center justify-content-around">
                        <UploadImg image={imgFront} setImage={setImgFront} title='Mặt trước' />
                        <UploadImg image={imgBack} setImage={setImgBack} title='Mặt sau' />
                    </div>
                </div>
            </div>
        </div>
    )
};

const DetailInfo = (props) => {
    const { infos, setInfos, customerInfo, role_master, imgBack, imgFront, setImgBack, setImgFront } = props;
    const citys = useListCity();
    const districts = useListDistrict(infos.city_id);
    const wards = useListWard(infos.district_id);
    const cb_districts = useListDistrict(infos.cb_city_id);
    const cb_wards = useListWard(infos.cb_district_id);

    return (
        <div className="w-full">
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <div className="grid formgrid">
                    <div className="col-12 lg:col-6">
                        <InputForm id='cmt_full_name' value={infos.cmt_full_name} onChange={(e) => setInfos({ ...infos, cmt_full_name: e.target.value })} label='Họ tên khách hàng trên CCCD \ Hộ chiếu' />
                        <DropdownForm label='Quốc tịch' value={infos.country} onChange={(e) => setInfos({ ...infos, country: e.target.value })} options={countrys} />
                        <DropdownForm label='Giới tính' value={infos.sex} onChange={(e) => setInfos({ ...infos, sex: e.target.value })} options={genders} />
                        <InputForm id='email' value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })} label='Email' type='email' />
                        <InputForm id='birthday' value={infos.birthday} onChange={(e) => setInfos({ ...infos, birthday: e.target.value })} label='Ngày sinh' type='date' />
                        <InputForm id='cmt_number' value={infos.cmt_number} onChange={(e) => setInfos({ ...infos, cmt_number: e.target.value })} label='CCCD \ Hộ chiếu' />
                        <InputForm id='cmt_date' value={infos.cmt_date} onChange={(e) => setInfos({ ...infos, cmt_date: e.target.value })} label='Ngày cấp' type='date' />
                        <InputForm id='cmt_address' value={infos.cmt_address} onChange={(e) => setInfos({ ...infos, cmt_address: e.target.value })} label='Nơi cấp' />
                    </div>
                    <div className="col-12 lg:col-6">
                        <h6 className="mb-2">Địa chỉ thường trú:</h6> <hr />
                        <DropdownForm label='Tỉnh / TP' optionValue="value" value={infos.cb_city_id} onChange={(e) => setInfos({ ...infos, cb_city_id: e.target.value, cb_district_id: undefined, cb_ward_id: undefined })} optionLabel='text' options={citys} />
                        <DropdownForm label='Quận / Huyện' optionValue="value" value={infos.cb_district_id} onChange={(e) => setInfos({ ...infos, cb_district_id: e.target.value, cb_ward_id: undefined })} optionLabel='text' options={cb_districts} />
                        <DropdownForm label='Phường / Xã' optionValue="value" value={infos.cb_ward_id} onChange={(e) => setInfos({ ...infos, cb_ward_id: e.target.value })} optionLabel='text' options={cb_wards} />
                        <InputForm id='cb_address' value={infos.cb_address} onChange={(e) => setInfos({ ...infos, cb_address: e.target.value })} label='Địa chỉ cụ thể' />

                        <h6 className="mb-2">Địa chỉ liên hệ:</h6> <hr />
                        <DropdownForm label='Tỉnh / TP' optionValue="value" value={infos.city_id} onChange={(e) => setInfos({ ...infos, city_id: e.target.value, district_id: undefined, ward_id: undefined })} optionLabel='text' options={citys} />
                        <DropdownForm label='Quận / Huyện' optionValue="value" value={infos.district_id} onChange={(e) => setInfos({ ...infos, district_id: e.target.value, ward_id: undefined })} optionLabel='text' options={districts} />
                        <DropdownForm label='Phường / Xã' optionValue="value" value={infos.ward_id} onChange={(e) => setInfos({ ...infos, ward_id: e.target.value })} optionLabel='text' options={wards} />
                        <InputForm id='address' value={infos.address} onChange={(e) => setInfos({ ...infos, address: e.target.value })} label='Địa chỉ cụ thể' />
                    </div>
                </div>
                <MoreInfo role_master={role_master} customerInfo={customerInfo} infos={infos} setInfos={setInfos}
                    imgBack={imgBack} setImgBack={setImgBack} imgFront={imgFront} setImgFront={setImgFront} />
            </div>
        </div>
    )
};

const UpdateCustomer = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const customerInfo = useDetailCustomer(id);
    const [imgFront, setImgFront] = useState('');
    const [imgBack, setImgBack] = useState('');
    const role_master = useSelector(state => state.roles.master);
    const [infos, setInfos] = useState({
        full_name: '', phone: '', cmt_full_name: '', email: '', birthday: '', group_customer_id: !role_master ? 1 : undefined,
        cmt_address: '', cmt_number: '', cmt_date: '', address: '', cb_address: ''
    });

    useEffect(() => {
        let newCustomerInfo = { ...infos, ...customerInfo };
        newCustomerInfo = {
            ...newCustomerInfo, cmt_date: databaseDate(newCustomerInfo.cmt_date, false, 'date'),
            birthday: databaseDate(newCustomerInfo.birthday, false, 'date'),
        };

        if (newCustomerInfo.id) setInfos(newCustomerInfo);
    }, [customerInfo, role_master]);

    useEffect(() => {
        if (customerInfo && customerInfo.images && customerInfo.images !== JSON.stringify({})) {
            setImgFront(JSON.parse(customerInfo.images).cmt_img_before);
            setImgBack(JSON.parse(customerInfo.images).cmt_img_after);
        };
    }, [customerInfo]);

    const handleData = () => {
        if (!infos.source_id) {
            return "Vui lòng chọn nguồn khách hàng"
        };
        if (!infos.group_customer_id) {
            return "Vui lòng chọn nhóm khách hàng"
        };
        if (role_master && !infos.category_id) {
            return "Vui lòng chọn dự án"
        };
        let info = {
            ...infos, files: { cmt_img_before: imgFront, cmt_img_after: imgBack },
            images: {
                cmt_img_before: imgFront ? imgFront : undefined,
                cmt_img_after: imgBack ? imgBack : undefined
            },
        };
        info = {
            ...removePropObject(info, customerInfo), id: customerInfo.id,
            birthday: databaseDate(info.birthday),
            cmt_date: databaseDate(info.cmt_date),
        };
        return info
    };

    const checkUpdate = () => {
        if (role_master && customerInfo.create_type === 2) {
            dispatch(showToast({ ...listToast[1], detail: 'Đây là khách hàng do sale nhập lên, bạn không thể sửa thông tin!' }));
            return false
        } else return true
    }

    return (
        <AddForm checkId={Number(id)} title='khách hàng' handleData={handleData}
            route={Number(id) ? '/customer/update' : '/customer/add'}
            actions={{ add: addCustomer, update: updateCustomer }}
            refreshObjects={[setInfos]} checkUpdate={checkUpdate} >
            <Accordion multiple activeIndex={[0]} className="mb-4">
                <AccordionTab header="Thông tin bắt buộc">
                    <InfoRequired role_master={role_master} infos={infos} setInfos={setInfos} />
                </AccordionTab>
                <AccordionTab header="Thông tin chi tiết">
                    <DetailInfo imgBack={imgBack} setImgBack={setImgBack} imgFront={imgFront} setImgFront={setImgFront}
                        role_master={role_master} customerInfo={customerInfo} infos={infos} setInfos={setInfos} />
                </AccordionTab>
            </Accordion>
        </AddForm>
    )
};

export default UpdateCustomer;