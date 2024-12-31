import { getData, postData } from "@/lib/request";

export const listSalePolicy = (param) => getData("web/sale_policy/getListSalePolicy", param);
export const listSalePolicyV2 = (param) => getData("web/sale_policy/getListSalePolicyV2", param);
export const countSalePolicy = (param) => getData("web/sale_policy/countSalePolicy", param);
export const detailSalePolicy = (param) => getData("web/sale_policy/getDetailSalePolicy", param);
export const deleteSalePolicy = (param) => postData("web/sale_policy/deleteSalePolicy", param);

export const addSalePolicy = (param) => postData("web/sale_policy/addSalePolicy", param);
export const updateSalePolicy = (param) => postData("web/sale_policy/updateSalePolicy", param);