import { getData, postData } from "@/lib/request";

export const listProgressBill = (params) => getData("web/progress_bill/getListProgressBill", params);
export const countProgressBill = (params) => getData("web/progress_bill/countProgressBill", params);
export const detailProgressBill = (params) => getData("web/progress_bill/getDetailProgressBill", params);
export const deleteProgressBill = (params) => postData("web/progress_bill/deleteProgressBill", params);
export const updateProgressBill = (params) => postData("web/progress_bill/updateProgressBill", params);
