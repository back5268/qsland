import { useEffect, useState } from "react";
import { countViolation, detailExplanation, listViolation } from "../api";

export const useListViolation = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listViolation({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountViolation = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countViolation({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailExplanation = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailExplanation({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const getSeverity = (e) => {
    switch (e) {
        case 1:
            return 'info';
        case 2:
            return 'warning';
        case 3:
            return 'success';
        case 4:
            return 'danger';
        case 5:
            return 'danger';
        case 6:
            return 'secondary';
        default:
            return null;
    }
};