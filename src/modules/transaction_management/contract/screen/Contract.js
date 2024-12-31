import React, { Fragment, useState } from 'react';
import { Inputz, GridForm, Dropdownz, Calendarz } from '@/components/ListForm';
import {RenderHeader, Columnz, DataTablez, Body, TimeBody, useGetParams} from "@/components/DataTable";
import { useListBill, useCountBill, statusBill, prioritys, confirmForm, htgds, billTypes } from '../utils';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListBuildingV2 } from '@/modules/categories/building/util';
import { useListExchange } from '@/modules/companys/exchange/util';
import { useListGroupSaleV2 } from '@/modules/users/group_sale/util';
import { getSale, listToast } from '@/utils';
import { useListUserV2 } from '@/modules/users/user/util';
import { databaseDate } from '@/lib/convertDate';
import { formatNumber } from '@/modules/categories/row_table/util';
import { Button } from 'primereact/button';
import Tag from '@/components/Tag';
import { viewPdfHopDongCoc, viewPdfBaoGia, viewPdfHopDongCho, cancelBill, } from '../api';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { listPayment } from '@/modules/bank/payment/api';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key: '', code: '' });
    const categories = useListCategoryV2();
    const buildings = useListBuildingV2({ parent_id: filter.category_id });
    const exchanges = useListExchange();
    const groupSales = useListGroupSaleV2({ exchange_id: filter.exchange_id });
    const users = useListUserV2({ exchange_id: filter.exchange_id, group_sale_id: filter.group_sale_id });

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
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-6">
            <Inputz value={filter.key} onChange={e => setFilter({ ...filter, key: e.target.value })}
                placeholder="Nhập mã sản phẩm, BĐS thực tế" />
            <Inputz value={filter.code} onChange={e => setFilter({ ...filter, code: e.target.value })}
                placeholder="Nhập mã hợp đồng" />
            <Dropdownz value={filter.category_id} options={categories} showClear={true}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })} placeholder="Chọn dự án" />
            <Dropdownz value={filter.building_id} options={buildings} showClear={true}
                onChange={(e) => setFilter({ ...filter, building_id: e.target.value })} placeholder="Chọn tòa" />
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
            <Dropdownz value={filter.exchange_id} options={exchanges} placeholder="Chọn phòng ban" showClear={true}
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value, group_sale_id: undefined, user_id_sale: undefined })} />
            <Dropdownz value={filter.group_sale_id} options={groupSales} placeholder="Chọn nhóm sale" showClear={true}
                onChange={(e) => setFilter({ ...filter, group_sale_id: e.target.value, user_id_sale: undefined })} />
            <Dropdownz value={filter.user_sale_id} options={users} showClear={true}
                onChange={(e) => setFilter({ ...filter, user_sale_id: e.target.value })} placeholder="Chọn nhân viên" />
            <Dropdownz value={filter.status} options={statusBill} showClear={true}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} placeholder="Trạng thái" />
            <Dropdownz value={filter.priority} options={prioritys} showClear={true}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })} placeholder="Thứ tự ưu tiên" />
        </GridForm>
    )
};

