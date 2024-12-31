import { getData, getDataV3 } from "@/lib/request";

export const listRegisterNews = (params) => getData("web/register_news/getListRegisterNews", params);
export const countRegisterNews = (params) => getData("web/register_news/countRegisterNews", params);
export const exportRegisterNews = (param) => getDataV3("web/register_news/expListRegisterNews", param);