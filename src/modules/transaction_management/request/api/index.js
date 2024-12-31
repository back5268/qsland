import { postData, getData } from "@/lib/request";

export const listRequired = (params) => getData("web/required/getListLogRequired", params);
export const countRequired = (params) => getData("web/required/countLogRequired", params);