import { useState, useEffect } from 'react';
import { listSalePolicy, countSalePolicy, detailSalePolicy, listSalePolicyV2 } from '../api';

export const useListSalePolicy = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listSalePolicy({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListSalePolicyV2 = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listSalePolicyV2({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountSalePolicy = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countSalePolicy({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailSalePolicy = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailSalePolicy({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const type_bonus = [
    { name: 'vnđ', id: 1 },
    { name: '%', id: 2 },
];

export const from_types = [
    { name: 'Ký HĐMB', id: 1 },
    { name: 'Đặt cọc', id: 2 },
];