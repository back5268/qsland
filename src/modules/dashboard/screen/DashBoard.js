import React, { Fragment, useEffect, useState } from 'react';
import LinearChart from './LinearChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

import { Dropdown as Dropdownz, Calendar as Calendarz } from "@/uiCore";
import { classNames } from 'primereact/utils';
import { useListExchange } from '@/modules/companys/exchange/util';
import { useListGroupSaleV2 } from '@/modules/users/group_sale/util';
import { useListUser } from '@/modules/users/user/util';
import { Button } from 'primereact/button';
import { useGetLineData, useGetScope } from '../util';
import SaleChart from './SaleChart';
import TransactionChart from './TransactionChart';
import { useListCategoryV2 } from '@/modules/categories/category/util';

export const Calendar = (props) => {
    const { className, ...prop } = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <Calendarz dateFormat="dd/mm/yy" selectionMode="range" placeholder='Chọn khoảng thời gian'
                showIcon readOnlyInput className='w-full' showButtonBar {...prop} />
        </div>
    )
};

export const Dropdown = (props) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6", className)}>
            <Dropdownz optionLabel={optionLabel ? optionLabel : 'name'} filter appendTo="self"
                optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
        </div>
    )
};

export const DialogFilter = (props) => {
    const { filter, setFilter, setVisible, filterByCate } = props;
    const exchanges = useListExchange();
    const groupSales = useListGroupSaleV2({ exchange_id: filter.exchange_id });
    const users = useListUser({ group_sale_id: filter.group_sale_id });
    const categories = useListCategoryV2()
    const [scopes, setScopes] = useState({});
    const data = useGetLineData({ month: 6, year: 2023 });
    const [newExchanges, setNewExchanges] = useState([]);
    const [newGroupSales, setNewGroupSales] = useState([]);

    useEffect(() => {
        let newScope = {};
        if (data && data.permission) {
            for (const key in data.permission) {
                if (data.permission[key] && data.permission[key][0]) {
                    newScope[key] = data.permission[key];
                };
            };
        };
        setScopes({ ...newScope });
    }, [JSON.stringify(data)])

    useEffect(() => {
        if (scopes.exchange) {
            setNewExchanges([ ...exchanges.filter(e => scopes.exchange.includes(e.id)) ]);
        } else if (scopes.group) {
            setNewGroupSales([ ...groupSales.filter(e => scopes.group.includes(e.id)) ]);
        }
        if (!scopes.group) {
            setNewGroupSales([...groupSales])
        }
    }, [JSON.stringify(scopes), exchanges, groupSales]);

    const handleClear = () => {
        setFilter({ ...filter, exchange_id: undefined, group_sale_id: undefined, user_id_sale: undefined, category_id: undefined });
    };

    return (
        <Fragment>
            <div className='card w-full' style={{ margin: '0 auto', minHeight: "600px" }}>
                {filterByCate ? <Fragment>
                    <label className="block text-900 font-medium">Chọn dự án</label>
                    <Dropdown value={filter.category_id} onChange={e => setFilter({ ...filter, category_id: e.target.value })}
                        filter optionValue="id" className='w-full mb-3' placeholder="Chọn dự án" options={categories} /></Fragment> : ''}
                {scopes && scopes.exchange && <Fragment>
                    <label className="block text-900 font-medium">Chọn phòng ban</label>
                    <Dropdown value={filter.exchange_id} onChange={e => setFilter({ ...filter, exchange_id: e.target.value, group_sale_id: undefined })}
                        optionLabel="name" filter optionValue="id" className='w-full mb-3' placeholder="Chọn phòng ban / sàn" options={newExchanges} /></Fragment>}
                {scopes && (scopes.exchange || scopes.group) && <Fragment>
                    <label className="block text-900 font-medium">Chọn nhóm</label>
                    <Dropdown value={filter.group_sale_id} onChange={e => setFilter({ ...filter, group_sale_id: e.target.value, user_id_sale: undefined })}
                        optionLabel="name" filter optionValue="id" className='w-full mb-3' placeholder="Chọn nhóm" options={(scopes.group || filter.exchange_id) ? newGroupSales : []} />
                </Fragment>}
                <label className="block text-900 font-medium">Chọn nhân viên</label>
                <Dropdown value={filter.user_id_sale} onChange={e => setFilter({ ...filter, user_id_sale: e.target.value })}
                    optionLabel="full_name" filter optionValue="user_id" className='w-full mb-3' placeholder="Chọn nhân viên" options={filter.group_sale_id ? users : []} />
            </div>
            <div className='flex justify-content-end mt-4'>
                <Button onClick={handleClear} severity="secondary" label="Làm mới" size="small" />
                <Button onClick={() => setVisible(false)} label="Xác nhận" size="small" className='ml-2' />
            </div>
        </Fragment>
    )
};

const ChartDemo = () => {
    const role = useGetScope();

    return (
        <div className="grid">
            <LinearChart role={role} />
            <PieChart role={role} />
            {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <BarChart role={role} />}
            {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <TransactionChart role={role} />}
            {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <SaleChart role={role} />}
        </div>
    );
};

export default ChartDemo;
