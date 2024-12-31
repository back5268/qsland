import React, { useState } from 'react';
import { Inputz, GridForm } from '@/components/ListForm';
import {ActionBody, RenderHeader, TimeBody, Columnz, DataTablez, useGetParams} from "@/components/DataTable";
import { useListBank, useCountBank } from "../util";
import { deleteBank } from "../api";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ bank_name: '' });
    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.bank_name} onChange={e => setFilter({ ...filter, bank_name: e.target.value })}
            placeholder="Tìm kiếm theo tên, mã" />
        </GridForm>
    )
};

const Bank = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListBank({ status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountBank({ status: undefined, ...paramsPaginator, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách ngân hàng', add: '/payment_info/add' })}
                title="ngân hàng" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="short_name" header="Tên ngân hàng" />
                <Columnz field="account_holder" header="Chủ tài khoản" />
                <Columnz field="bank_number" header="Số tài khoản" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/payment_info/detail', { route: '/payment_info/delete', action: deleteBank },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Bank;