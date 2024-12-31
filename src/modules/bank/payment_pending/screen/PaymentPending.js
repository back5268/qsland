import React, { useState } from 'react';
import { Inputz, GridForm, Calendarz, Dropdownz } from '@/components/ListForm';
import {
    ActionBody,
    RenderHeader,
    TimeBody,
    StatusBody,
    DataTablez,
    Columnz, useGetParams
} from "@/components/DataTable";
import { useListPaymentPending, useCountPaymentPending } from "../util";
import { deletePaymentPending, updatePaymentPending } from "../api";
import { useListBill } from '@/modules/transaction_management/contract/utils';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListUserV2 } from '@/modules/users/user/util';
import { useListCampaign } from '@/modules/customers/campaign/util';
import { databaseDate } from '@/lib/convertDate';
import { formatNumber, useListProductName } from '@/modules/categories/row_table/util';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });
    const categories = useListCategoryV2();
    const users = useListUserV2();
    const bills = useListBill();
    const campaigns = useListCampaign();
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
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} >
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })}
                placeholder="Nhập mã thanh toán" />
            <Dropdownz value={filter.category_id} options={categories} placeholder="Chọn dự án"
                       onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })} />
            <Dropdownz value={filter.contract_id} options={bills}
                onChange={(e) => setFilter({ ...filter, contract_id: e.target.value })}
                optionLabel="code" placeholder="Chọn hợp đồng" />
            <Dropdownz value={filter.product_id} options={products}
                onChange={(e) => setFilter({ ...filter, product_id: e.target.value })} placeholder="Chọn bất động sản" />
            <Dropdownz value={filter.campaign_id} options={campaigns}
                onChange={(e) => setFilter({ ...filter, campaign_id: e.target.value })} placeholder="Chọn chiến dịch" />
            <Dropdownz value={filter.user_sale_id} options={users} 
                onChange={(e) => setFilter({ ...filter, user_sale_id: e.target.value })} placeholder="Chọn Nhân viên" />
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
        </GridForm>
    )
};

const PaymentPending = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListPaymentPending(paramsPaginator);
    const totalRecords = useCountPaymentPending(paramsPaginator);

    const header = RenderHeader({ title: 'Danh sách thanh toán chờ xử lý', add: '/payment_pending/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={header} title="thanh toán chờ xử lý" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="short_name" header="Mã thanh toán" />
                <Columnz field="short_name" header="Sản phẩm / chiến dịch" />
                <Columnz field="short_name" header="Hợp đồng" />
                <Columnz body={e => formatNumber(e.total)} header="Số tiền yêu cầu" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.total)} header="Số tiền thực thu" bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="short_name" header="Ghi chú" />
                <Columnz field="short_name" header="Hình thức giao dịch" />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={(e) => StatusBody(e,
                    { route: '/payment_pending/update', action: updatePaymentPending })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/payment_pending/detail', { route: '/payment_pending/delete', action: deletePaymentPending },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default PaymentPending;