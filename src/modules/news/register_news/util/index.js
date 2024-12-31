import { useEffect, useState } from "react";
import { countRegisterNews, listRegisterNews } from "../api";

export const useListRegisterNews = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listRegisterNews({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountRegisterNews = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countRegisterNews({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};