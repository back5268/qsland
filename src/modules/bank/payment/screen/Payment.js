import React, { Fragment, useState } from 'react';
import { Inputz, GridForm, Calendarz, Dropdownz } from '@/components/ListForm';
import {RenderHeader, TimeBody, Body, Columnz, DataTablez, useGetParams} from "@/components/DataTable";
import { status_payment, useCountPayment, useListPayment } from "../util";
import { htgds, statusBill } from '@/modules/transaction_management/contract/utils';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListUserV2 } from '@/modules/users/user/util';
import { getSale } from '@/utils';
import { databaseDate } from '@/lib/convertDate';
import { formatNumber, useListProductName } from '@/modules/categories/row_table/util';
import { reasons } from './UpdatePayment';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import Tag from '@/components/Tag';
import { useListSaleCampaign } from '@/modules/sales_manager/sales_campaign/util';
import { viewPdfHopDong } from '@/modules/transaction_management/contract/api';
import { xemPhieuThu } from '../api';
import moment from "moment/moment";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ code: '', bill: '' });
    const categories = useListCategoryV2();
    const users = useListUserV2();
    const campaignSales = useListSaleCampaign();
    const products = useListProductName();

    const handleFilter = (filter) => {
        const filters = {
            ...filter, from: filter.dates && databaseDate(filter.dates[0]),
            to: filter.dates && filter.dates[1] ? databaseDate(filter.dates[1], true)
                : filter.dates && databaseDate(filter.dates[0], true), dates: undefined,
        };
        return filters;
    };

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-12" >
            <Inputz value={filter.code} onChange={e => setFilter({ ...filter, code: e.target.value })}
                placeholder="Nhập mã thanh toán" />
            <Dropdownz value={filter.category_id} options={categories}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })} placeholder="Chọn dự án" />
            <Inputz value={filter.bill} onChange={e => setFilter({ ...filter, bill: e.target.value })}
                placeholder="Nhập mã hợp đồng" />
            <Dropdownz value={filter.status} options={status_payment}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} placeholder="Chọn trạng thái" />
            <Dropdownz value={filter.product_id} options={products}
                onChange={(e) => setFilter({ ...filter, product_id: e.target.value })} placeholder="Chọn bất động sản" />
            <Dropdownz value={filter.sale_campaign_id} options={campaignSales} optionLabel="title"
                onChange={(e) => setFilter({ ...filter, sale_campaign_id: e.target.value })} placeholder="Chọn chiến dịch bán hàng" />
            <Dropdownz value={filter.user_sale_id} options={getSale(users)}
                onChange={(e) => setFilter({ ...filter, user_sale_id: e.target.value })} placeholder="Chọn Nhân viên" />
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
        </GridForm>
    )
};

