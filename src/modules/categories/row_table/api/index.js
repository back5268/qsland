import { getData, getDataV3, postData } from "@/lib/request";

export const listProduct = (params) => getData("web/product/getListProduct", params);
export const listProductName = (params) => getData("web/product/getListProductName", params);
export const countProduct = (params) => getData("web/product/countProduct", params);
export const countBuilding = (params) => getData("web/product/countBuilding", params);
export const listCustomerByBill = (params) => getData("web/customer/getListCustomerByBill", params);
export const detailProduct = (params) => getData("web/product/getDetailProduct", params);
export const importProduct = (params) => postData("web/product/importProduct", params, true);
export const exportProduct = (params) => getDataV3("web/product/expListProduct", params);
export const updateProduct = (params) => postData("web/product/updateProduct", params);

export const assembleProduct = (params) => postData("web/cart/assembleProduct", params);
export const recallProduct = (params) => postData("web/product/recallProduct", params);
export const updateAssembleProduct = (params) => postData("web/cart/updateAssembleProduct", params);
export const detailAssembleProduct = (params) => getData("web/cart/getDetailAssembleProduct", params);
export const listAssembleProduct = (params) => getData("web/cart/getListAssembleProduct", params);