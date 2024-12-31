import { postData, getData } from "@/lib/request";

export const listCategory = (params) => getData("web/category/getListCategories", params);
export const listBuilding = (params) => getData("web/product/getListBuilding", params);
export const listBuildingV2 = (params) => getData("web/category/getListCategoriesV2", params);
export const countCategory = (params) => getData("web/category/countCategories", params);

export const detailCategory = (params) => getData("web/category/getDetailCategories", params);
export const addCategory = (param) => postData("/web/category/addBuilding", param);
export const updateCategory = (param) => postData("/web/category/updateBuilding", param);