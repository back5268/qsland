import { useState, useEffect } from 'react';
import { listCustomerRecall, countCustomerRecall } from '../api';

export const useListCustomerRecall = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCustomerRecall({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCustomerRecall = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCustomerRecall({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};