import { useState, useEffect } from 'react';
import { listRevenueCode, countRevenueCode, detailRevenueCode } from '../api';

export const useListRevenueCode = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listRevenueCode({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountRevenueCode = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countRevenueCode({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailRevenueCode = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailRevenueCode({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};