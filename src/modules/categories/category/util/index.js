import { useState, useEffect } from 'react';
import { listCategory, countCategory, detailCategory, listCategoryV2 } from '../api';

export const useListCategory = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCategory({ cb_level: 1, cb_status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListCategoryV2 = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCategoryV2({ cb_level: 1, cb_status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountCategory = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCategory({ cb_level: 1, cb_status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailCategory = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailCategory({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const GD = [
    { id: 1, name: 'Đặt cọc' },
    { id: 2, name: 'Đặt chỗ' },
    { id: 3, name: 'Gom chỗ theo chiến dịch' },
    { id: 4, name: 'Chuyển cọc' }
];

export const PK = [
    { id: 1, name: 'Bình dân' },
    { id: 2, name: 'Trung cấp' },
    { id: 3, name: 'Trung cao cấp' },
    { id: 4, name: 'Cao cấp' },
    { id: 5, name: 'Hạng sang' },
];

export const LH = [
    { name: 'Chung cư', id: 1 },
    { name: 'Đất nền', id: 2 },
    { name: 'Nhà xây thô ( shophouse )', id: 3 },
    { name: 'Liền kề - Biệt thự', id: 4 },
    { name: 'Condotel', id: 5 },
    { name: 'Thổ Cư', id: 6 },
    { name: 'Khác', id: 7 }
];

export const PLDA = [
    { name: 'Đủ tính pháp lý', id: 1 },
    { name: 'Chưa đủ tính pháp lý', id: 2 }
];

export const LDA = [
    { name: 'Dự án thường', id: 2 },
    { name: 'Dự án nổi bật', id: 1 },
];

export const level = [
    { id: 1, name: 'Dự án' },
    { id: 2, name: 'Tòa' },
];