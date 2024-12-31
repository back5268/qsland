import { useState, useEffect } from 'react';
import { detailProduct, countProduct, listProductName, listProduct, listCustomerByBill, countBuilding, detailAssembleProduct, listAssembleProduct } from '../api';

export const useListProduct = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listProduct({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListProductName = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listProductName({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountProduct = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countProduct({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountBuilding = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countBuilding({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListAssembleProduct = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listAssembleProduct({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListCustomerByBill = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCustomerByBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailProduct = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailProduct({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useDetailAssembleProduct = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailAssembleProduct({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const statusBDS = [
    { name: 'Chưa mở bán', id: 'CBA' },
    { name: 'Mở bán', id: 'MBA' },
    { name: 'Chờ duyệt lock', id: 'CHLOCK' },
    { name: 'Lock thành công', id: 'LOCKED' },
    { name: 'Đã thêm thông tin khách hàng', id: 'ADD_CUSTOMER' },
    { name: 'Khách hàng đã xác nhận', id: 'CUSTOMER_CONFIRM' },
    { name: 'Đặt chỗ', id: 'DCH' },
    { name: 'Chờ duyệt giao dịch', id: 'CDDCO' },
    { name: 'Đặt cọc', id: 'DCO' },
    { name: 'Hợp đồng mua bán', id: 'HDO' },
    { name: 'Chủ đầu tư thu hồi', id: 'HUY' },
    { name: 'Thanh toán', id: 'PAYMENT' },
    { name: 'Đã Ráp', id: 'RAP' },
];

export const formatNumber = (amount) => {
    if (amount) return new Intl.NumberFormat('en-US').format(amount);
};