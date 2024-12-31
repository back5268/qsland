import {clientApi} from "@/utils/axios";

async function postAuth(url, params, config) {
    return await clientApi.post(url, params);
};

export const loginAPI = (param, config) => postAuth("/web/auth/login", param, config);
export const forgotPasswordAPI = (param, config) => postAuth("/web/auth/forgetAccount", param, config);
export const verifyAccountAPI = (param, config) => postAuth("/web/auth/verifyAccount", param, config);
export const setPasswordAPI = (param, config) => postAuth("/web/auth/setPword", param, config);
export const changePasswordAPI = (param, config) => postAuth("/web/auth/changePword", param, config);