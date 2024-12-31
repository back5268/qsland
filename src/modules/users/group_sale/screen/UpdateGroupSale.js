import { Column, DataTable, Button, MultiSelect } from "@/uiCore";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDetailGroupSale } from "../util";
import { useListCompany } from "@/modules/companys/company/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListUser } from "../../user/util";
import { removePropObject } from "@/utils";

import { DropdownForm, InputForm, InputSwitchForm, InputTextareaForm, AddForm } from "@/components/AddForm";
import { getUserByArrUserId, getSale, getArrId } from "@/utils";
import { addGroupSale, updateGroupSale } from "../api";

const InfoRequired = (props) => {
    const { infos, setInfos } = props;
    const companys = useListCompany();
    const exchanges = useListExchange({ company_id: infos.company_id });

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card mb-4">
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên nhóm nhân viên' required />
                    <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã nhóm nhân viên' required type='code' />
                    <InputTextareaForm value={infos.desc} onChange={(e) => setInfos({ ...infos, desc: e.target.value })} />
                </div>
                <div className="col-12 lg:col-6">
                    <DropdownForm label='Công ty (*)' filter value={infos.company_id}
                        onChange={e => setInfos({ ...infos, company_id: e.target.value })} options={companys} disabled={infos.id} />
                    <DropdownForm label='Phòng ban (*)' filter value={infos.exchange_id} onChange={(e) => setInfos({ ...infos, exchange_id: e.target.value })}
                        options={infos.company_id ? exchanges : []} disabled={infos.id} />
                    <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                </div>
            </div>
        </div>
    )
};

export const ListUser = (props) => {
    const { data, setData, infos, setInfos, groupSaleInfo, users } = props;
    const [newUsersArr, setNewUsersArr] = useState([])
    const totalRecords = data ? data.length : '0';

    useEffect(() => {
        const newUsers = getArrId(users.filter(u => u.exchange_id === infos.exchange_id))
        if (groupSaleInfo && groupSaleInfo.user) {
            newUsers.concat(groupSaleInfo.user)
        }
        setNewUsersArr([ ...newUsers ])
    }, [infos.exchange_id, JSON.stringify(users), JSON.stringify(groupSaleInfo.user)])

    const actionBody = (e) => {
        const handleDelete = () => {
            setInfos({ ...infos, user: infos.user.filter(u => u !== e.user_id) });
            setData(data.filter(d => d !== e));
        };
        return (
            <Button type='button' icon="pi pi-trash" onClick={handleDelete} rounded outlined severity="danger" />
        )
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="grid formgrid">
                <h5 className="w-full ml-2">Danh sách nhân viên</h5>
                <div className="col-12 lg:col-6">
                    {(newUsersArr && newUsersArr[0] && users && users[0]) ? <MultiSelect className='w-full mb-4' value={infos.user} filter options={infos.exchange_id ? getSale(getUserByArrUserId(users, newUsersArr)) : []} optionValue='user_id'
                        onChange={(e) => { setInfos({ ...infos, user: e.target.value }); setData(getUserByArrUserId(users, e.target.value)) }} optionLabel="full_name" display="chip"
                        placeholder="Chọn nhân viên" /> : <MultiSelect className='w-full' placeholder="Chọn nhân viên" /> }
                </div>
            </div>
            <DataTable value={data} lazy
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginator first='0' rows='100' totalRecords={totalRecords}
                dataKey="user_id" selectionMode="checkbox" showGridlines
                emptyMessage="Không tìm thấy nhân viên." currentPageReportTemplate="Tổng số: {totalRecords} bản ghi">
                <Column field="user_id" header="Id" style={{ minWidth: '1rem', textAlign: 'center' }} />
                <Column field="full_name" header="Họ tên" style={{ minWidth: '12rem' }} />
                <Column field="code_staff" header="Mã nhân viên" style={{ minWidth: '12rem' }} />
                <Column field="username" header="Tài khoản" style={{ minWidth: '12rem' }} />
                <Column field="email" header="Email" style={{ minWidth: '12rem' }} />
                <Column field="phone" header="Số điện thoại" style={{ minWidth: '12rem' }} />
                <Column header="Action" body={actionBody} style={{ minWidth: '12rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    )
};

const UpdateGroupSale = () => {
    const { id } = useParams();
    const groupSaleInfo = useDetailGroupSale(id);
    const [data, setData] = useState([]);
    const users = useListUser();
    const [infos, setInfos] = useState({ name: '', code: '', status: true });

    useEffect(() => {
        let newGroupSaleInfo = { ...infos, ...groupSaleInfo };
        let newData = [];
        if (groupSaleInfo.user && groupSaleInfo.user.length > 0) {
            newData = getUserByArrUserId(users, groupSaleInfo.user)
        };
        setData(newData);
        setInfos({ ...newGroupSaleInfo, status: newGroupSaleInfo.status === 0 ? false : true });
    }, [groupSaleInfo, users]);

    const handleData = () => {
        if (!infos.company_id) {
            return "Vui lòng chọn công ty"
        }
        if (!infos.exchange_id) {
            return "Vui lòng chọn phòng ban"
        }
        let info = { ...infos, status: infos.status ? 1 : 0 }
        info = {
            ...removePropObject(info, groupSaleInfo), id: groupSaleInfo.id, user: info.user ? info.user : [],
            delete_user: groupSaleInfo.user ? groupSaleInfo.user.filter((element) => !infos.user.includes(element)) : [],
            add_user: groupSaleInfo.user ? infos.user.filter((element) => !groupSaleInfo.user.includes(element)) : []
        };
        return info;
    };

    return (
        <AddForm checkId={Number(id) || false} title='nhóm nhân viên' handleData={handleData}
            route={Number(id) ? '/group_sale/update' : '/group_sale/add'}
            actions={{ add: addGroupSale, update: updateGroupSale }}
            refreshObjects={[setInfos, setData]} >
            <InfoRequired infos={infos} setInfos={setInfos} />
            <ListUser groupSaleInfo={groupSaleInfo} users={users} data={data}
                setData={setData} infos={infos} setInfos={setInfos} />
        </AddForm>
    )
}

export default UpdateGroupSale;