import { postData, getData } from "@/lib/request";

export const listCampaign = (params) => getData("web/campaign/getListCampaign", params);
export const countCampaign = (params) => getData("web/campaign/countCampaign", params);
export const deleteCampaign = (param) => postData("web/campaign/deleteCampaign", param);

export const detailCampaign = (params) => getData("web/campaign/getDetailCampaign", params);
export const addCampaign = (param) => postData("web/campaign/addCampaign", param);
export const updateCampaign = (param) => postData("web/campaign/updateCampaign", param);
