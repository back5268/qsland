import { useEffect, useState } from "react";
import { countInvestor, detailInvestor, listInvestor } from "../api";

export const useListInvestor = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listInvestor({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountInvestor = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countInvestor({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailInvestor = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailInvestor({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};