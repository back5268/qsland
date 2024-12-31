import {InputText, Dropdown, Button, Calendar} from "@/uiCore";
import {refreshObject, removeUndefinedProps} from "@/utils";
import { MultiSelect } from "primereact/multiselect";
import {classNames} from 'primereact/utils';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

export const Calendarz = (props) => {
    const {className, ...prop} = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <Calendar dateFormat="dd/mm/yy" selectionMode="range" placeholder='Chọn khoảng thời gian'
                      showIcon readOnlyInput className='w-full' showButtonBar {...prop} />
        </div>
    )
};

export const MultiSelectz = (props) => {
    const {optionLabel, optionValue, className, ...prop} = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <MultiSelect optionLabel={optionLabel ? optionLabel : 'name'} filter display="chip"
                         optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
        </div>
    )
};

export const Inputz = (props) => {
    const {id, placeholder, className, ...prop} = props;
    return (
        <div className={classNames("mb-2 col-12 md:col-6 lg:col-3", className)}>
            <InputText id={id} placeholder={placeholder ? placeholder : 'Tìm kiếm theo tên ...'}
                       style={{padding: '0.75rem'}} className="w-full" {...prop} />
        </div>
    )
};

export const Dropdownz = (props) => {
    const {optionLabel, optionValue, className, ...prop} = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <Dropdown optionLabel={optionLabel ? optionLabel : 'name'} filter appendTo="self"
                      optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
        </div>
    )
};

export const GridForm = (props) => {
    const {className, paramsPaginator, setParamsPaginator, moreFilter, filter, setFilter, handleFilter, keys} = props;
    const location = useLocation();

    const handleClear = () => {
        setParamsPaginator({
            page: paramsPaginator.page || 1, limit: paramsPaginator.limit || 5,
            first: paramsPaginator.first || 0, render: paramsPaginator.render,
            rows: paramsPaginator.rows || 5, permission: filter.permission || paramsPaginator.permission, ...moreFilter
        });
        setFilter(refreshObject(filter));
    };

    const handleSubmit = (e) => {
        let filters = filter;
        e.preventDefault();
        if (handleFilter) {
            filters = handleFilter(filter);
        }
        setParamsPaginator({
            page: paramsPaginator.page || 1, limit: paramsPaginator.limit || 5,
            first: paramsPaginator.first || 0, render: paramsPaginator.render,
            rows: paramsPaginator.rows || 5, ...removeUndefinedProps(filters)
        });
    };

    useEffect(() => {
        const params = {};
        const queryParams = new URLSearchParams(location.search);
        const dates = []
        if (keys) {
            for (let [key, value] of queryParams.entries()) {
                if (key === 'from' || key === 'to') {
                    if (key === 'from') {
                        dates[0] = new Date(value)
                    }
                    if (key === 'to') {
                        dates[1] = new Date(value)
                    }
                } else if (keys.includes(key)) {
                    if (Number(value)) params[key] = [Number(value)];
                    else if (value.includes(',')) {
                        const arr = value.split(',');
                        params[key] = []
                        if (arr && arr[0]) {
                            arr.forEach(a => {
                                if (Number(a)) params[key].push(Number(a));
                            })
                        }
                    } 
                } else params[key] = Number(value) || value;
            }
        } else {
            for (let [key, value] of queryParams.entries()) {
                if (key === 'from' || key === 'to') {
                    if (key === 'from') {
                        dates[0] = new Date(value)
                    }
                    if (key === 'to') {
                        dates[1] = new Date(value)
                    }
                } else params[key] = Number(value) || value;
            }
        }
        if (dates && dates[0]) params['dates'] = dates
        setFilter({...filter, ...params })
    }, [])

    return (
        <form onSubmit={handleSubmit} className="grid formgrid mb-2 aligin-items-center">
            {props.children}
            <div className={classNames("mb-2 col-12 md:col-12 lg:col-3 flex justify-content-end", className)}>
                <Button type="button" label="Làm mới" onClick={handleClear} severity="secondary"
                        style={{minWidth: '96px', height: '40px'}} size="small" outlined/>
                <Button type="submit" label="Lọc" className="ml-2" severity="info" size="small" raised
                        style={{minWidth: '96px', height: '40px'}}/>
            </div>
        </form>
    )
};