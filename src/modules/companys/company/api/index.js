import { postData, getData } from "@/lib/request";

export const listCompany = (params) => getData("web/company/getListCompany", params);
export const countCompany = (params) => getData("web/company/countCompany", params);
export const deleteCompany = (params) => postData("web/company/deleteCompany", params);

export const detailCompany = (params) => getData("web/company/getDetailCompany", params);
export const addCompany = (param) => postData("/web/company/addCompany", param, true);
export const updateCompany = (param) => postData("/web/company/updateCompany", param, true);
