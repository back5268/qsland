import { postData, getData } from "@/lib/request";

export const listBill = (params) => getData("web/bill/getListBill", params);
export const listBillNoPolicy = (params) => getData("web/sale_policy/getListBillNoPolicy", params);
export const countBill = (params) => getData("web/bill/countBill", params);

export const detailBill = (param) => getData("/web/bill/getInfoBillMore", param);
export const guiUuTien = (param) => postData("/web/bill/guiUuTien", param);
export const listDiary = (param) => getData("/web/bill/getListBillDiary", param);
export const viewPdfHopDongCho = (param) => getData("/web/bill/viewPdfHopDongCho", param);
export const viewPdfHopDongCoc = (param) => getData("/web/bill/viewPdfHopDongCoc", param);
export const viewPdfBaoGia = (param) => getData("/web/bill/viewPdfBaoGia", param);
export const viewPdfHopDong = (param) => getData("/app/bill/viewPdfHopDong", param);
export const cancelBill = (param) => postData("/web/bill/cancelBill", param);