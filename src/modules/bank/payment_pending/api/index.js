import { postData, getData } from "@/lib/request";

export const listPaymentPending = (params) => getData("web/payment_info/getListPaymentInfo", params);
export const countPaymentPending = (params) => getData("web/payment_info/countPaymentInfo", params);
export const deletePaymentPending = (params) => postData("web/payment_info/delPaymentInfo", params);

export const detailPaymentPending = (params) => getData("web/payment_info/getDetailPaymentInfo", params);
export const addPaymentPending = (param) => postData("/web/payment_info/addPaymentInfo", param);
export const updatePaymentPending = (param) => postData("/web/payment_info/updatePaymentInfo", param);