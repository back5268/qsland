import { postData, getData } from "@/lib/request";

export const listBank = (params) => getData("web/payment_info/getListPaymentInfo", params);
export const countBank = (params) => getData("web/payment_info/countPaymentInfo", params);
export const deleteBank = (params) => postData("web/payment_info/delPaymentInfo", params);

export const detailBank = (params) => getData("web/payment_info/getDetailPaymentInfo", params);
export const addBank = (param) => postData("/web/payment_info/addPaymentInfo", param);
export const updateBank = (param) => postData("/web/payment_info/updatePaymentInfo", param);