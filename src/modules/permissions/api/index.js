import { postData, getData } from "@/lib/request";

export const listPermissionGroup = (params) => getData("web/permission_group/getListPermissionGroup", params);
export const countPermissionGroup = (params) => getData("web/permission_group/countPermissionGroup", params);
export const listPermissionToolCate = (params) => getData("web/permission_tool_category/getListPermissionToolCate", params);
export const deletePermissionGroup = (param) => postData("/web/permission_group/delPermissionGroup", param);

export const detailPermissionGroup = (params) => getData("/web/permission_group/getDetailPermissionGroup", params);
export const addPermissionGroup = (param) => postData("/web/permission_group/addPermissionGroup", param);
export const updatePermissionGroup = (param) => postData("/web/permission_group/updatePermissionGroup", param);