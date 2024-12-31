import { useState, useEffect } from 'react';
import { listRequired, countRequired } from '../api';

export const useListRequired = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listRequired({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountRequired = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countRequired({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const statusTransasion = [
    { id: 1, value: "R-LCK", name: "Chờ duyệt lock", color: "info" },
    { id: 2, value: "M-LCK", name: "Đã lock", color: "warning" },
    { id: 3, value: "M-CANCEL", name: "Đã hủy", color: "danger" },
    { id: 4, value: "R-CANCEL", name: "Yêu cầu hủy", color: "warning" },
    { id: 5, value: "R-BLL", name: "Tạo bill", color: "success" },
    { id: 6, value: "A-LCK", name: "Đã duyệt lock", color: "success" },
    { id: 7, value: "A-CANCEL", name: "Bung lock", color: "secondary" },
];