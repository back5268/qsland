import { postData, getData } from "@/lib/request";

export const listExchange = (params) => getData("web/exchange/getListExchange", params);
export const countExchange = (params) => getData("web/exchange/countExchange", params);
export const deleteExchange = (params) => postData("web/exchange/deleteExchange", params);

export const detailExchange = (params) => getData("web/exchange/getDetailExchange", params);
export const addExchange = (param) => postData("/web/exchange/addExchange", param);
export const updateExchange = (param) => postData("/web/exchange/updateExchange", param);