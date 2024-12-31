import {getCity, getDistrict, getWard} from "@/modules/address/service/index";
export const _getCity = (param) => getCity("web/address/getListCities", param)
export const _getDistrict = (param) => getDistrict("web/address/getListDistricts", param)
export const _getWard = (param) => getWard("web/address/getListWard", param)