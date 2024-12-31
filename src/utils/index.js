import { useState, useEffect } from 'react';
import { getData } from '@/lib/request';

export function removeUndefinedProps(obj) {
    for (let prop in obj) {
        if (obj[prop] === undefined || obj[prop] === '' || obj[prop] === null) {
            delete obj[prop];
        }
    }
    return obj;
}

export const getUsersFromUserIds = (arrays, arrayId) => {
    let data = [];
    if (arrays && arrays[0]) {
        arrayId.forEach(ai => {
            arrays.forEach(a => {
                if (ai === a.user_id) data.push(a);
            })
        })
    };
    return data;
};

export const getObjectFromIds = (arrays, arrayId) => {
    let data = [];
    if (arrays && arrays[0] && arrayId && arrayId[0]) {
        arrayId.forEach(ai => {
            arrays.forEach(a => {
                if (a.user_id) {
                    if (ai === a.user_id) data.push(a);
                } else {
                    if (ai === a.id) data.push(a);
                }
            })
        })
    };
    return data;
};


export const formatTreeData = (arr, i = 0) => {
    i++;
    return arr.map(item => {
        if (Array.isArray(item)) {
            return formatTreeData(item);
        } else if (typeof item === 'object') {
            const newItem = {};
            for (let key in item) {
                if (key === 'id' && i !== 3) {
                    newItem['key'] = item[key] + ' - ' + String(i);
                } else if (key === 'name') {
                    newItem['label'] = item[key];
                }
                if (key === 'full_name') {
                    newItem['label'] = item[key];
                }
                if (key === 'user_id') {
                    newItem['key'] = item[key];
                }
                if (Array.isArray(item[key])) {
                    newItem['children'] = formatTreeData(item[key], i);
                }
            }
            return newItem;
        } else {
            return item;
        }
    });
};

export const getArrIdFromTreeSelect = (object) => {
    let arr = [];
    let newArr = [];
    for (let key in object) {
        if (!key.includes('-') && (object[key] && object[key].checked)) {
            if (object[key] && (object[key].sort === 0 || object[key].sort)) {
                arr[Number(object[key].sort)] = Number(key);
            } else newArr.push(Number(key));
        };
    };
    return arr.concat(newArr);
};

export const formatTreeSelect = (array) => {
    let newObject = {};
    array.forEach((a, index) => {
        newObject[`${a}`] = { checked: true, partialChecked: true, sort: index };
    });
    return newObject;
}

export const getArrId = (arr) => {
    const newArr = [];
    if (arr && arr[0]) {
        arr.forEach(a => {
            if (a.user_id) {
                newArr.push(a.user_id);
            } else {
                newArr.push(a.id);
            }
        })
    }
    return newArr;
};

export const getUserByArrUserId = (users, arr) => {
    const newData = [];
    users.forEach(n => {
        if (arr.includes(n.user_id)) {
            newData.push(n);
        };
    });
    return newData;
};

export const refreshObject = (object) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof object[key] === 'string') object[key] = ''
            else if (Array.isArray(object[key])) object[key] = []
            else if (typeof object[key] === 'object') object[key] = {}
            else object[key] = undefined;
        };
    };
    return object;
};

export const getSale = (users) => {
    const newData = [];
    users.forEach(u => {
        if (u.id) newData.push({ ...u, full_name: u.full_name + ' - ' + u.code_staff });
    });
    return newData;
};

export const removePropObject = (object1, object2) => {
    const changedProperties = {};
    for (const key in object1) {
        if (object1.hasOwnProperty(key) && JSON.stringify(object1[key]) !== JSON.stringify(object2[key])) {
            changedProperties[key] = object1[key];
        }
    };
    return changedProperties;
};

export const useListUserByPermission = (param) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/permission_group/getUserByPermission", { staff_object_id: param });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [param]);
    return data;
};

export const useDetailPermission = () => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await getData("web/permission_group/getDetailPermission");
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, []);
    return data;
};

export const useListCity = () => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListCities");
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, []);
    return data;
};

export const useListDistrict = (province_id) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListDistricts", { province_id: province_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [province_id]);
    return data;
};

export const useListWard = (district_id) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await getData("web/address/getListWard", { district_id: district_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [district_id]);
    return data;
};

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export const listToast = [
    { severity: 'success', summary: 'Successful' },
    { severity: 'error', summary: 'Error' },
    { severity: 'warn', summary: 'Warning' },
    { severity: 'info', summary: 'Info' },
];