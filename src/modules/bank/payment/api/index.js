import { postData, getData } from "@/lib/request";

export const listBillByKeToan = (params) => getData("web/bill/getListBillByKeToan", params);
export const listPayment = (params) => getData("web/payment_history/getListPaymentHistory", params);
export const xemPhieuThu = (params) => getData("web/payment_history/xemPhieuThu", params);
export const countPayment = (params) => getData("web/payment_history/countPaymentHistory", params);
export const detailPayment = (params) => getData("web/payment_history/getDetailPaymentHistory", params);

export const addPayment = (param) => postData("web/payment_history/addPaymentHistory", param);
export const updatePayment = (param) => postData("web/payment_history/xacNhanThanhToan", param);