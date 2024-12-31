import {clientApi} from "@/utils/axios";

async function getCity(url, params) {
    return await clientApi.get(url);
}
async function getDistrict(url, params) {
    return await clientApi.get(url);
}async function getWard(url, params) {
    return await clientApi.get(url);
}

export {
    getCity,
    getDistrict,
    getWard,
}