import { getData, postData } from "@/lib/request";

export const listSource = (params) => getData("web/source/getListSource", params);
export const countSource = (params) => getData("web/source/countSource", params);
export const deleteSource = (param) => postData("web/source/deleteSource", param);

export const detailSource = (params) => getData("web/source/getDetailSource", params);
export const addSource = (param) => postData("web/source/addSource", param);
export const updateSource = (param) => postData("web/source/updateSource", param);