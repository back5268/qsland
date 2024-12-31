import { postData, getData, getDataV3 } from "@/lib/request";

export const listCustomer = (params) => getData("web/customer/getListCustomer", params);
export const countCustomer = (params) => getData("web/customer/getCountCustomer", params);
export const importCustomer = (param) => postData("web/customer/importCustomer", param, true);
export const exportCustomer = (param) => getDataV3("web/customer/expListCustomer", param);
export const deleteCustomer = (param) => postData("web/customer/deleteCustomer", param);
export const recallCustomer = (param) => postData("web/customer/thuHoiKhachHang", param);

export const detailCustomer = (params) => getData("web/customer/getDetailCustomer", params);
export const historyCare = (params) => getData("web/customer/getListSaleCustomerCampaignHistory", params);
export const listTransactionHistory = (params) => getData("web/customer/getListTransactionHistory", params);
export const addCustomer = (param) => postData("/web/customer/addCustomer", param, true);
export const updateCustomer = (param) => postData("/web/customer/updateCustomer", param, true);
