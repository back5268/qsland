import React, { useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {
    RenderHeader,
    ActionBody,
    StatusBody,
    Body,
    DataTablez,
    Columnz, useGetParams
} from "@/components/DataTable";

import { useListBuilding, useCountBuilding, KBH, MR, CPL } from "../util";
import { updateCategory } from '../api';
import { useListCategoryV2 } from '../../category/util';
import { deleteCategory } from '../../category/api';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ cb_title: '' });
    const categories = useListCategoryV2();

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <Inputz value={filter.cb_title} onChange={e => setFilter({ ...filter, cb_title: e.target.value })}
                placeholder="Tìm kiếm theo tên, mã tòa nhà" />
            <Dropdownz value={filter.row_table_style} options={KBH} placeholder="Kiểu bảng hàng"
                onChange={(e) => setFilter({ ...filter, row_table_style: e.target.value })} />
            <Dropdownz value={filter.lock} options={CPL} placeholder="Tình trạng lock"
                onChange={(e) => setFilter({ ...filter, lock: e.target.value })} />
            <Dropdownz value={filter.assemble} options={MR} placeholder="Tình trạng ráp"
                onChange={(e) => setFilter({ ...filter, assemble: e.target.value })} />
            <Dropdownz value={filter.category_id}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}
                options={categories} placeholder="Chọn dự án" />
        </GridForm>
    )
};

const Building = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListBuilding({ cb_status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountBuilding({ cb_status: undefined, ...paramsPaginator, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách tòa nhà', add: '/building/add' })}
                title="tòa nhà" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="cb_id" header="Id" />
                <Columnz field="cb_code" header="Mã tòa nhà" />
                <Columnz field="cb_title" header="Tên tòa nhà" />
                <Columnz field="category_name" header="Thuộc dự án" />
                <Columnz body={e => Body(KBH, e.row_table_style)} header="Kiểu bảng hàng" />
                <Columnz body={e => Body(CPL, e.lock)} header="Mở lock" />
                <Columnz body={e => Body(MR, e.assemble)} header="Mở ráp" />
                <Columnz header="Trạng thái" body={e => StatusBody(e,
                    { route: '/building/update', action: updateCategory })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/building/detail',
                    { route: '/building/delete', action: deleteCategory }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Building;