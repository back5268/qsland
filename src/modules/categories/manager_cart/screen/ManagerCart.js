import React, { Fragment, useEffect, useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {
    RenderHeader,
    ActionBody,
    Columnz,
    DataTablez,
    StatusBody,
    TimeBody,
    Body,
    useGetParams
} from "@/components/DataTable";
import { deleteCart, updateCart } from '../api';
import { useListCart, useCountCart } from "../util";
import { useListCategoryV2 } from '../../category/util';
import { isActives, useListUserV2 } from '@/modules/users/user/util';
import { formatNumber } from '../../row_table/util';
import { useDetailPermission, useListUserByPermission } from '@/utils';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [permission, setPermission] = useState([]);
    const [filter, setFilter] = useState({ name: '' });
    const categories = useListCategoryV2();
    const users = useListUserByPermission("quanlydohang");
    const permissions = useDetailPermission();

    useEffect(() => {
        const newPermission = []
        if (permissions[0]) {
            permissions.forEach(p => {
                if (p.staff_object_id && !newPermission.includes(p.staff_object_id)) {
                    newPermission.push(p.staff_object_id);
                }
            })
        }
        if (newPermission.includes("admin") || newPermission.includes("dieuphoikinhdoanh")) {
            newPermission.forEach((n, index) => {
                if (n === "quanlydohang") newPermission.splice(index, 1);
            })
        }
        setPermission([...newPermission])
    }, [permissions])

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-12">
            <Inputz value={filter.name} onChange={e => setFilter({ ...filter, name: e.target.value })} placeholder="Tìm kiếm theo tên, mã" />
            <Dropdownz value={filter.category_id} options={categories} placeholder="Chọn dự án"
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} />
            {!permission.includes("quanlydohang") && <Dropdownz value={filter.user_id_manager} options={users} placeholder="Người quản lý"
                onChange={(e) => setFilter({ ...filter, user_id_manager: e.target.value })} />}
            <Dropdownz value={filter.status} options={isActives} placeholder="Tình trạng"
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
        </GridForm>
    )
};

const ManagerCart = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const data = useListCart(paramsPaginator);
    const totalRecords = useCountCart(paramsPaginator);
    const users = useListUserV2();

    const ManagerCartBody = (e) => {
        let name = []
        if (e.user_manager_ids) {
            const user_manager_ids = JSON.parse(e.user_manager_ids)
            if (user_manager_ids && user_manager_ids[0]) {
                user_manager_ids.forEach(u => {
                    if (u) {
                        const user = users.find(user => user.id === u)
                        if (user) name.push(user.name);
                    }
                })
            }
        }
        if (name && name[0]) {
            return <Fragment>{
                name.map((n, index) =>
                    <span key={index}>{n} <br /> </span>
                )
            }</Fragment>
        }
    }

    const header = RenderHeader({ title: 'Danh sách rổ hàng', add: '/manager_cart/add' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={data} header={header} title="rổ hàng" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="code" header="Mã" />
                <Columnz field="name" header="Tên rổ" />
                <Columnz field="category_name" header="Dự án" />
                <Columnz body={e => formatNumber(e.time_hold)} header="Thời gian giữ căn (phút)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={ManagerCartBody} header="Người quản lý" />
                <Columnz body={e => TimeBody(e.updated_at)} header="Thời gian cập nhật" bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="quantity_product" header="Số lượng sản phẩm" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={e => StatusBody(e,
                    { route: '/manager_cart/update', action: updateCart })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/manager_cart/detail',
                    { route: '/manager_cart/delete', action: deleteCart }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}

export default ManagerCart;