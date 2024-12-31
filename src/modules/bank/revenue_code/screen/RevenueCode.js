import React, { useState } from 'react';
import { Inputz, GridForm } from '@/components/ListForm';
import {
    ActionBody,
    RenderHeader,
    TimeBody,
    StatusBody,
    DataTablez,
    Columnz, useGetParams
} from "@/components/DataTable";
import { useListRevenueCode, useCountRevenueCode } from "../util";
import { deleteRevenueCode, updateRevenueCode } from "../api";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });
    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} />
        </GridForm>
    )
};

const RevenueCode = () => {
    const [userDelete, setUserDelete] = useState(null);const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListRevenueCode({ first: undefined, status: undefined, ...paramsPaginator });
    const totalRecords = useCountRevenueCode({ first: undefined, status: undefined, ...paramsPaginator });

    const header = RenderHeader({ title: 'Danh sách mã doanh thu', add: '/revenue_code/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={header} title="mã doanh thu" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="name" header="Tên doanh thu" />
                <Columnz field="code" header="Mã doanh thu" />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={(e) => StatusBody(e,
                    { route: '/group_customer/update', action: updateRevenueCode })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/revenue_code/detail', { route: '/revenue_code/delete', action: deleteRevenueCode },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default RevenueCode;