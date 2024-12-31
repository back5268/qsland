import { postData, getData } from "@/lib/request";

export const listGroupSale = (params) => getData("web/group_sale/getListGroupSale", params);
export const listGroupSaleV2 = (params) => getData("web/group_sale/getListGroupSaleV2", params);
export const listSale = (params) => getData("web/group_member/getListGroupMember", params);
export const countGroupSale = (params) => getData("web/group_sale/countGroupSale", params);
export const deleteGroupSale = (param) => postData("web/group_sale/deleteGroupSale", param);

export const detailGroupSale = (params) => getData("web/group_sale/getDetailGroupSale", params);
export const addGroupSale = (param) => postData("/web/group_sale/addGroupSale", param);
export const updateGroupSale = (param) => postData("/web/group_sale/updateGroupSale", param);