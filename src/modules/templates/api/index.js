import { postData, getData } from "@/lib/request";

export const listTemplate = (params) => getData("web/template/getListTemplate", params);
export const countTemplate = (params) => getData("web/template/countTemplate", params);
export const deleteTemplate = (params) => postData("web/template/deleteTemplate", params);

export const detailTemplate = (params) => getData("web/template/getDetailTemplate", params);
export const addTemplate = (param) => postData("/web/template/addTemplate", param);
export const updateTemplate = (param) => postData("/web/template/updateTemplate", param);

