import { useState, useEffect } from 'react';
import { listGroupSale, listSale, countGroupSale, detailGroupSale, listGroupSaleV2 } from '../api';

export const useListGroupSale = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listGroupSale({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListGroupSaleV2 = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listGroupSaleV2({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListSale = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listSale({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountGroupSale = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countGroupSale({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailGroupSale = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailGroupSale({ id: params });
        if (response.data.status) setData({ ...response.data.data.groupSale, user: response.data.data.user });
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};