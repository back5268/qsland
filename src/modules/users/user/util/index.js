import { useState, useEffect } from 'react';
import { listUser, listUserV2, countUser, detailUser, listCustomerBeforeDel } from '../api';

export const useListUser = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listUser({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListUserV2 = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listUserV2({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListCustomerRecall = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCustomerBeforeDel( params );
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountUser = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countUser({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailUser = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailUser({ user_id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const isActives = [
    { name: 'Đã kích hoạt', id: 1 },
    { name: 'Chưa kích hoạt', id: 0 },
];

export const genders = [
    { name: 'Nam', id: 1 },
    { name: 'Nữ', id: 2 },
    { name: 'Khác', id: 3 },
];

export const marital_statuss = [
    { name: 'Độc thân', id: 1 },
    { name: 'Đã kết hôn', id: 2 },
];