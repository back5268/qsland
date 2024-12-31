import { useState, useEffect } from 'react';
import { detailBill, listBill, countBill, listDiary } from '../api';

export const useListBill = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useListDiary = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listDiary({ code: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const useCountBill = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countBill({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailBill = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailBill({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const statusBill = [
    { id: 1, name: 'Chờ GĐKD duyệt', color: "success" },
    { id: 2, name: 'Chờ ĐPKD duyệt', color: "success" },
    { id: 3, name: 'Chờ KH xác nhận', color: "success" },
    { id: 4, name: 'KH đã duyệt - YC tạo TT', color: "success" },
    { id: 5, name: 'Chờ KT thu tiền', color: "success" },
    { id: 6, name: 'Chờ TKS duyệt', color: "success" },

    { id: 7, name: 'Đặt chỗ', color: "warning" },

    { id: 8, name: 'Chờ ĐPKD duyệt cọc', color: "success" },
    { id: 9, name: 'Đặt cọc', color: "success" },
    { id: 10, name: 'Chờ DVKH duyệt', color: "success" },

    { id: 11, name: 'Ký HĐMB', color: "info" },
    { id: 12, name: 'Hủy do quá hạn', color: "info" },
    { id: 13, name: 'Đã ráp', color: "info" },

    { id: -1, name: 'GĐKD hủy', color: "danger" },
    { id: -2, name: 'ĐPKD hủy', color: "danger" },
    { id: -3, name: 'TKS hủy', color: "danger" },
    { id: -4, name: 'KH từ chối', color: "danger" },
    { id: -5, name: 'Thanh lý hủy', color: "danger" },
    { id: -6, name: 'TLY đổi tên,đổi căn', color: "danger" },
    { id: -7, name: 'TLY Hủy cọc', color: "danger" },
    { id: -8, name: 'TLY Trả cọc', color: "danger" },
    { id: -9, name: 'TLY CĐT', color: "danger" },
    { id: -10, name: 'NVKD hủy', color: "danger" },
];

export const confirmForm = [
    { id: 0, name: 'Bình thường' },
    { id: 1, name: 'OTP' },
];

export const htgds = [
    { id: 1, name: 'Thường' },
    { id: 2, name: 'Nhanh' },
];

export const BillForm = [
    { id: 1, name: 'Gom chỗ' },
    { id: 2, name: 'Đặt cọc' },
    { id: 3, name: 'Đặt chỗ tạm thời' },
    { id: 4, name: 'Đặt chỗ cố định ( hủy chỗ cọc mới )' },
];

export const billTypes = [
    { id: 1, name: 'Đặt cọc', color: 'danger' },
    { id: 2, name: 'Đặt chỗ', color: 'primary' },
    { id: 3, name: 'Gom chỗ', color: 'warning' },
    { id: 4, name: 'Chuyển cọc', color: 'success' },
];

export const prioritys = [
    { name: 'ưu tiên 1', id: 1 },
    { name: 'Ưu tiên 2', id: 2 },
    { name: 'Ưu tiên 3', id: 3 },
]

export const TYPE_BY = {
    nvkd: 1,
    kh: 2,
    thuky: 3,
    qlkd: 4,
    ketoan: 5,
    gds: 6,
    dpkd: 7,
    dvkh: 8,
    qlrh: 9,
}

export const type_by = [
    { id: 1, name: 'NVKD' },
    { id: 2, name: 'KH' },
    { id: 3, name: 'Thư ký' },
    { id: 4, name: 'QLKD' },
    { id: 5, name: 'Kế toán' },
    { id: 6, name: 'Giám đốc sàn' },
    { id: 7, name: 'DPKD' },
    { id: 8, name: 'DVKH' },
    { id: 9, name: 'QLRH' },
]