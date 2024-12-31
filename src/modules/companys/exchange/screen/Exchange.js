import React, { useState } from 'react';
import { Inputz, GridForm } from '@/components/ListForm';
import {
    ActionBody,
    StatusBody,
    RenderHeader,
    Body,
    Columnz,
    DataTablez, useGetParams
} from "@/components/DataTable";
import { useListExchange, useCountExchange } from "../util";
import { updateExchange, deleteExchange } from "../api";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} />
        </GridForm>
    )
};

const Exchanges = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListExchange({ status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountExchange({ status: undefined, ...paramsPaginator, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách phòng ban', add: '/exchange/add' })}
                title="phòng ban" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Mã phòng ban" />
                <Columnz field="name" header="Tên phòng ban" />
                <Columnz header="Tên công ty" field="company_name" />
                <Columnz field="address" header="Địa chỉ phòng ban" />
                <Columnz field="status" header="Hiển thị" body={e => StatusBody(e,
                    { route: '/exchange/update', action: updateExchange })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/exchange/detail', { route: '/exchange/delete', action: deleteExchange },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Exchanges;