import React, { useState } from 'react';
import { Inputz, GridForm } from '@/components/ListForm';
import {ActionBody, StatusBody, RenderHeader, Columnz, DataTablez, useGetParams} from "@/components/DataTable";

import { useListCompany, useCountCompany } from "../util";
import { updateCompany, deleteCompany } from "../api";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} />
        </GridForm>
    )
};

const Companys = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListCompany({ status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountCompany({ status: undefined, ...paramsPaginator, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách công ty', add: '/company/add' })}
                title="công ty" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Mã công ty" />
                <Columnz field="name" header="Tên công ty" />
                <Columnz field="code_in" header="Mã nội bộ" />
                <Columnz field="address" header="Địa chỉ doanh nghiệp" />
                <Columnz field="status" header="Hiển thị" body={e => StatusBody(e,
                    { route: '/company/update', action: updateCompany })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/company/detail', { route: '/company/delete', action: deleteCompany },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Companys;