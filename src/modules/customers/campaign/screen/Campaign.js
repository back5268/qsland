import React, { useState } from 'react';
import { Inputz, Dropdownz, MultiSelectz, GridForm } from "@/components/ListForm";
import {
    ActionBody,
    RenderHeader,
    StatusBody,
    TimeBody,
    DataTablez, Columnz, useGetParams, useGetParamsArray
} from "@/components/DataTable";

import { deleteCampaign, updateCampaign } from "../api";
import { useListCampaign, useCountCampaign } from "../util";

import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useListSource } from "../../source_customer/util";
import {useListUserByPermission} from "@/utils";


const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ name: '' });
    const categorys = useListCategoryV2();
    const sources = useListSource();
    const users = useListUserByPermission("quanlychiendich");

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-12" keys={["user_id_manager"]}>
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} />
            {(users && users[0]) ? <MultiSelectz value={filter.user_id_manager} options={users}
                onChange={(e) => setFilter({ ...filter, user_id_manager: e.target.value })}
                placeholder="Chọn người quản lý chiến dịch" /> : <MultiSelectz options={[]} placeholder="Chọn người quản lý chiến dịch" />}
            <Dropdownz value={filter.source_id} options={sources} placeholder="Chọn nguồn"
                onChange={(e) => setFilter({ ...filter, source_id: e.target.value })} />
            <Dropdownz value={filter.category_id}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}
                options={categorys} placeholder="Chọn dự án" />
        </GridForm>
    )
};

const Campaign = () => {
    const initParams = useGetParamsArray(["user_id_manager"])
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListCampaign({ status: undefined, ...paramsPaginator, first: undefined, render: undefined });
    const totalRecords = useCountCampaign({ status: undefined, ...paramsPaginator, first: undefined, render: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách chiến dịch', add: '/campaign/add' })}
                title="chiến dịch" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="name" header="Tên chiến dịch" />
                <Columnz header="Dự án" field="category_name" />
                <Columnz header="Nguồn" field="source_name" />
                <Columnz field="rule_time" header="Thời gian chăm sóc (phút)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="penalty" header="Quy định phạt (tour)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={e => StatusBody(e,
                    { route: '/campaign/update', action: updateCampaign })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/campaign/detail', { route: '/campaign/delete', action: deleteCampaign },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Campaign;