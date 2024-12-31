import { useState, useEffect } from 'react';
import { listSaleCampaign, countSaleCampaign, detailSaleCampaign } from '../api';

export const useListSaleCampaign = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listSaleCampaign({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountSaleCampaign = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countSaleCampaign({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailSaleCampaign = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailSaleCampaign({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};