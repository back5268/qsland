import React, { useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {
    RenderHeader,
    ActionBody,
    Columnz,
    DataTablez,
    StatusBody,
    TimeBody,
    useGetParams
} from "@/components/DataTable";

import { useListSaleCampaign, useCountSaleCampaign } from "../util";
import { deleteSaleCampaign, updateSaleCampaign } from '../api';
import { isActives } from '@/modules/users/user/util';
import {useListBuildingV2} from '@/modules/categories/building/util';
import {useListCategoryV2} from '@/modules/categories/category/util';
import { formatNumber } from '@/modules/categories/row_table/util';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ title: '' });
    const categories = useListCategoryV2();
    const buildings = useListBuildingV2({ parent_id: filter.category_id });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-12">
            <Inputz value={filter.title} onChange={e => setFilter({ ...filter, title: e.target.value })} />
            <Dropdownz value={filter.category_id} options={categories} placeholder="Dự án"
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })} />
            <Dropdownz value={filter.building_id} options={buildings} placeholder="Tòa nhà"
                onChange={(e) => setFilter({ ...filter, building_id: e.target.value })} />
            <Dropdownz value={filter.status} options={isActives} placeholder="Tình trạng"
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
        </GridForm>
    )
};

const SaleCampaign = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const data = useListSaleCampaign({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountSaleCampaign({ ...paramsPaginator, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={data} header={RenderHeader({ title: 'Danh sách chiến dịch bán hàng', add: '/sale_campaign/add' })}
                title="chiến dịch bán hàng" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="title" header="Tên chiến dịch bán hàng" />
                <Columnz field="category_name" header="Dự án" />
                <Columnz field="building_name" header="Tòa nhà" />
                <Columnz body={e => formatNumber(e.total)} header="Số tiền yêu cầu (VNĐ)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={e => TimeBody(e.updated_at)} header="Thời gian cập nhật" bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="vacant_position" header="Số chỗ còn lại" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={e => StatusBody(e,
                    { route: '/sale_campaign/update', action: updateSaleCampaign })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/sale_campaign/detail',
                { route: '/sale_campaign/delete', action: deleteSaleCampaign })} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default SaleCampaign;