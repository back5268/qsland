import React, { Fragment, useState } from 'react';
import { Dialog } from "@/uiCore";
import { databaseDate } from "@/lib/convertDate";

import { Inputz, Dropdownz, MultiSelectz, Calendarz, GridForm } from "@/components/ListForm";
import {
    ActionBody, RenderHeader, TimeBody, Body, Columnz, DataTablez, useGetParamsArray
} from "@/components/DataTable";

import ImportCustomer from "./ImportCustomer";
import { deleteCustomer, exportCustomer, recallCustomer } from "../api";
import { useListCustomer, useCountCustomer, statusAllocation, createTypes } from "../util";

import { useListSource } from "../../source_customer/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useListSale, useListGroupSaleV2 } from "@/modules/users/group_sale/util";
import { useListGroupCustomer } from "../../group_customer/util";
import { getSale, listToast, removeUndefinedProps } from "@/utils";
import { useListCompany } from '@/modules/companys/company/util';
import { useListCampaign } from '../../campaign/util';
import CustomerRecall from './CustomerRecall';
import { useSelector } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { useDispatch } from 'react-redux';
import { confirmDialog } from 'primereact/confirmdialog';

const interactiveStatus = [
    { name: 'KH mới', id: 1 },
    { name: 'Đang liên hệ', id: 2 },
    { name: 'Đang chăm sóc', id: 3 },
    { name: 'Tiếp cận', id: 4 },
    { name: 'Tiềm năng', id: 5 },
    { name: 'Không nhu cầu', id: 6 },
    // { name: 'Giao Dịch', id: 7 },
    { name: 'Khách hàng thân thiết cấp 1', id: 8 },
    { name: 'Khách hàng thân thiết cấp 2', id: 9 },
    { name: 'Khách hàng thân thiết cấp 3', id: 10 },
];

const Header = ({ paramsPaginator, setParamsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '', care_time_start: '', care_time_end: '' });
    const companys = useListCompany();
    const campaigns = useListCampaign();
    const categorys = useListCategoryV2();
    const sources = useListSource();
    const exchanges = useListExchange({ company_id: filter.company_id });
    const groupSales = useListGroupSaleV2({ company_id: filter.company_id, exchange_id: filter.exchange_id });
    const listGroupCustomer = useListGroupCustomer();
    const sales = useListSale({
        company_id: filter.company_id,
        exchange_id: filter.exchange_id,
        group_sale_id: filter.group_sale_id
    });

    const handleFilter = (filter) => {
        const filters = {
            ...filter, care_time_start: filter.care_time_start ? Number(filter.care_time_start) : undefined,
            care_time_end: filter.care_time_end ? Number(filter.care_time_end) : undefined,
            from: filter.dates && databaseDate(filter.dates[0]),
            to: filter.dates && filter.dates[1] ? databaseDate(filter.dates[1], true)
                : filter.dates && databaseDate(filter.dates[0], true), dates: [],
            category_id: filter.category_id && filter.category_id[0] ? filter.category_id : undefined,
            source_id: filter.source_id && filter.source_id[0] ? filter.source_id : undefined,
            exchange_id: filter.exchange_id && filter.exchange_id[0] ? filter.exchange_id : undefined,
            user_id_sale: filter.user_id_sale && filter.user_id_sale[0] ? filter.user_id_sale : undefined,
            interactive_status: filter.interactive_status && filter.interactive_status[0] ? filter.interactive_status : undefined,
            group_customer_id: filter.group_customer_id && filter.group_customer_id[0] ? filter.group_customer_id : undefined,
            group_sale_id: filter.group_sale_id && filter.group_sale_id[0] ? filter.group_sale_id : undefined,
            company_id: filter.company_id && filter.company_id[0] ? filter.company_id : undefined,
            campaign_id: filter.campaign_id && filter.campaign_id[0] ? filter.campaign_id : undefined,
        };
        return filters;
    };

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-6"
            keys={["group_sale_id", "user_id_sale", "campaign_id", "source_id", "interactive_status", "group_customer_id", "category_id", "exchange_id", "company_id"]}>
            {(companys && companys[0]) ? <MultiSelectz value={filter.company_id} options={companys} placeholder="Chọn công ty"
                onChange={(e) => setFilter({
                    ...filter,
                    company_id: e.target.value,
                    exchange_id: undefined,
                    group_sale_id: undefined,
                    user_id_sale: undefined
                })} /> : ''}
            {(exchanges && exchanges[0]) ? <MultiSelectz value={filter.exchange_id} options={exchanges} placeholder="Chọn sàn \ chi nhánh"
                onChange={(e) => setFilter({
                    ...filter,
                    exchange_id: e.target.value,
                    group_sale_id: undefined,
                    user_id_sale: undefined
                })} /> : <MultiSelectz options={[]} placeholder="Chọn sàn \ chi nhánh" />}
            {(groupSales && groupSales) ? <MultiSelectz value={filter.group_sale_id} options={groupSales} placeholder="Chọn nhóm nhân viên"
                onChange={(e) => setFilter({
                    ...filter,
                    group_sale_id: e.target.value,
                    user_id_sale: undefined
                })} /> : <MultiSelectz options={[]} placeholder="Chọn nhóm nhân viên" />}
            {(campaigns && campaigns[0]) ? <MultiSelectz value={filter.campaign_id} options={campaigns}
                onChange={(e) => setFilter({ ...filter, campaign_id: e.target.value })}
                placeholder="Chọn chiến dịch" /> : <MultiSelectz options={[]} placeholder="Chọn chiến dịch" />}
            {(categorys && categorys[0]) ? <MultiSelectz value={filter.category_id} options={categorys}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} placeholder="Chọn dự án" /> : 
                <MultiSelectz options={[]} placeholder="Chọn dự án" />}
            {(sources && sources[0]) ? <MultiSelectz value={filter.source_id} options={sources} placeholder="Chọn nguồn"
                onChange={(e) => setFilter({ ...filter, source_id: e.target.value })} /> : <MultiSelectz options={[]} placeholder="Chọn nguồn" />}
            {(interactiveStatus && interactiveStatus[0]) ? <MultiSelectz value={filter.interactive_status} options={interactiveStatus}
                placeholder="Chọn tình trạng khách hàng"
                onChange={(e) => setFilter({ ...filter, interactive_status: e.target.value })} /> : 
                <MultiSelectz options={[]} placeholder="Chọn tình trạng khách hàng" />}
            {(sales && sales[0]) ? <MultiSelectz value={filter.user_id_sale} options={getSale(sales)}
                onChange={(e) => setFilter({ ...filter, user_id_sale: e.target.value })}
                optionLabel="full_name" optionValue="user_id" placeholder="Chọn nhân viên" /> : <MultiSelectz options={[]} placeholder="Chọn nhân viên" />}
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
            {(listGroupCustomer && listGroupCustomer[0]) ? <MultiSelectz value={filter.group_customer_id} options={listGroupCustomer}
                placeholder="Chọn nhóm khách hàng"
                onChange={(e) => setFilter({ ...filter, group_customer_id: e.target.value })} /> : <MultiSelectz options={[]} placeholder="Chọn nhóm khách hàng" />}
            <div className="align-items-center flex col-12 md:col-6 lg:col-3">
                <label className="w-8 block text-900 font-medium mr-2">Lần chăm sóc cuối</label>
                <div className='flex w-full'>
                    <Inputz type='number' value={filter.care_time_start} placeholder='Từ' className='w-6'
                        onChange={(e) => setFilter({ ...filter, care_time_start: e.target.value })} />
                    <Inputz type='number' value={filter.care_time_end} placeholder='Đến' className='w-6'
                        onChange={(e) => setFilter({ ...filter, care_time_end: e.target.value })} />
                </div>
            </div>
            <Dropdownz value={filter.create_type} options={createTypes} placeholder="Chọn loại khách hàng"
                onChange={(e) => setFilter({ ...filter, create_type: e.target.value })} showClear={true} />
            <Dropdownz value={filter.status_allocation} options={statusAllocation} placeholder="Trạng thái phân bổ"
                onChange={(e) => setFilter({ ...filter, status_allocation: e.target.value })} showClear={true} />
            <Inputz value={filter.key_search} onChange={(e) => setFilter({ ...filter, key_search: e.target.value })}
                placeholder='Tìm kiếm theo tên, SDT, email' />
        </GridForm>
    )
};

