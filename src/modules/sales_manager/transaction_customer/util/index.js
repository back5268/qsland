import { useState, useEffect } from 'react';
import { listCustomerHaveBill, countCustomerHaveBill } from '../api';

export const useListCustomerHaveBill = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCustomerHaveBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCustomerHaveBill = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCustomerHaveBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};