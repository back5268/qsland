import { postData, getData } from "@/lib/request";

export const listCategory = (params) => getData("web/category/getListCategories", params);
export const listCategoryV2 = (params) => getData("web/category/getListCategoriesV2", params);
export const countCategory = (params) => getData("web/category/countCategories", params);
export const deleteCategory = (param) => postData("/web/category/deleteCategories", param);

export const detailCategory = (params) => getData("web/category/getDetailCategories", params);
export const addCategory = (param) => postData("/web/category/addCategories", param, true);
export const updateCategory = (param) => postData("/web/category/updateCategories", param, true);