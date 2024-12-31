import { getData } from "@/lib/request";

export const listCustomerHaveBill = (param) => getData("web/customer/getListCustomerHaveBill", param);
export const countCustomerHaveBill = (param) => getData("web/customer/countCustomerHaveBill", param);