import { useState, useEffect } from 'react';
import { listBillByKeToan, countPayment, detailPayment, listPayment } from '../api';

export const useListBillByKeToan = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listBillByKeToan({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListPayment = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listPayment({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountPayment = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countPayment({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailPayment = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailPayment({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const status_payment = [
    // { id: 0, name: 'Chờ duyệt', color: 'warning' },
    { id: 1, name: 'Chờ xử lý', color: 'warning' },
    { id: 2, name: 'Đã xử lý', color: 'success' },
    { id: 3, name: 'Từ chối', color: 'danger' },
]