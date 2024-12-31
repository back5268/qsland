import { getData, getDataV3, postData } from "@/lib/request";

export const listViolation = (params) => getData("web/sale_violation/getListSaleViolation", params);
export const countViolation = (params) => getData("web/sale_violation/countSaleViolation", params);
export const forgiveViolation = (params) => postData("web/sale_violation/forgiveViolation", params);

export const exportViolation = (param) => getDataV3("web/sale_violation/expListViolation", param);
export const sendExplanation = (param) => postData("app/sale_violation/sendExplanation", param, true);
export const cancelExplanation = (param) => postData("app/sale_violation/cancelExplanation", param);
export const detailExplanation = (param) => getData("web/sale_violation/getDetailFilterViolatingCustomers", param);
export const browseExplanation = (param) => postData("web/sale_violation/browseExplanations", param);