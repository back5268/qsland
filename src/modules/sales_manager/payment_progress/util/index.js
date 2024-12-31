import { useEffect, useState } from "react";
import { countProgressBill, detailProgressBill, listProgressBill } from "../api";

export const useListProgressBill = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listProgressBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountProgressBill = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countProgressBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailProgressBill = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailProgressBill({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};