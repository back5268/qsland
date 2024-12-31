import { useState, useEffect } from 'react';
import { listBank, countBank, detailBank } from '../api';

export const useListBank = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listBank({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountBank = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countBank({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailBank = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailBank({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const pttts = [
    { name: 'Tiền mặt', id: 'TM' },
    { name: 'Chuyển Khoản', id: 'CK' },
    { name: 'Quẹt thẻ', id: 'QT' },
    { name: 'QR code', id: 'QRC' },
    { name: 'Mobile Banking', id: 'MB' },
    { name: 'Thu tiền mặt chủ đầu tư', id: 'TTMCDT' },
    { name: 'Thu chuyển khoản chủ đầu tư', id: 'TCKCDT' },
    { name: 'Thanh toán Momo', id: 'TTMM' },
    { name: 'Test phương thức thanh toán', id: 'TPTTT' },
];

export const branches = [
    { name: 'Chi nhánh 1', id: 'CN1' },
    { name: 'Chi nhánh 2', id: 'CN2' },
    { name: 'Chi nhánh 3', id: 'CN3' },
    { name: 'Chi nhánh 4', id: 'CN4' },
    { name: 'Chi nhánh 5', id: 'CN5' },
    { name: 'Chi nhánh 6', id: 'CN6' },
];