import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { classNames } from 'primereact/utils';

import { useDetailPayment, useListBillByKeToan } from "../util";
import { updatePayment, addPayment } from "../api";

import { DropdownForm, InputForm, InputNumber, InputTextareaForm } from "@/components/AddForm";
import { listToast, scrollToTop, removePropObject, refreshObject, useDetailPermission } from "@/utils";
import { RadioButton } from '@/components/RadioButton';
import { useListProductName } from '@/modules/categories/row_table/util';
import { useListBuildingV2 } from '@/modules/categories/building/util';
import { useListBank } from '../../bank/util';
import { InputTextarea } from 'primereact/inputtextarea';
import { useDetailBill } from '@/modules/transaction_management/contract/utils';
import { useListRevenueCode } from '../../revenue_code/util';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { Button } from 'primereact/button';
import { UploadImages } from '@/components/UploadImages';
import { databaseDate } from '@/lib/convertDate';

export const reasons = [
    { name: 'Thừa đợt thanh toán', id: 1 },
    { name: 'Nhập sai số tiền', id: 2 },
    { name: 'Số tiền trên HD không đúng số tiền khách chuyển', id: 3 },
    { name: 'Khác', id: 4 },
]

const UpdatePayment = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const paymentInfo = useDetailPayment(id);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [error1, setError1] = useState(false);
    const [isAccountant, setIsAccountant] = useState(false);
    const [infos, setInfos] = useState({
        will_pay: '', total: '', account_holder: '',
    });
    const [infoBill, setInfoBill] = useState({
        user_id: '', customer_id: '', totalz: '',
    });
    const bills = useListBillByKeToan({ id: Number(id) ? id : undefined });
    const bill = useDetailBill(infos.bill_id);
    const products = useListProductName();
    const buildings = useListBuildingV2();
    const categories = useListCategoryV2();
    const banks = useListBank();
    const revenueCodes = useListRevenueCode();
    const permission = useDetailPermission();

    useEffect(() => {
        if (permission && permission[0]) {
            setIsAccountant(Boolean(permission.find(p => p.staff_object_id === "ketoan")));
        }
    }, [permission]);

    useEffect(() => {
        if (Number(id)) setInfos({ ...infos, ...paymentInfo });
    }, [paymentInfo]);

    useEffect(() => {
        let customerInfo = {}
        let newImages = []
        if (paymentInfo.image) {
            newImages.push({ preview: paymentInfo.image });
        };
        if (bill) {
            customerInfo = bill.bill && bill.bill.info_customer && JSON.parse(bill.bill.info_customer)
            if (customerInfo && customerInfo.cmt_img_before) newImages.push({ preview: customerInfo.cmt_img_before });
            if (customerInfo && customerInfo.cmt_img_after) newImages.push({ preview: customerInfo.cmt_img_after });
        }
        setImages([...newImages]);
    }, [paymentInfo.image, bill]);

    async function fetchDataSubmit(info) {
        if (Number(id)) {
            const response = await updatePayment(info);
            if (response) setLoading(false);
            if (response.data.status) {
                navigate('/payment');
                dispatch(showToast({ ...listToast[0], detail: 'Xác nhận thanh toán thành công!' }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        } else {
            const response = await addPayment(info);
            if (response) setLoading(false);
            if (response.data.status) {
                scrollToTop();
                setInfoBill({ ...refreshObject(infoBill) })
                setInfos({ ...refreshObject(infos) })
                dispatch(showToast({ ...listToast[0], detail: 'Thêm thanh toán thành công!' }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!infos.type_payment && !Number(id)) {
            dispatch(showToast({ ...listToast[1], detail: 'Vui lòng chọn phương thức thanh toán!' }));
            return
        }
        let info = { ...infos, total: Number(infos.total), will_pay: Number(infos.will_pay) };
        info.payment_date = infos.payment_date ? databaseDate(infos.payment_date) : undefined;
        if (Number(id)) {
            info = {
                ...removePropObject(info, paymentInfo), id: Number(id),
            };
        };
        setLoading(true);
        fetchDataSubmit(info);
    };

    const xacNhanThanhToan = (status) => {
        let info = { ...infos }
        info.payment_date = infos.payment_date ? databaseDate(infos.payment_date) : undefined;
        if (status === 'tu_choi') {
            if (!info.type_reason) {
                dispatch(showToast({ ...listToast[1], detail: 'Vui lòng nhập lý do!' }));
                return
            }
        } else {
            if (!info.total) {
                dispatch(showToast({ ...listToast[1], detail: 'Vui lòng nhập số tiền thực thu!' }));
                return
            }
        }
        if (Number(id)) {
            info = {
                ...removePropObject(info, paymentInfo), payment_id: Number(id), status
            };
        };
        fetchDataSubmit(info);
    };

    useEffect(() => {
        if (bill && bill.bill) {
            const billInfo = bill.bill
            const customer = JSON.parse(billInfo.info_customer);
            const user = JSON.parse(billInfo.info_sale);
            const campaign_sale = bill.campaign_sale || {}
            setInfoBill({
                ...infoBill, product_id: billInfo.product_id,
                user_id: user.full_name, customer_id: customer.full_name, desc: billInfo.note, totalz: billInfo.sumary
            });
            setInfos({ ...infos, note: billInfo.note })
        }
    }, [infos.bill_id, bill]);

    useEffect(() => {
        if (infos.payment_info_id) {
            const account_holder = banks.find(b => b.id === infos.payment_info_id)
            if (account_holder) setInfos({ ...infos, account_holder: account_holder.bank_number });
        }
    }, [infos.payment_info_id]);

    const dataType = [
        { name: 'Phiếu thu', id: 1 },
        { name: 'Phiếu chi', id: 2 },
    ];

    const pttts = [
        { name: 'Tiền mặt', id: 1 },
        { name: 'Chuyển khoản', id: 2 },
    ];

    return (
        <div className='w-8 card' style={{ margin: '0 auto' }} >
            <div className="flex justify-content-between align-items-center mb-4">
                <h4 className="m-0">{Number(id) ? "Chi tiết" : "Thêm mới"} thanh toán</h4>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                    <DropdownForm disabled={Number(id)} label='Hợp đồng (*)' value={infos.bill_id} optionLabel="code"
                        onChange={(e) => setInfos({ ...infos, bill_id: e.target.value })} options={bills} showClear={false} />
                    <div className="w-full flex align-items-center mb-4 mt-4">
                        <label className="block text-900 font-medium w-3 mr-2">Loại phiếu</label>
                        <RadioButton disabled={Number(id)} data={dataType} value={infos.type} onChange={e => setInfos({ ...infos, type: e })} />
                    </div>
                    {Number(id) ? <Fragment>
                        <DropdownForm disabled={Number(id)} label='Dự án (*)' value={infos.category_id}
                            onChange={(e) => (setInfoBill({ ...infoBill, category_id: e.target.value }))} options={categories} />
                        <DropdownForm disabled={Number(id)} label='Tòa nhà (*)' value={infos.building_id}
                            onChange={(e) => (setInfoBill({ ...infoBill, building_id: e.target.value }))} options={buildings} />
                    </Fragment> : <Fragment></Fragment>}
                    <DropdownForm disabled={Number(id) || infos.bill_id} label='Chọn căn' value={infoBill.product_id} 
                        onChange={(e) => setInfoBill({ ...infoBill, product_id: e.target.value })} options={products} showClear={false} />
                    <InputForm disabled id='customer_id' value={infoBill.customer_id}
                        onChange={(e) => setInfoBill({ ...infoBill, customer_id: e.target.value })} label='Khách hàng' />
                    <InputForm disabled id='user_id' value={infoBill.user_id}
                        onChange={(e) => setInfoBill({ ...infoBill, user_id: e.target.value })} label='Nhân viên' />
                    <InputTextareaForm id='desc' value={infos.desc} label='Mô tả'
                        onChange={(e) => setInfos({ ...infos, desc: e.target.value })} />
                    <InputTextareaForm id='note' value={infos.note} label='Ghi chú'
                        onChange={(e) => setInfos({ ...infos, note: e.target.value })} />
                    {Number(id) ? <UploadImages view={true} images={images} setImages={setImages} title='Ảnh xác minh' /> : ''}
                    <InputNumber disabled id='totalz' value={infoBill.totalz}
                        handleChange={(e) => setInfoBill({ ...infoBill, totalz: e })} label='Số tiền quy định' />
                    <InputNumber id='will_pay' value={infos.will_pay} label='Số tiền yêu cầu' required
                        handleChange={(e) => setInfos({ ...infos, will_pay: e })} />
                    <InputNumber id='total' value={infos.total} label='Số tiền thực thu/chi'
                        handleChange={(e) => setInfos({ ...infos, total: e })} />
                    <InputForm id='payment_date' value={infos.payment_date} type='datetime-local'
                        onChange={(e) => setInfos({ ...infos, payment_date: e.target.value })} label='Ngày thanh toán' />
                    <DropdownForm label='Phương thức thanh toán' value={infos.type_payment}
                        onChange={(e) => (setInfos({ ...infos, type_payment: e.target.value }))} options={pttts} />
                    <DropdownForm label='Ngân hàng' value={infos.payment_info_id} optionLabel="short_name"
                        onChange={(e) => (setInfos({ ...infos, payment_info_id: e.target.value }))} options={banks} />
                    <InputForm disabled id='account_holder' value={infos.account_holder}
                        onChange={(e) => setInfos({ ...infos, account_holder: e.target.value })} label='Tài khoản' />
                    <DropdownForm label='Loại doanh thu' value={infos.revenue_id} optionLabel="name"
                        onChange={(e) => (setInfos({ ...infos, revenue_id: e.target.value }))} options={revenueCodes} />
                    <div className="w-full flex mb-4 mt-4">
                        <label className="block text-900 font-medium w-3 mr-2">Lý do từ chối</label>
                        <div>
                            <RadioButton data={reasons} className="flex-column" value={infos.type_reason} onChange={e => setInfos({ ...infos, type_reason: e })} />
                            <InputTextarea disabled={!(infos.type_reason === 4)} autoResize rows={6} cols={30} className="w-full mt-4" id='note' value={infos.reason}
                                onChange={(e) => setInfos({ ...infos, reason: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="w-full justify-content-end flex">
                    <Button type='button' onClick={() => navigate(-1)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />
                    {!Number(id) && isAccountant && <Button type='submit' loading={loading} label={"Thêm mới"} className="ml-2" severity="info" size="small" raised />}
                    {(Number(infos.status) === 1) && isAccountant && <Fragment>
                        <Button type='button' onClick={() => xacNhanThanhToan("tu_choi")} label="Từ chối" className="ml-2" severity="danger" size="small" />
                        <Button type='button' onClick={() => xacNhanThanhToan("chap_thuan")} label="Thu tiền" className="ml-2" size="small" />
                    </Fragment>}
                </div>
            </form>


        </div>
    )
}

export default UpdatePayment;
