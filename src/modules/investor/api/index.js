import { getData, postData } from "@/lib/request";

export const listInvestor = (params) => getData("web/investor/getListInvestor", params);
export const countInvestor = (params) => getData("web/investor/countInvestor", params);
export const deleteInvestor = (param) => postData("web/investor/deleteInvestor", param);

export const detailInvestor = (params) => getData("web/investor/getDetailInvestor", params);
export const addInvestor = (param) => postData("web/investor/addInvestor", param);
export const updateInvestor = (param) => postData("web/investor/updateInvestor", param);