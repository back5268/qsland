import React, { useState } from 'react';
import {
    RenderHeader,
    StatusBody,
    ActionBody,
    Columnz,
    DataTablez,
    TimeBody,
    Body,
    useGetParams
} from "@/components/DataTable";

import { useListNews, useCountNews, newLevel, newType, voteType } from "../util";
import { deleteNews, updateNews } from '../api';
import { Dropdownz, GridForm, Inputz } from '@/components/ListForm';
import { isActives } from '@/modules/users/user/util';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ title: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9" >
            <Inputz value={filter.title} onChange={e => setFilter({ ...filter, title: e.target.value })} />
            <Dropdownz value={filter.type} options={newType} placeholder="Chọn loại tin"
                onChange={(e) => setFilter({ ...filter, type: e.target.value })} />
            <Dropdownz value={filter.priority_level} options={newLevel} placeholder="Chọn mức độ ưu tiên"
                onChange={(e) => setFilter({ ...filter, priority_level: e.target.value })} />
            <Dropdownz value={filter.status} options={isActives} placeholder="Chọn trạng thái"
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
            <Dropdownz value={filter.comment_type} options={voteType} placeholder="Chọn loại bình chọn"
                onChange={(e) => setFilter({ ...filter, comment_type: e.target.value })} />
        </GridForm>
    )
};

const News = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListNews({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountNews({ ...paramsPaginator, first: undefined });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách tin tức', add: '/news/add' })}
                title="tin tức" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz body={e => Body(newType, e.type)} header="Loại tin" />
                <Columnz field="title" header="Tiêu đề" />
                <Columnz body={e => Body(newLevel, e.priority_level)} header="Mức độ ưu tiên" />
                <Columnz body={e => Body(voteType, e.comment_type)} header="Loại bình chọn" />
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Status" body={(e) => StatusBody(e,
                    { route: '/news/update', action: updateNews })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/news/detail',
                    { route: '/news/delete', action: deleteNews }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center', minWidth: '7rem' }} />
            </DataTablez>
        </div>
    )
}

export default News;