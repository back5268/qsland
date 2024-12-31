import { postData, getData, getDataV3 } from "@/lib/request";

export const listUser = (params) => getData("web/user/getListUser", params);
export const listUserV2 = (params) => getData("web/user/getListNameUser", params);
export const countUser = (params) => getData("web/user/countUser", params);
export const importUser = (param) => postData("/web/user/importUser", param, true);
export const importSignature = (param) => postData("/web/user/importSignature", param, true);
export const exportUser = (param) => getDataV3("web/user/expListUser", param);
export const listCustomerBeforeDel = (param) => getData("web/user/getListCustomerBeforeDel", param);
export const deleteUser = (param) => postData("web/user/deleteUser", param);

export const detailUser = (params) => getData("web/user/getDetailUser", params);
export const addUser = (param) => postData("/web/user/addUser", param, true);
export const recallCustomer = (param) => postData("/web/user/recallCustomer", param);
export const updateUser = (param) => postData("/web/user/updateUser", param, true);