const Contracts = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const data = useListBill({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountBill({ ...paramsPaginator, first: undefined });
    const [loading, setLoading] = useState({});
    const [visible, setVisible] = useState(false);
    const [payment, setPayment] = useState([]);
    const [status, setStatus] = useState(null);
    const [bill, setBill] = useState({});
    const permissionTool = useSelector(state => state.permission).permissionTool;
    const dispatch = useDispatch()

    const StatusBody = (e) => {
        const status = statusBill.find(s => e.status === s.id)
        if (status) return <Tag value={status.name} severity={status.color}></Tag>
    };

    const ViewPdfHopDongCho = async ({ bill_id, bill_code }) => {
        let obj = {}
        obj[bill_code + 1] = true
        setLoading({ ...loading, ...obj })
        const response = await viewPdfHopDongCho({ bill_id })
        if (response.data.status) {
            window.open(response.data.data, '_blank')
            if (response.data.data.includes(bill_code)) {
                obj[bill_code + 1] = false
                setLoading({ ...loading, ...obj })
            }
        } else {
            obj[bill_code + 1] = false
            setLoading({ ...loading, ...obj })
            dispatch(showToast({ ...listToast[1], detail: response.data.mess }))
        }
    }

    const ViewPdfHopDongCoc = async ({ bill_id, bill_code }) => {
        let obj = {}
        obj[bill_code + 2] = true
        setLoading({ ...loading, ...obj })
        const response = await viewPdfHopDongCoc({ bill_id })
        if (response.data.status) {
            window.open(response.data.data, '_blank')
            if (response.data.data.includes(bill_code)) {
                obj[bill_code + 2] = false
                setLoading({ ...loading, ...obj })
            }
        } else {
            obj[bill_code + 2] = false
            setLoading({ ...loading, ...obj })
            dispatch(showToast({ ...listToast[1], detail: response.data.mess }))
        }
    }

    const ViewPdfBaoGia = async ({ bill_id, bill_code }) => {
        let obj = {}
        obj[bill_code + 3] = true
        setLoading({ ...loading, ...obj })
        const response = await viewPdfBaoGia({ bill_id })
        if (response.data.status) {
            window.open(response.data.data, '_blank')
            if (response.data.data.includes(bill_code)) {
                obj[bill_code + 3] = false
                setLoading({ ...loading, ...obj })
            }
        } else {
            obj[bill_code + 3] = false
            setLoading({ ...loading, ...obj })
            dispatch(showToast({ ...listToast[1], detail: response.data.mess }))
        }
    }

    const handleCancelBill = async (bill) => {
        setBill({ ...bill })
        const response = await listPayment({ bill_id: bill.id, status: 2 })
        if (response.data.status) {
            setPayment([...response.data.data])
            setVisible(true)
        }
    }

    const ActionBody = (e) => {
        return (
            <div className='flex flex-column'>
                {permissionTool.includes('/contract/detail') ? <Link to={'/contract/detail/' + e.code} >
                    <Button label="Xem nhật ký" style={{ fontSize: '12px', padding: '4px' }} />
                </Link> : ''}
                <Button loading={loading[e.code + 1]} onClick={() => ViewPdfHopDongCho({ bill_id: e.id, bill_code: e.code })} label="Xem file hợp đồng chỗ" className='mt-1' style={{ fontSize: '12px', padding: '4px' }} />
                {e.opt ? <Button loading={loading[e.code + 2]} onClick={() => ViewPdfHopDongCoc({ bill_id: e.id, bill_code: e.code })} label="Xem file hợp đồng cọc" className='mt-1' style={{ fontSize: '12px', padding: '4px' }} /> : ''}
                {(e.sale_policy_id && e.product_id) ? <Button loading={loading[e.code + 3]} onClick={() => ViewPdfBaoGia({ bill_id: e.id, bill_code: e.code })} className='mt-1' label="Xem báo giá" style={{ fontSize: '12px', padding: '4px' }} /> : ''}
                {(permissionTool.includes('/contract/cancel') && ![12, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10].includes(e.status)) ? <Button onClick={a => handleCancelBill(e)} className='mt-1' label="Hủy hợp đồng" style={{ fontSize: '12px', padding: '4px' }} /> : ''}
            </div>
        )
    };

    const ProductBody = (e) => {
            return (
                <span>{e.product_code ? <b>{e.product_code}</b> : ''} {e.campaign_name ? <Fragment><br />{e.campaign_name}</Fragment> : ''}
                    <br /> Dự án: {e.category_name} {e.building_name ? <Fragment><br /> Tòa: {e.building_name}</Fragment> : ''}</span>
            )
    }

    const CustomerBody = (e) => {
        const customer = JSON.parse(e.info_customer);
        if (customer) {
            return (
                <span> <b>{customer.full_name}</b> <br /> <i className='pi pi-send' /> {customer.email}<br />
                    <i className='pi pi-credit-card' /> {customer.cmt_number} <br /> <i className='pi pi-map-marker' /> {customer.address} </span>
            )
        }
    }

    const SaleBody = (e) => {
        const user = JSON.parse(e.info_sale);
            return (
                <span> <b>{user.username}</b> <br /> <b>{user.full_name}</b> <br /> Chi nhánh {user.exchange_name} </span>
            )
    }

    const BillBody = (e) => {
        return <span style={{ lineHeight: '24px' }}>{e.code} <br /> Tổng giá: {e.product_total ? formatNumber(e.product_total) : 'Đang cập nhật'}
            {e.priority ? <Fragment><br /><b style={{ color: 'red' }}>Ưu tiên {e.priority}</b></Fragment> : ''} {e.sale_policy_name ? <Fragment><br /><b>{e.sale_policy_name}</b></Fragment> : ''} </span>
    }

    const CancelBill = async () => {
        const response = await cancelBill({ bill_id: bill.id, status })
        if (response.data.status) {
            dispatch(showToast({ ...listToast[0], detail: "Hủy hợp đồng thành công" }));
            setVisible(false);
            setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
            setStatus(null)
        } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    }

    const header = RenderHeader({ title: 'Danh sách hợp đồng' });
    return (
        <div className="card">
            <Dialog header={"HỦY HỢP ĐỒNG " + bill.code } visible={visible} position='top' style={{ width: '60vw', minHeight: '60vh' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <div className='card' style={{ minHeight: '50vh' }}>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {(payment && payment[0]) ? <Fragment>
                            <b style={{ color: 'red' }}>Hợp đồng đã có những thanh toán, bạn có chắc chắn muốn hủy?</b>
                        </Fragment> : ''}
                        <b className='mt-4' >Vui lòng chọn trạng thái hủy hợp đồng</b>
                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '36px' }}>
                            <Dropdownz className="md:col-6 lg:col-6" options={statusBill.filter(s => [-5, -6, -7, -8, -9].includes(s.id))} placeholder="Trạng thái hủy"
                                value={status} onChange={e => setStatus(e.target.value)} />
                        </div>
                        <div className='flex w-full justify-content-evenly mt-2'>
                            <Button onClick={() => setVisible(false)} type="button" label="Hủy" className="mr-3" severity="danger" size="small" raised style={{ minWidth: '96px' }} />
                            <Button onClick={() => CancelBill()} type="button" label="Xác nhận" className="mr-3" size="small" raised style={{ minWidth: '96px' }} />
                        </div>
                    </div>
                </div>
            </Dialog>
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={data} header={header} title="hợp đồng" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz body={BillBody} header="Hợp đồng" bodyStyle={{ minWidth: '8rem' }} />
                <Columnz body={ProductBody} header="Sản phẩm / chiến dịch" bodyStyle={{ minWidth: '12rem' }} />
                <Columnz body={CustomerBody} header="Khách hàng" bodyStyle={{ minWidth: '17rem' }} />
                <Columnz body={SaleBody} header="Nhân viên" bodyStyle={{ minWidth: '12rem' }} />
                <Columnz body={e => formatNumber(e.sumary)} header="Số tiền yêu cầu" bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
                <Columnz body={e => Body(confirmForm, e.type_confirm)} header="Hình thức xác nhận" bodyStyle={{ minWidth: '8rem', textAlign: 'center' }} />
                <Columnz body={e => Body(billTypes, e.type)} header="Loại hợp đồng" bodyStyle={{ minWidth: '10rem' }} />
                <Columnz body={e => Body(htgds, e.type_procedure)} header="Hình thức giao dịch" bodyStyle={{ minWidth: '8rem', textAlign: 'center' }} />
                <Columnz body={e => TimeBody(e.created_at)} header="Ngày tạo" bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
                <Columnz body={StatusBody} header="Trạng thái" bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
                <Columnz body={ActionBody} header="Actions" bodyStyle={{ textAlign: 'center', minWidth: '10rem' }} />
            </DataTablez>
        </div>
    )
}

export default Contracts;