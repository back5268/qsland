import { useState, useEffect } from 'react';
import { listPermissionGroup, countPermissionGroup, listPermissionToolCate, detailPermissionGroup } from '../api';
import { getData } from '@/lib/request';

export const useListPermissionGroup = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listPermissionGroup({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountPermissionGroup = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await countPermissionGroup({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListPermissionToolCate = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listPermissionToolCate(params);
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useDetailPermissionGroup = ({ id, staff_object_id }) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailPermissionGroup({ id: id, staff_object_id: staff_object_id });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [id, staff_object_id]);
    return data;
};

export const basePermissions = [
    {
        id: "thukydonvi",
        name: "Thư ký đơn vị",
        desc: "Thư ký đơn vị",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "truongphong",
        name: "Quyền trưởng phòng",
        desc: "Quyền trưởng phòng",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "truongnhom",
        name: "Quyền trưởng nhóm",
        desc: "Quyền trưởng nhóm",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "dieuphoikinhdoanh",
        name: "Điều phối kinh doanh",
        desc: "Điều phối kinh doanh",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "nhanvienbanhang",
        name: "Quyền nhân viên sale",
        desc: "Quyền nhân viên sale",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "giamdocsan",
        name: "Giám đốc sàn",
        desc: "Giám đốc sàn",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "dichvukhachhang",
        name: "Dịch vụ khách hàng",
        desc: "Dịch vụ khách hàng",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "ketoan",
        name: "Kế toán",
        desc: "kế toán",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "phongdautu",
        name: "Phòng đầu tư",
        desc: "Phòng đầu tư",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "nguoidangtin",
        name: "Người đăng tin",
        desc: "Người đăng tin",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
    {
        id: "quanlynhansu",
        name: "Quản lý nhân sự",
        desc: "Quản lý nhân sự",
        created_at: '2023-05-11 14:23:10',
        status: 1,
    },
];