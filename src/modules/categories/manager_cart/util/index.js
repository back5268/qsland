import { useState, useEffect } from 'react';
import { listCart, countCart, detailCart } from '../api';

export const useListCart = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCart({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCart = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCart({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useDetailCart = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailCart({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};