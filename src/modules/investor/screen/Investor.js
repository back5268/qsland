import React, { useState } from 'react';
import {
    RenderHeader,
    StatusBody,
    ActionBody,
    TimeBody,
    Columnz,
    DataTablez, useGetParams
} from "@/components/DataTable";
import { useListInvestor, useCountInvestor } from "../util";
import { deleteInvestor, updateInvestor } from '../api';
import { GridForm, Inputz } from '@/components/ListForm';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} />
        </GridForm>
    )
};

const Investor = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListInvestor({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountInvestor({ ...paramsPaginator, first: undefined });

    const header = RenderHeader({ title: 'Danh sách chủ đầu tư', add: '/investor/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={header} title="chủ đầu tư" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Mã" />
                <Columnz field="name" header="Tên chủ đầu tư" />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Status" body={(e) => StatusBody(e,
                    { route: '/investor/update', action: updateInvestor })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/investor/detail',
                    { route: '/investor/delete', action: deleteInvestor }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Investor;