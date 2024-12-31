import React, { useState, Fragment } from 'react';
import { Inputz, GridForm, Dropdownz } from "@/components/ListForm";
import {
    ActionBody,
    StatusBody,
    TimeBody,
    RenderHeader,
    DataTablez, Columnz, useGetParams,
} from "@/components/DataTable";

import { useListGroupSale, useCountGroupSale } from "../util";
import { updateGroupSale, deleteGroupSale } from "../api";

import { useListExchange } from "@/modules/companys/exchange/util";
import { useListCompany } from "@/modules/companys/company/util";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });
    const companies = useListCompany();
    const exchanges = useListExchange({ company_id: filter.company_id });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} >
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} placeholder="Tìm kiếm theo tên, mã nhóm" />
            <Dropdownz value={filter.company_id} options={companies}
                onChange={(e) => setFilter({ ...filter, company_id: e.target.value, building_id: undefined })} placeholder="Chọn công ty" />
            <Dropdownz value={filter.exchange_id} options={exchanges}
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value, building_id: undefined })} placeholder="Chọn phòng ban" />
        </GridForm>
    )
};

const GroupSale = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListGroupSale({ status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountGroupSale({ status: undefined, ...paramsPaginator, first: undefined });

    const header = RenderHeader({ title: 'Danh sách nhóm sale', add: '/group_sale/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={header} title="nhóm sale" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Mã nhóm" />
                <Columnz field="name" header="Tên nhóm" />
                <Columnz header="Tên công ty" field="exchange_name" />
                <Columnz header="Tên phòng ban" field="company_name" />
                <Columnz header="Số lượng (người)" field="quantity" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Người cập nhật" field="updated_name" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={e => StatusBody(e,
                    { route: '/group_sale/update', action: updateGroupSale })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/group_sale/detail', { route: '/group_sale/delete', action: deleteGroupSale },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default GroupSale;