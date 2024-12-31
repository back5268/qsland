import { getData, postData } from "@/lib/request";

export const listLogImportProduct = (params) => getData("web/product/getListLogImportProduct", params);
export const countLogImportProduct = (params) => getData("web/product/countLogImportProduct", params);
