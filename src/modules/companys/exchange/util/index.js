import { useState, useEffect } from 'react';
import { listExchange, countExchange, detailExchange } from '../api';

export const useListExchange = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listExchange({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountExchange = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countExchange({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailExchange = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailExchange({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};