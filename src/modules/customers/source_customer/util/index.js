import { useEffect, useState } from "react";
import { countSource, detailSource, listSource } from "../api";

export const useListSource = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listSource({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountSource = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countSource({ status: 1, ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailSource = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailSource({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};