import { postData, getData } from "@/lib/request";

export const listSaleCampaign = (params) => getData("web/campaign_sale/getListCampaignSale", params);
export const countSaleCampaign = (params) => getData("web/campaign_sale/countCampaignSale", params);
export const deleteSaleCampaign = (param) => postData("/web/campaign_sale/deleteCampaignSale", param);

export const detailSaleCampaign = (params) => getData("web/campaign_sale/getDetailCampaignSale", params);
export const addSaleCampaign = (param) => postData("/web/campaign_sale/addCampaignSale", param);
export const updateSaleCampaign = (param) => postData("/web/campaign_sale/updateCampaignSale", param);