const Customer = () => {
    const [visible, setVisible] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const initParams = useGetParamsArray(["group_sale_id", "user_id_sale", "campaign_id", "source_id", "interactive_status", "group_customer_id", "category_id", "exchange_id", "company_id"])
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListCustomer({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountCustomer({ ...paramsPaginator, first: undefined });
    const master = useSelector(state => state.roles).master;
    const dispatch = useDispatch();

    const header = RenderHeader({
        moreOption: master ? () => setVisibleDelete(true) : false,
        title: 'Danh sách khách hàng', add: '/customer/add',
        imports: { route: '/customer/import', action: () => setVisible(true) },
        exports: {
            route: '/customer/export',
            action: () => exportCustomer(paramsPaginator),
            totalRecords: totalRecords,
            file: 'customers.xlsx'
        },
    });

    const handleUndo = (e) => {
        async function accept() {
            const res = await recallCustomer({ ids: [e.id] });
            if (res.data.status) {
                dispatch(showToast({ ...listToast[0], detail: 'thu hồi khách hàng thành công!' }));
                setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
            }
        }

        const confirm = () => {
            confirmDialog({
                message: 'Bạn có chắc chắn muốn thu hồi khách hàng không?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            });
        };

        confirm();
    };

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <Dialog header="Import khách hàng" visible={visible} position='top' style={{ width: '50vw' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <ImportCustomer />
            </Dialog>
            <Dialog header="Thu hồi nhiều khách hàng" visible={visibleDelete} position='top' style={{ width: '80vw' }}
                onHide={() => setVisibleDelete(false)} draggable={false} resizable={false}>
                <CustomerRecall setVisibleDelete={setVisibleDelete} page={paramsPaginator}
                    setPage={setParamsPaginator} />
            </Dialog>
            <DataTablez value={customers} header={header} title="khách hàng" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}>
                <Columnz field="full_name" header="Khách hàng" />
                <Columnz field="phone" header="Số điện thoại" />
                <Columnz body={e => <Fragment>{Boolean(e.date_final) ? e.date_final : ''}</Fragment>}
                    header="Lần CS cuối (ngày)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Tình trạng CS" body={e => Body(interactiveStatus, e.interactive_status)} />
                <Columnz header="Nguồn" field="source_name" />
                <Columnz field="campaign_name" header="Chiến dịch" />
                <Columnz header="Dự án" field="category_name" />
                <Columnz header="Sale" field="sale_name" />
                <Columnz field="exchange_name" header="Sàn" />
                <Columnz field="round" header="Round" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian cập nhật" body={e => TimeBody(e.updated_at)}
                    bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian phân bổ" body={e => TimeBody(e.user_id_sale !== 0 && e.create_date)}
                    bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/customer/detail', {
                    route: '/customer/delete',
                    action: deleteCustomer
                },
                    paramsPaginator, setParamsPaginator, false, (e.user_id_sale && master && e.create_type === 1 && e.status_allocation === 3) ? () => handleUndo(e) : false)}
                    bodyStyle={{ minWidth: '10rem', textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Customer;