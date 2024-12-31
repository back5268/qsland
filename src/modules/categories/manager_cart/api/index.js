import { postData, getData } from "@/lib/request";

export const listCart = (params) => getData("web/cart/getListCart", params);
export const countCart = (params) => getData("web/cart/countCart", params);
export const deleteCart = (param) => postData("/web/cart/deleteCart", param);

export const detailCart = (params) => getData("web/cart/getDetailCart", params);
export const addCart = (param) => postData("/web/cart/addCart", param, true);
export const updateCart = (param) => postData("/web/cart/updateCart", param, true);