import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showToast } from '@/redux/features/toast';
import { databaseDate } from "@/lib/convertDate";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { confirmDialog } from "primereact/confirmdialog";
import { UploadImg } from '@/components/UploadImages';
import { addUser, updateUser } from "../api";
import { useDetailUser, genders, marital_statuss } from "../util";
import { useListCity, useListDistrict, useListWard } from "@/utils";
import { useListCompany } from "@/modules/companys/company/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListGroupSaleV2 } from "../../group_sale/util";
import { DropdownForm, InputForm, AddForm } from "@/components/AddForm";
import { removePropObject, listToast } from "@/utils";
import { useDispatch } from 'react-redux';

const InfoRequired = (props) => {
    const { infos, setInfos } = props;
    const companys = useListCompany();
    const exchanges = useListExchange({ company_id: infos.company_id });
    const groupSale = useListGroupSaleV2({ company_id: infos.company_id, exchange_id: infos.exchange_id });

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <InputForm value={infos.full_name} onChange={(e) => setInfos({ ...infos, full_name: e.target.value })}
                        id='full_name' label='Tên nhân viên (*)' required />
                    <InputForm value={infos.code_staff} onChange={(e) => setInfos({ ...infos, code_staff: e.target.value })}
                        id='code_staff' label='Mã nhân viên (*)' required disabled={infos.user_id} />
                    <InputForm value={infos.username} onChange={(e) => setInfos({ ...infos, username: e.target.value })}
                        id='username' label='Tài khoản (*)' required disabled={infos.user_id} />
                    <InputForm value={infos.phone} onChange={(e) => setInfos({ ...infos, phone: e.target.value })}
                        id='phone' label='Số điện thoại' type='phone' />
                    <InputForm value={infos.pword} onChange={(e) => setInfos({ ...infos, pword: e.target.value })}
                        id='pword' label='Mật khẩu' type='password' required={!infos.user_id} />
                </div>
                <div className="col-12 lg:col-6">
                    <DropdownForm onChange={(e) => setInfos({ ...infos, company_id: e.target.value, exchange_id: undefined, group_sale_id: undefined })}
                        label='Công ty (*)' options={companys} value={infos.company_id} />
                    <DropdownForm value={infos.exchange_id} onChange={(e) => setInfos({ ...infos, exchange_id: e.target.value, group_sale_id: undefined })}
                        label='Phòng ban (*)' options={infos.company_id ? exchanges : []} />
                    <DropdownForm value={infos.group_sale_id} onChange={(e) => setInfos({ ...infos, group_sale_id: e.target.value })}
                        label='Nhóm' options={infos.exchange_id ? groupSale : []} />
                    <InputForm value={infos.email} onChange={(e) => setInfos({ ...infos, email: e.target.value })}
                        id='email' label='Email đăng ký' type='email' required />
                    <InputForm value={infos.pwordConfirm} onChange={(e) => setInfos({ ...infos, pwordConfirm: e.target.value })}
                        id='pwordConfirm' label='Xác nhận mật khẩu' type='password' required={!infos.user_id} />
                </div>
            </div>
        </div>
    )
};

const BaseInfo = (props) => {
    const { infos, setInfos } = props;

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <DropdownForm value={infos.gender} onChange={(e) => setInfos({ ...infos, gender: e.target.value })} label='Giới tính' options={genders} />
                    <InputForm value={infos.position} onChange={(e) => setInfos({ ...infos, position: e.target.value })} id='position' label='Chức danh' />
                    <InputForm value={infos.social_insurance_code} onChange={(e) => setInfos({ ...infos, social_insurance_code: e.target.value })} id='social_insurance_code' label='Mã số BHXH' />
                    <InputForm value={infos.birthday} onChange={(e) => setInfos({ ...infos, birthday: e.target.value })} id='birthday' label='Ngày sinh' type='date' />
                    <InputForm value={infos.place_birth} onChange={(e) => setInfos({ ...infos, place_birth: e.target.value })} id='place_birth' label='Nơi sinh' />
                </div>
                <div className="col-12 lg:col-6">
                    <InputForm value={infos.cmt_number} onChange={(e) => setInfos({ ...infos, cmt_number: e.target.value })} id='cmt_number' label='CMND / CCCD' />
                    <InputForm value={infos.cmt_date} onChange={(e) => setInfos({ ...infos, cmt_date: e.target.value })} id='cmt_date' label='Ngày cấp' type='date' />
                    <InputForm value={infos.cmt_province} onChange={(e) => setInfos({ ...infos, cmt_province: e.target.value })} id='cmt_province' label='Nơi cấp' />
                    <InputForm value={infos.cmt_expiry} onChange={(e) => setInfos({ ...infos, cmt_expiry: e.target.value })} id='cmt_expiry' label='Hạn' type='date' />
                    <DropdownForm value={infos.marital_status} onChange={(e) => setInfos({ ...infos, marital_status: e.target.value })} label='Tình trạng hôn nhân' options={marital_statuss} />
                </div>
            </div>
        </div>
    )
};

