import React, { useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {ActionBody, RenderHeader, Columnz, DataTablez, Body, useGetParams} from "@/components/DataTable";
import { useListTemplate, useCountTemplate, templateTypes, templateLevels } from "../util";
import { GD, LH, useListCategoryV2 } from '@/modules/categories/category/util';
import { deleteTemplate } from '../api';

const Header = ({ setParamsPaginator, paramsPaginator, categories }) => {
    const [filter, setFilter] = useState({ title: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-6">
            <Inputz value={filter.title} onChange={e => setFilter({ ...filter, title: e.target.value })} placeholder="Tìm kiếm theo tên, mã" />
            <Dropdownz value={filter.type_pattern} options={templateLevels}
                onChange={(e) => setFilter({ ...filter, type_pattern: e.target.value })} placeholder="Chọn loại template" />
            <Dropdownz value={filter.type} options={templateTypes}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })} placeholder="Chọn kiểu template" />
            <Dropdownz value={filter.type_product} options={LH}
                onChange={(e) => setFilter({ ...filter, type_product: e.target.value })} placeholder="Chọn loại hình" />
            <Dropdownz value={filter.category_id} options={categories}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} placeholder="Chọn dự án" />
            <Dropdownz value={filter.stage} options={GD}
                onChange={(e) => setFilter({ ...filter, stage: e.target.value })} placeholder="Chọn giai đoạn" />
        </GridForm>
    )
};

const Templates = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListTemplate(paramsPaginator);
    const totalRecords = useCountTemplate(paramsPaginator);
    const categories = useListCategoryV2();

    const header = RenderHeader({ title: 'Danh sách Template', add: '/template/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} categories={categories} />
            <DataTablez value={customers} header={header} title="Template" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Code" />
                <Columnz field="title" header="Tiêu đề" />
                <Columnz body={e => Body(templateTypes, e.type)} header="Kiểu Template" />
                <Columnz body={e => Body(templateLevels, e.type_pattern)} header="Loại Template" />
                <Columnz body={e => Body(LH, e.type_product)} header="Loại hình" />
                <Columnz body={e => Body(categories, e.category_id)} header="dự án" />
                <Columnz header="Actions" body={e => ActionBody(e, '/template/detail',
                    { route: '/template/delete', action: deleteTemplate }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default Templates;