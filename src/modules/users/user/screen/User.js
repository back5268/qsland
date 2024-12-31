import React, { useState } from 'react';
import { Dropdownz, Inputz, GridForm } from '@/components/ListForm';
import {
    TimeBody,
    StatusBody,
    ActionBody,
    RenderHeader,
    Columnz,
    DataTablez, useGetParams
} from "@/components/DataTable";
import ImportUser from "./ImportUser";
import { useListUser, useCountUser, isActives } from "../util";
import { updateUser, deleteUser, exportUser } from "../api";
import { useListCompany } from "@/modules/companys/company/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListGroupSaleV2 } from "../../group_sale/util";
import DeleteUser from './DeleteUser';
import Dialogz from '@/components/Dialogz';
import ImportSignature from './ImportSignature';
import {removeUndefinedProps} from "@/utils";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });
    const companys = useListCompany();
    const exchanges = useListExchange({ company_id: filter.company_id });
    const groupSales = useListGroupSaleV2({ company_id: filter.company_id, exchange_id: filter.exchange_id });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9" >
            <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })}
                placeholder="Tìm kiếm theo tên, tài khoản, email ..." />
            <Dropdownz value={filter.status} options={isActives} placeholder="Trạng thái"
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
            <Dropdownz value={filter.company_id} options={companys} placeholder="Chọn công ty"
                onChange={(e) => setFilter({ ...filter, company_id: e.target.value, exchange_id: undefined, group_sale_id: undefined })} />
            <Dropdownz value={filter.exchange_id} options={exchanges} placeholder="Chọn phòng ban"
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value, group_sale_id: undefined })} />
            <Dropdownz value={filter.group_sale_id} options={groupSales} placeholder="Chọn nhóm sale"
                onChange={(e) => setFilter({ ...filter, group_sale_id: e.target.value })} />
        </GridForm>
    )
};

const User = () => {
    const [visible, setVisible] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [visibleImport, setVisibleImport] = useState(false);
    const [userDelete, setUserDelete] = useState(null);
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const data = useListUser({ status: undefined, ...paramsPaginator,  first: undefined });
    const totalRecords = useCountUser({ status: undefined, ...paramsPaginator,  first: undefined });

    const header = RenderHeader({
        title: 'Danh sách nhân viên', add: '/user/add',
        imports: { route: '/user/import', action: () => setVisible(true) },
        importSignature: { route: '/user/import', action: () => setVisibleImport(true) },
        exports: {
            route: '/user/export', action: () => exportUser(paramsPaginator),
            totalRecords: totalRecords, file: 'users.xlsx'
        },
    });

    return (
        <div className="card">
            <Dialogz title="Xóa nhân viên" visible={visibleDelete} onHide={() => setVisibleDelete(false)}>
                <DeleteUser user_id={userDelete} setVisibleDelete={setVisibleDelete}
                    paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            </Dialogz>
            <Dialogz title="Import nhân viên" visible={visible} onHide={() => setVisible(false)}>
                <ImportUser />
            </Dialogz>
            <Dialogz title="Import chữ ký nhân viên" visible={visibleImport} onHide={() => setVisibleImport(false)}>
                <ImportSignature setVisibleImport={setVisibleImport} />
            </Dialogz>
            <Header setParamsPaginator={setParamsPaginator} paramsPaginator={paramsPaginator} />
            <DataTablez value={data} header={header} dataKey="user_id" title="nhân viên"
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} totalRecords={totalRecords}>
                <Columnz field="username" header="Tài khoản" />
                <Columnz field="email" header="Email đăng ký" />
                <Columnz field="code_staff" header="Mã nhân viên" />
                <Columnz field="full_name" header="Tên nhân viên" />
                <Columnz header="Tên phòng ban" field="exchange_name" />
                <Columnz header="Tên nhóm" field="group_sale_name" />
                <Columnz header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Trạng thái" body={(e) => StatusBody(e,
                    { route: '/user/update', action: updateUser })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/user/detail', {
                    route: '/user/delete', action: deleteUser, options: () => { setVisibleDelete(true); setUserDelete(e.user_id) }
                }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
            </DataTablez>
        </div>
    )
};

export default User;