const ContactInfo = ({ infos, setInfos }) => {
    const citys = useListCity();
    const districts = useListDistrict(infos.city_id);
    const wards = useListWard(infos.district_id);
    const cb_districts = useListDistrict(infos.cb_city_id);
    const cb_wards = useListWard(infos.cb_district_id);

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="grid formgrid">
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
    )
};

const UpdateUser = () => {
    const { id } = useParams();
    const getUserInfo = useDetailUser(id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [signature, setSignature] = useState(null);
    const [infos, setInfos] = useState({
        full_name: '', code_staff: '', username: '', phone: '', pword: '', email: '',
        pwordConfirm: '', position: '', social_insurance_code: '', birthday: '',
        place_birth: '', cmt_number: '', cmt_date: '', cmt_province: '', cmt_expiry: '',
        email_contact: '', address: '', cb_address: '',
    });

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

    const handleData = () => {
        if (!infos.company_id) {
            return "Vui lòng chọn công ty"
        }
        if (!infos.exchange_id) {
            return "Vui lòng chọn phòng ban"
        }
        if (infos.pword !== infos.pwordConfirm) {
            return "Mật khẩu nhập lại không chính sách"
        }
        let info = {
            ...infos, file: avatar, signature: signature ? signature : undefined
        };
        if (Number(id)) {
            info = {
                ...removePropObject(info, userInfo), id: Number(id),
                birthday: info.birthday ? databaseDate(info.birthday) : undefined,
                cmt_date: info.cmt_date ? databaseDate(info.cmt_date) : undefined,
                cmt_expiry: info.cmt_expiry ? databaseDate(info.cmt_expiry) : undefined,
            };
            info.signature = userInfo.signature ? (signature ? (String(signature.preview) === JSON.parse(userInfo.signature)[0] ? undefined : signature) : []) : (signature ? signature : undefined);
            info.avatar = avatar ? infos.avatar : []
        };
        return info;
    }

    const checkUpdate = () => {
        const accept = async () => {
            const response = await updateUser(info);
            if (response.data.status) {
                navigate('/user');
                dispatch(showToast({ ...listToast[0], detail: `Cập nhật người dùng thành công!` }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        }

        const confirm = () => {
            confirmDialog({
                message: 'Cập nhật công ty hoặc phòng ban sẽ tự động xóa nhân viên khỏi nhóm cũ, bạn có muốn tiếp tục?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            })
        }
        const info = handleData()
        if (info.exchange_id || info.company_id) confirm();
        else return true
    }

    return (
        <AddForm checkId={Number(id) || false} title='người dùng' handleData={handleData}
            route={Number(id) ? '/user/update' : '/user/add'}
            actions={{ add: addUser, update: updateUser }} checkUpdate={checkUpdate} >
            <Accordion multiple activeIndex={[0]} className='mb-4'>
                <AccordionTab header="Thông tin bắt buộc">
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-2">
                            <UploadImg image={avatar} setImage={setAvatar} title='Ảnh đại diện' />
                        </div>
                        <div className="col-12 lg:col-10 mt-8 lg:mt-0">
                            <InfoRequired infos={infos} setInfos={setInfos} />
                        </div>
                    </div>
                </AccordionTab>
                <AccordionTab header="Thông tin cơ bản">
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-2">
                            <UploadImg image={signature} setImage={setSignature} title='Ảnh chữ ký' />
                        </div>
                        <div className="col-12 lg:col-10 mt-8 lg:mt-0">
                            <BaseInfo infos={infos} setInfos={setInfos} />
                        </div>
                    </div>
                </AccordionTab>
                <AccordionTab header="Thông tin liên hệ">
                    <ContactInfo infos={infos} setInfos={setInfos} />
                </AccordionTab>
            </Accordion>
        </AddForm>
    )
};

export default UpdateUser;