import { getData, postData } from "@/lib/request";

export const listNews = (params) => getData("web/news/getListNews", params);
export const countNews = (params) => getData("web/news/countNews", params);
export const deleteNews = (param) => postData("web/news/deleteNews", param);

export const detailNews = (params) => getData("web/news/getDetailNews", params);
export const addNews = (param) => postData("web/news/addNews", param, true);
export const updateNews = (param) => postData("web/news/updateNews", param, true);