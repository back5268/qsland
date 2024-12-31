import React, { useState, Fragment, useEffect } from 'react';
import { Button } from "@/uiCore";
import { databaseDate } from "@/lib/convertDate";
import { Inputz, MultiSelectz, Calendarz, GridForm } from "@/components/ListForm";
import {
    TimeBody, Column, Body, Columnz, useGetParamsArray
} from "@/components/DataTable";
import { useListCustomer, useCountCustomer } from "../util";
import { useListSource } from "../../source_customer/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useDetailUser } from "@/modules/users/user/util";
import { useListSale, useListGroupSaleV2 } from "@/modules/users/group_sale/util";
import { useListGroupCustomer } from "../../group_customer/util";
import { getSale, listToast } from "@/utils";
import { useListCampaign } from '../../campaign/util';
import { showToast } from '@/redux/features/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { recallCustomer } from '../api';
import { useDispatch } from 'react-redux';

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
    const campaigns = useListCampaign();
    const categorys = useListCategoryV2();
    const sources = useListSource();
    const exchanges = useListExchange();
    const groupSales = useListGroupSaleV2();
    const listGroupCustomer = useListGroupCustomer();
    const sales = useListSale();

    useEffect(() => {
        listGroupCustomer.shift();
    }, [listGroupCustomer]);

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
            filter={filter} setFilter={setFilter} handleFilter={handleFilter}
            keys={["group_sale_id", "user_id_sale", "campaign_id", "source_id", "interactive_status", "group_customer_id", "category_id", "exchange_id", "company_id"]}>
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
            <Inputz value={filter.key_search} onChange={(e) => setFilter({ ...filter, key_search: e.target.value })}
                placeholder='Tìm kiếm theo tên, SDT, email' />
        </GridForm>
    )
};

const CustomerRecall = (props) => {
    const { page, setPage } = props;
    const initParams = useGetParamsArray(["group_sale_id", "user_id_sale", "campaign_id", "source_id", "interactive_status", "group_customer_id", "category_id", "exchange_id", "company_id"])
    const [paramsPaginator, setParamsPaginator] = useState(initParams);
    const customers = useListCustomer({ ...paramsPaginator, first: undefined, create_type: 1, status_allocation: 3 });
    const totalRecords = useCountCustomer({ ...paramsPaginator, first: undefined, create_type: 1, status_allocation: 3 });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const dispatch = useDispatch();

    const RenderHeader = (props) => {
        const { title } = props;
        async function accept() {
            let newSlect = [];
            selectedProducts.forEach(s => {
                if (s.id) newSlect.push(s.id);
            })
            if (newSlect && newSlect[0]) {
                const res = await recallCustomer({ ids: newSlect });
                if (res.data.status) {
                    dispatch(showToast({ ...listToast[0], detail: 'thu hồi khách hàng thành công!' }));
                    setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
                    setPage({ ...page, render: !page.render });
                };
            };
        };

        const confirm = () => {
            confirmDialog({
                message: 'Bạn có chắc chắn muốn thu hồi khách hàng không?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            });
        };

        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">{title}</h4>
                <div className="mt-2 lg:mt-0">
                    <Button label="Thu hồi" onClick={confirm} disabled={selectedProducts && !selectedProducts[0]}
                        className="ml-3" severity="warning" size="small" raised style={{ minWidth: '96px' }} />
                </div>
            </div>
        );
    };

    const onPage = (event) => {
        setParamsPaginator({
            ...paramsPaginator,
            first: event.first,
            limit: event.rows,
            page: event.page !== 0 ? event.page + 1 : 1,
        });
    };

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTable value={customers} header={RenderHeader({ title: 'Danh sách khách hàng' })} totalRecords={totalRecords}
                lazy selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginator first={paramsPaginator.first} rows={paramsPaginator.limit} onPage={onPage} showGridlines
                rowsPerPageOptions={[20, 50, 100]} dataKey="id"
                currentPageReportTemplate="Tổng số: {totalRecords} bản ghi" >
                <Columnz selectionMode="multiple" rowSelectable={false} headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="full_name" header="Khách hàng" />
                <Columnz field="phone" header="Số điện thoại" />
                <Columnz field="date_final" header="Lần CS cuối (ngày)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Tình trạng CS" body={e => Body(interactiveStatus, e.interactive_status)} />
                <Columnz header="Nguồn" field="source_name"/>
                <Columnz field="campaign_name" header="Chiến dịch"/>
                <Columnz header="Dự án" field="category_name"/>
                <Columnz header="Sale" field="sale_name"/>
                <Columnz field="exchange_name" header="Sàn"/>
                <Columnz field="round" header="Round" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian phân bổ" body={e => TimeBody(e.user_id_sale !== 0 && e.create_date)} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    )
}

export default CustomerRecall;