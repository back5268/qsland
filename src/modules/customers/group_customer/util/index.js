import { useEffect, useState } from "react";
import { countGroupCustomer, detailGroupCustomer, listGroupCustomer } from "../api";

export const useListGroupCustomer = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listGroupCustomer({ status: 1, ...params});
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountGroupCustomer = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countGroupCustomer({ status: 1, ...params});
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailGroupCustomer = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailGroupCustomer({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};