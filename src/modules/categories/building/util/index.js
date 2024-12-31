import { useState, useEffect } from 'react';
import { listCategory, listBuilding, countCategory, detailCategory, listBuildingV2 } from '../api';

export const useListBuilding = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listCategory({ cb_level: 2, cb_status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListBuildingV2 = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listBuildingV2({ cb_level: 2, cb_status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListBuildingByCategoryId = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listBuilding({ category_id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useCountBuilding = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countCategory({ cb_level: 2, cb_status: 1, ...params });
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
    { id: 1, name: 'đặt cọc' },
    { id: 2, name: 'Đặt chỗ' },
    { id: 3, name: 'Gom chỗ theo chiến dịch' }
];

export const PK = [
    { id: 1, name: 'Phân khúc dự án' },
    { id: 2, name: 'Bình dân' },
    { id: 3, name: 'Trung cấp' },
    { id: 4, name: 'Trung cao cấp' },
    { id: 5, name: 'Cao cấp' },
    { id: 6, name: 'Hạng sang' },
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
    { name: 'Có', id: 1 },
    { name: 'Không', id: 2 }
];

export const LDA = [
    { name: 'Dự án thường', id: 0 },
    { name: 'Dự án nổi bật', id: 1 },
];

export const level = [
    { id: 1, name: 'Dự án' },
    { id: 2, name: 'Tòa' },
];

export const KBH = [
    { name: 'Bảng hàng bán chung', id: 1 },
    { name: 'Bảng hàng bán độc quyền', id: 2 },
];

export const CPL = [
    { name: 'Cho phép lock', id: 1 },
    { name: 'Không cho lock', id: 2 },
];

export const MR = [
    { name: 'Mở ráp', id: 1 },
    { name: 'Khóa ráp', id: 2 },
];