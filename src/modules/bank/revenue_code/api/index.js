import { postData, getData } from "@/lib/request";

export const listRevenueCode = (params) => getData("web/revenue/getListRevenue", params);
export const countRevenueCode = (params) => getData("web/revenue/countRevenue", params);
export const deleteRevenueCode = (params) => postData("web/revenue/deleteRevenue", params);

export const detailRevenueCode = (params) => getData("web/revenue/getDetailRevenue", params);
export const addRevenueCode = (param) => postData("web/revenue/addRevenue", param);
export const updateRevenueCode = (param) => postData("web/revenue/updateRevenue", param);