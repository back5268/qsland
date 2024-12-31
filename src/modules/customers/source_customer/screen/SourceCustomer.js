import React, { useState } from 'react';
import {
    StatusBody,
    RenderHeader,
    ActionBody,
    TimeBody,
    DataTablez,
    Columnz, useGetParams
} from "@/components/DataTable";
import { useListSource, useCountSource } from "../util";
import { deleteSource, updateSource } from "../api";
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

const SourceCustomer = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListSource({ ...paramsPaginator, status: undefined, first: undefined });
    const totalRecords = useCountSource({ ...paramsPaginator, status: undefined, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách nguồn khách hàng', add: '/source_customer/add' })}
                title="nguồn khách hàng" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="name" header="Tên nguồn" />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={(e) => StatusBody(e,
                    { route: '/source_customer/update', action: updateSource })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/source_customer/detail',
                    { route: '/source_customer/delete', action: deleteSource }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default SourceCustomer;