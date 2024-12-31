import { getData } from "@/lib/request";

export const listCustomerRecall = (params) => getData("web/customer/getListCustomerRecall", params);
export const countCustomerRecall = (params) => getData("web/customer/countCustomerRecall", params);
