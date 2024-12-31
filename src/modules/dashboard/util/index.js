import { useEffect, useState } from "react";
import { getBarData, getLineData, getPieData, getTransactionData, getSaleData, getScope } from "../api";

export const useGetLineData = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getLineData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetBarData = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getBarData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetPieData = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getPieData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetTransactionData = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getTransactionData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetSaleData = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getSaleData({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useGetScope = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getScope({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

