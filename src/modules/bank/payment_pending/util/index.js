import { useState, useEffect } from 'react';
import { listPaymentPending, countPaymentPending, detailPaymentPending } from '../api';

export const useListPaymentPending = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listPaymentPending(params);
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useCountPaymentPending = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countPaymentPending(params);
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useDetailPaymentPending = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailPaymentPending({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};