import { useEffect, useState } from "react";
import { countNews, detailNews, listNews } from "../api";

export const useListNews = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listNews({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountNews = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countNews({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailNews = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailNews({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const newType = [
    { name: 'Thông điệp', id: 1 },
    { name: 'Vinh danh', id: 2 },
    { name: 'Sự kiện nội bộ', id: 3 },
    { name: 'Sự kiện mở bán', id: 4 },
    { name: 'Tin nội bộ', id: 5 },
    { name: 'Tin dự án', id: 6 },
];

export const newLevel = [
    { name: 'Tin thường', id: 1 },
    { name: 'Tin nổi bật', id: 2 },
    { name: 'Tin trang chủ', id: 3 },
];

export const voteType = [
    { name: 'Thường', id: 1 },
    { name: 'Bình chọn', id: 2 },
];