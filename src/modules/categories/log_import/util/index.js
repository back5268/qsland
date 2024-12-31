import { useEffect, useState } from "react";
import { countLogImportProduct, listLogImportProduct } from "../api";

export const useListLogImportProduct = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listLogImportProduct({ status: 1, ...params});
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountLogImportProduct = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countLogImportProduct({ status: 1, ...params});
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};