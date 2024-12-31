import { getData } from "@/lib/request";

export const getLineData = (params) => getData("web/customer/countCustomersAllocatedByMonth", params);
export const getPieData = (params) => getData("web/customer/getDetailCustomerStatus", params);
export const getBarData = (params) => getData("web/customer/countCustomerOverviewOfManager", params);
export const getTransactionData = (params) => getData("web/bill/getListReportBill", params);
export const getSaleData = (params) => getData("web/bill/getListSalesReportBill", params);
export const getScope = (params) => getData("web/permission_group_member/getListPermission", params);