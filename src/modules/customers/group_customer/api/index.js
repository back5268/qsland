import { getData, postData } from "@/lib/request";

export const listGroupCustomer = (params) => getData("web/group_customer/getListGroupCustomer", params);
export const countGroupCustomer = (params) => getData("web/group_customer/countGroupCustomer", params);
export const deleteGroupCustomer = (param) => postData("web/group_customer/deleteGroupCustomer", param);

export const detailGroupCustomer = (params) => getData("web/group_customer/getDetailGroupCustomer", params);
export const addGroupCustomer = (param) => postData("web/group_customer/addGroupCustomer", param);
export const updateGroupCustomer = (param) => postData("web/group_customer/updateGroupCustomer", param);