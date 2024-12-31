import { useState, useEffect } from 'react';
import { listCustomer, countCustomer, detailCustomer, historyCare, listTransactionHistory } from '../api';

export const useListCustomer = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCustomer({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCustomer = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCustomer({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailCustomer = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailCustomer({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useHistoryCare = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await historyCare(params);
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useListTransactionHistory = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listTransactionHistory({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const interactiveStatus = [
    // { name: 'KH mới', id: 1 },
    // { name: 'Đang liên hệ', id: 2 },
    // { name: 'Đang chăm sóc', id: 3 },
    { name: 'Tiếp cận', id: 4 },
    { name: 'Tiềm năng', id: 5 },
    { name: 'Không nhu cầu', id: 6 },
    // { name: 'Giao Dịch', id: 7 },
    { name: 'Khách hàng thân thiết cấp 1', id: 8 },
    { name: 'Khách hàng thân thiết cấp 2', id: 9 },
    { name: 'Khách hàng thân thiết cấp 3', id: 10 },
];

export const statusAllocation = [
    { name: 'Chờ phân bổ', id: 1 },
    { name: 'Đã phân bổ', id: 2 },
    { name: 'Phản hồi', id: 3 },
];

export const status = [
    { name: 'VI PHẠM', id: 1 },
    { name: 'CHỜ DUYỆT', id: 2 },
    { name: 'ĐÃ DUYỆT', id: 3 },
    { name: 'TỪ CHỐI', id: 4 },
    { name: 'ĐÃ PHẠT', id: 5 },
    { name: 'ĐÃ THA', id: 6 },
];

export const genders = [
    { name: 'Nam', id: 1 },
    { name: 'Nữ', id: 2 },
    { name: 'Khác', id: 3 },
];

export const countrys = [
    { name: 'Việt Nam', id: 'viet_nam' },
    { name: 'Nước ngoài', id: 'nuoc_ngoai' },
];

export const createTypes = [
    { name: 'Khách hàng được phân bổ', id: 1 },
    { name: 'Cá nhân khai thác', id: 2 },
];

export const approachForm = ['Email', 'Gọi điện', 'Tin nhắn', 'Gặp mặt'];