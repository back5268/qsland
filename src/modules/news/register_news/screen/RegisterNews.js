import React, {Fragment, useState} from 'react';
import {RenderHeader, Columnz, DataTablez, TimeBody, Body, useGetParams} from "@/components/DataTable";

import { useListRegisterNews, useCountRegisterNews } from "../util";
import { Dropdownz, GridForm } from '@/components/ListForm';
import { useListNews } from '../../news/util';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListExchange } from '@/modules/companys/exchange/util';
import { useListUserV2 } from '@/modules/users/user/util';
import { exportRegisterNews } from '../api';
import {removeUndefinedProps} from "@/utils";

const news_types = [
    { name: 'Sự kiện nội bộ', id: 3 },
    { name: 'Sự kiện mở bán', id: 4 },
]
const Header = (props) => {
    const { setParamsPaginator, paramsPaginator, categories, exchanges, users, news } = props
    const [filter, setFilter] = useState({});

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9" >
            <Dropdownz value={filter.news_id} options={news} placeholder="Chọn sự kiện" optionLabel="title"
                onChange={(e) => setFilter({ ...filter, news_id: e.target.value })} />
            <Dropdownz value={filter.type_news} options={news_types} placeholder="Chọn loại sự kiện"
                onChange={(e) => setFilter({ ...filter, type_news: e.target.value })} />
            <Dropdownz value={filter.category_id} options={categories} placeholder="Chọn dự án"
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} />
            <Dropdownz value={filter.exchange_id} options={exchanges} placeholder="Chọn đơn vị"
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value })} />
            <Dropdownz value={filter.user_id} options={users} placeholder="Chọn nhân viên"
                onChange={(e) => setFilter({ ...filter, user_id: e.target.value })} />
        </GridForm>
    )
};

const RegisterNews = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const data = useListRegisterNews({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountRegisterNews({ ...paramsPaginator, first: undefined });
    const news = useListNews()
    const users = useListUserV2();
    const categories = useListCategoryV2();
    const exchanges = useListExchange();

    const CustomerBody = (e) => {
        if (e.customer) {
            const customer = JSON.parse(e.customer);
            if (customer) return <span><b>{customer.full_name}</b>
                {customer.email ? <Fragment><br/>{customer.email}</Fragment> : ''}
                {customer.phone ? <Fragment><br/>{customer.phone}</Fragment> : ''}</span>
        }
    }

    const header = RenderHeader({
        title: 'Danh sách đăng ký sự kiện', add: '/register_news/add',
        imports: { route: '/register_news/import', action: () => { } },
        exports: {
            route: '/register_news/export', action: () => exportRegisterNews(paramsPaginator),
            totalRecords: totalRecords, file: 'register_news.xlsx'
        },
    });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
                    categories={categories} exchanges={exchanges} users={users} news={news} />
            <DataTablez value={data} header={header}
                title="đăng ký sự kiện" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz body={e => Body(news, e.news_id)} header="Tiêu đề sự kiện" />
                <Columnz body={e => Body(news_types, e.type_news)} header="Loại sự kiện" />
                <Columnz body={e => Body(users, e.user_id)} header="NV đăng ký" />
                <Columnz body={e => Body(exchanges, e.exchange_id)} header="Đơn vị" />
                <Columnz body={e => Body(categories, e.category_id)} header="Dự án" />
                <Columnz body={CustomerBody} header="Khách hàng" bodyStyle={{ minWidth: '8rem' }} />
                <Columnz header="Ngày đăng ký" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default RegisterNews;