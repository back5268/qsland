import { useState, useEffect } from 'react';
import { listCompany, countCompany, detailCompany } from '../api';

export const useListCompany = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCompany({ status: 1, ...params });
        if(response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCompany = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCompany({ status: 1, ...params });
        if(response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailCompany = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailCompany(params);
        if(response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, []);
    return data;
};