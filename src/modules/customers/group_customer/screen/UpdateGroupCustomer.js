import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDetailGroupCustomer } from "../util";
import { updateGroupCustomer, addGroupCustomer } from "../api";
import { removePropObject } from "@/utils";
import { InputForm, InputSwitchForm, AddForm } from "@/components/AddForm";

const AddGroupCustomer = () => {
    const { id } = useParams();
    const groupCustomerInfo = useDetailGroupCustomer(id);
    const [infos, setInfos] = useState({ name: '', code: '', status: true });

    useEffect(() => {
        let newgroupCustomerInfo = { ...infos, ...groupCustomerInfo, status: groupCustomerInfo.status === 0 ? false : true };
        setInfos(newgroupCustomerInfo);
    }, [groupCustomerInfo]);

    const handleData = () => {
        let info = { ...infos, status: infos.status ? 1 : 0 };
        info = { ...removePropObject(info, groupCustomerInfo), id: groupCustomerInfo.id }
        return info
    }

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='nhóm khách hàng'
            handleData={handleData} route={Number(id) ? '/group_customer/update' : '/group_customer/add'}
            actions={{ add: addGroupCustomer, update: updateGroupCustomer }}
            refreshObjects={[setInfos]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên nhóm khách hàng (*)' required />
                <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã nhóm khách hàng (*)' required type='code' />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
};

export default AddGroupCustomer;