const Payment = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListPayment({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountPayment({ ...paramsPaginator, first: undefined });
    const [loading, setLoading] = useState({});

    const BillBody = (e) => {
        if (e.bill) {
            const bill = e.bill
            const customer = JSON.parse(e.bill.info_customer);
            const status = statusBill.find(s => e.bill.status === s.id) || {}
            return <span><b>{e.bill.code}</b><br /><Tag className='mt-1 mb-1' value={status.name} severity={status.color}></Tag>
                <br /> <b>Giá trị hợp đồng:</b> {bill.product_id ? formatNumber(bill.total) : 'Đang cập nhật'}<br /> <b>Khách hàng:</b> {customer && customer.full_name} <br />
                <b>NV:</b> {e.sale_name} <br /> <b>Tài khoản:</b> {e.sale_account} </span>
        }
    }

    const ProductBody = (e) => {
        const product = e.product || {}
        return <Fragment>{product.code ? <b>{product.code}<br /></b> : ''} {e.campaign_name ? <Fragment> <b>Chiến dịch: </b>{e.campaign_name}<br /></Fragment> : ''}
            {e.building_name ? <Fragment><b>Tòa:</b> {e.building_name}<br /></Fragment> : ''} <b>Dự án:</b> {e.category_name}</Fragment>
    }

    const HtgdBody = (e) => {
        if (e.bill) {
            const htgd = htgds.find(h => h.id === e.bill.type_procedure)
            if (htgd) {
                return (
                    <span>{htgd.name}</span>
                )
            }
        }
    };

    const StatusBody = (e) => {
        const status = status_payment.find(s => e.status === s.id)
        if (status) {
            return (
                <Fragment>
                    <Tag value={status.name} severity={status.color}></Tag> <br />
                    {e.verifier && <Fragment>
                        <span><b>Người xác nhận:</b> {e.verifier}</span> <br />
                        <span><b>Thời gian:</b> {moment(e.updated_at).format("DD/MM/YYYY HH:mm:ss")}</span>
                    </Fragment>}
                </Fragment>
            )
        }
    };

    const ViewPdfHopDong = async ({ bill_id }) => {
        let obj = {}
        obj[bill_id] = true
        setLoading({ ...loading, ...obj })
        const response = await viewPdfHopDong({ bill_id })
        if (response.data.status) {
            window.open(response.data.data, '_blank')
            obj[bill_id] = false
            setLoading({ ...loading, ...obj })
        }
    }

    const XemPhieuThu = async ({ payment_id }) => {
        const response = await xemPhieuThu({ payment_id: payment_id })
        if (response.data.status) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(response.data.data);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.print();
            };
            printWindow.document.close();
        }
    }

    const ActionBody = (e) => {
        return <Fragment>
            {(e.bill && (e.bill.status !== -10)) && <Link to={'/payment/detail/' + e.id}><Button label={(e.status === 1) ? "Thu tiền" : "Xem chi tiết"} style={{ fontSize: '12px', padding: '4px', minWidth: '96px' }} severity={(e.status === 1) ? "warning" : ""} size="small" /></Link>}
            <Button loading={loading[e.bill_id]} onClick={() => ViewPdfHopDong({ bill_id: e.bill_id })} label="Xem file hợp đồng" className='mt-1' style={{ fontSize: '12px', padding: '4px' }} />
            {e.status === 2 ? <Button onClick={() => XemPhieuThu({ payment_id: e.id })} label="Xem phiếu thu" className='mt-1' style={{ fontSize: '12px', padding: '4px' }} /> : ''}
        </Fragment>
    };

    const header = RenderHeader({ title: 'Danh sách thanh toán', add: '/payment/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={header} title="thanh toán" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Mã thanh toán" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={ProductBody} header="Sản phẩm / chiến dịch" bodyStyle={{ minWidth: '14rem' }} />
                <Columnz body={BillBody} header="Hợp đồng" bodyStyle={{ minWidth: '15rem' }} />
                <Columnz body={e => <Fragment>{formatNumber(e.bill && e.bill.sumary)}</Fragment>} header="Số tiền quy định" bodyStyle={{ textAlign: 'center', minWidth: '4rem' }} />
                <Columnz body={e => formatNumber(e.will_pay)} header="Số tiền yêu cầu" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={e => { if (e.status === 2) return <Fragment>{formatNumber(e.total)}</Fragment> }} header="Thực thu" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={HtgdBody} header="Hình thức GD" bodyStyle={{ minWidth: '8rem', textAlign: 'center' }} />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
                <Columnz body={e => (e.type_reason === 4) ? <span>{e.reason}</span> : Body(reasons, e.type_reason)} header="Lý do từ chối" bodyStyle={{ minWidth: '8rem' }} />
                <Columnz body={StatusBody} header="Trạng thái" bodyStyle={{ textAlign: 'center', minWidth: '13rem' }} />
                <Columnz header="Actions" body={ActionBody} bodyStyle={{ textAlign: 'center', minWidth: '9rem' }} />
            </DataTablez>
        </div>
    )
}

export default Payment;