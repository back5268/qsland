import React, { useState } from 'react';
import { Inputz, GridForm, MultiSelectz } from "@/components/ListForm";
import { TimeBody, Body, Columnz, useGetParams, useGetParamsArray } from "@/components/DataTable";
import { Button, DataTable, Dialog } from '@/uiCore';
import { useListCustomerRecall, useCountCustomerRecall } from '../util';
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useListSource } from "../../source_customer/util";
import { useListCampaign } from '../../campaign/util';
import { useListGroupCustomer } from '../../group_customer/util';
import TranferCustomer from './TranferCustomer';

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

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });
    const categories = useListCategoryV2();
    const sources = useListSource();
    const campaigns = useListCampaign();
    const listGroupCustomer = useListGroupCustomer();

    const handleFilter = (filter) => {
        const filters = {
            ...filter,
            category_id: filter.category_id && filter.category_id[0] ? filter.category_id : undefined,
            source_id: filter.source_id && filter.source_id[0] ? filter.source_id : undefined,
            interactive_status: filter.interactive_status && filter.interactive_status[0] ? filter.interactive_status : undefined,
            group_customer_id: filter.group_customer_id && filter.group_customer_id[0] ? filter.group_customer_id : undefined,
            campaign_id: filter.campaign_id && filter.campaign_id[0] ? filter.campaign_id : undefined,
        };
        return filters;
    };

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-6"
            keys={["campaign_id", "category_id", "source_id", "interactive_status", "group_customer_id"]}>
            <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })} />
            {(campaigns && campaigns[0]) ? <MultiSelectz value={filter.campaign_id} options={campaigns} placeholder="Chọn chiến dịch"
                onChange={(e) => setFilter({ ...filter, campaign_id: e.target.value })} /> : <MultiSelectz options={[]} placeholder="Chọn chiến dịch" />}
            {(categories && categories[0]) ? <MultiSelectz value={filter.category_id} placeholder="Chọn dự án"
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} options={categories} /> :
                <MultiSelectz placeholder="Chọn dự án" options={[]} />}
            {(sources && sources[0]) ? <MultiSelectz value={filter.source_id} options={sources} placeholder="Chọn nguồn"
                onChange={(e) => setFilter({ ...filter, source_id: e.target.value })} /> : <MultiSelectz options={[]} placeholder="Chọn nguồn" />}
            {(interactiveStatus && interactiveStatus[0]) ? <MultiSelectz value={filter.interactive_status} options={interactiveStatus}
                placeholder="Chọn tình trạng chăm sóc" onChange={(e) => setFilter({ ...filter, interactive_status: e.target.value })} /> :
                <MultiSelectz options={[]} placeholder="Chọn tình trạng chăm sóc" />}
            {(listGroupCustomer && listGroupCustomer[0]) ? <MultiSelectz value={filter.group_customer_id} options={listGroupCustomer}
                placeholder="Chọn nhóm khách hàng" onChange={(e) => setFilter({ ...filter, group_customer_id: e.target.value })} /> : 
                <MultiSelectz options={[]} placeholder="Chọn nhóm khách hàng" />}
        </GridForm>
    )
};

const MoreCustomer = () => {
    const initParams = useGetParamsArray(["campaign_id", "category_id", "source_id", "interactive_status", "group_customer_id"])
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const [visible, setVisible] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const customers = useListCustomerRecall({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountCustomerRecall({ ...paramsPaginator, first: undefined });

    const onPage = (event) => {
        setParamsPaginator({
            ...paramsPaginator,
            first: event.first,
            limit: event.rows,
            page: event.page !== 0 ? event.page + 1 : 1,
        });
    };

    const RenderHeader = (props) => {
        const { title } = props;
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">{title}</h4>
                <div className="mt-2 lg:mt-0">
                    <Button onClick={() => setVisible(true)} label="Điều chuyển" disabled={selectedProducts && !selectedProducts[0]}
                        className="ml-3" severity="warning" size="small" raised />
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <Dialog header="Điều chuyển khách hàng" visible={visible} position='top' style={{ width: '60vw', height: '85vh' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <TranferCustomer customers={selectedProducts} setVisible={setVisible} setSelectedProducts={setSelectedProducts}
                    paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            </Dialog>
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTable value={customers} header={RenderHeader({ title: 'Danh sách khách hàng sale nghỉ việc' })}
                title="khách hàng" totalRecords={totalRecords} lazy selectionMode={'checkbox'} selection={selectedProducts}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginator first={paramsPaginator.first} rows={paramsPaginator.limit} onPage={onPage} showGridlines
                rowsPerPageOptions={[20, 50, 100]} dataKey="id"
                emptyMessage={"Không tìm thấy khách hàng sale nghỉ việc"} currentPageReportTemplate="Tổng số: {totalRecords} bản ghi">
                <Columnz selectionMode="multiple" headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="full_name" header="Khách hàng" />
                <Columnz field="phone" header="Số điện thoại" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Tình trạng CS" body={e => Body(interactiveStatus, e.interactive_status)} />
                <Columnz header="Nguồn" field="source_name" />
                <Columnz field="campaign_name" header="Chiến dịch" />
                <Columnz header="Dự án" field="category_name" />
                <Columnz header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian thu hồi" body={e => TimeBody(e.time_recal)} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    )
}

export default MoreCustomer;