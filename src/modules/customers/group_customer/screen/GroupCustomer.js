import React, { useState } from 'react';
import {StatusBody, RenderHeader, ActionBody, TimeBody, Columnz, DataTablez, useGetParams} from "@/components/DataTable";
import { useListGroupCustomer, useCountGroupCustomer } from "../util";
import { deleteGroupCustomer, updateGroupCustomer } from "../api";
import { GridForm, Inputz } from '@/components/ListForm';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })} />
        </GridForm>
    )
};

const GroupCustomer = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListGroupCustomer({ status: undefined, ...paramsPaginator,  first: undefined });
    const totalRecords = useCountGroupCustomer({ status: undefined, ...paramsPaginator,  first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách nhóm khách hàng', add: '/group_customer/add' })}
                title="nhóm khách hàng" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="name" header="Tên nhóm" />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={(e) => StatusBody(e,
                    { route: '/group_customer/update', action: updateGroupCustomer })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/group_customer/detail',
                    { route: '/group_customer/delete', action: deleteGroupCustomer }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default GroupCustomer;