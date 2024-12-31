import { Fragment, useEffect, useState } from "react";
import { Button, Dropdown, FormInput, Tag } from "@/uiCore";
import { useNavigate, useParams } from "react-router-dom";
import { InputTextarea } from "@/uiCore";
import { useDispatch } from "react-redux";
import { type_bonus } from "../../sales_policy/util";
import { useDetailProgressBill } from "../util";
import { updateProgressBill } from "../api";
import { listToast } from "@/utils";
import { showToast } from "@/redux/features/toast";
import { databaseDate } from "@/lib/convertDate";
import { formatNumber } from "@/modules/categories/row_table/util";
import { InputNumber } from "@/components/AddForm";

const UpdatePaymentProgress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const progress_bill = useDetailProgressBill(id)
    const [infos, setInfos] = useState({ note: '', desc: '', expired_date: '', payment: '', total_payment: null});

    useEffect(() => {
        if (progress_bill.id) {
            setInfos({
                note: progress_bill.note || '',
                desc: progress_bill.desc || '',
                type_payment: progress_bill.type_payment,
                expired_date: databaseDate(progress_bill.expired_date, false, 'date'),
                payment: progress_bill.payment,
                total_payment: progress_bill.total_payment,
                id: progress_bill.id
            })
        }
    }, [progress_bill]);

    async function fetchDataSubmit(info) {
        const response = await updateProgressBill({ ...info });
        if (response.data.status) {
            navigate('/payment_progress');
            dispatch(showToast({ ...listToast[0], detail: 'Cập nhật tiến trình thanh toán thành công!' }));
        } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!(infos.expired_date || infos.payment || infos.total_payment)) {
            dispatch(showToast({ ...listToast[1], detail: 'Vui lòng nhập đủ thông tin bắt buộc' }));
            return
        }
        let info = { ...infos }
        info.expired_date = databaseDate(info.expired_date);
        fetchDataSubmit(info);
    };

    return (
        <form onSubmit={handleSubmit} className="card w-8" style={{ margin: '0 auto' }}>
            <h5 style={{ margin: '16px auto' }}><b>Tiến độ thanh toán đợt {progress_bill.payment_stage} - Hợp đồng {progress_bill.bill_code}</b></h5>
            <div className="card">
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Hợp đồng: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{progress_bill.bill_code}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Giá trị hợp đồng sau ưu đãi (không VAT): </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{formatNumber(progress_bill.total_payment)}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Ngày đặt cọc: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{progress_bill.bill_data && databaseDate(JSON.parse(progress_bill.bill_data).deposit_date, false, 'date')}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Ngày ký hợp đồng: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{progress_bill.bill_data &&  databaseDate(JSON.parse(progress_bill.bill_data).contract_signing_date, false, 'date')}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Chính sách áp dụng: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{progress_bill.sale_policy_name}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Phương án thanh toán: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{progress_bill.payment_progress_name}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Ngày tới hạn thanh toán (*): </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <FormInput id="expired_date" className="w-12" type='date' value={infos.expired_date}
                            onChange={(e) => setInfos({ ...infos, expired_date: e.target.value })} />
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Thanh toán (*): </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <div className="flex gap-4">
                            <FormInput id="payment" className="w-12" type='number' value={infos.payment}
                                onChange={(e) => setInfos({ ...infos, payment: e.target.value })} />
                            <Dropdown className="w-12" options={type_bonus} optionLabel="name" optionValue="id" style={{ maxHeight: '48px' }}
                                value={infos.type_payment} onChange={e => setInfos({ ...infos, type_payment: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="grid formgrid mt-4">
                    <div className="ml-1 col-12 lg:col-5">
                        <p>Số tiền thanh toán (không VAT) (*): </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <InputNumber id="total_payment" className="w-12" value={infos.total_payment}
                            handleChange={(e) => setInfos({ ...infos, total_payment: e })} />
                    </div>
                </div>

                <div className="ml-1 mt-2">
                    <p>Mô tả:</p>
                    <InputTextarea value={infos.desc} rows={5} cols={30} onChange={e => setInfos({ ...infos, desc: e.target.value })} className="w-full" />
                </div>
                <div className="ml-1 mt-2">
                    <p>Ghi chú:</p>
                    <InputTextarea value={infos.note} rows={5} cols={30} onChange={e => setInfos({ ...infos, note: e.target.value })} className="w-full" />
                </div>
            </div>
            <div className="w-full justify-content-end flex mb-4">
                <Button type='button' onClick={e => navigate('/payment_progress')} label='Trở lại' className="ml-1 mt-2" severity="secondary" size="small" raised />
                <Button type='submit' label='Cập nhật' className="ml-1 mt-2" severity="info" size="small" raised />
            </div>
        </form>
    )
};

export default UpdatePaymentProgress;