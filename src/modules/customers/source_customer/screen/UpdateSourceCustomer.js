import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDetailSource } from "../util";
import { updateSource, addSource } from "../api";
import { removePropObject } from "@/utils";
import { AddForm, InputForm, InputSwitchForm } from '@/components/AddForm';

const UpdateSourceCustomer = () => {
    const { id } = useParams();
    const sourceInfo = useDetailSource(id);
    const [infos, setInfos] = useState({ name: '', code: '', status: true });

    useEffect(() => {
        let newSourceInfo = { ...infos, ...sourceInfo, status: sourceInfo.status === 0 ? false : true };
        setInfos(newSourceInfo);
    }, [sourceInfo]);

    const handleData = () => {
        let info = { ...infos, status: infos.status ? 1 : 0 };
        info = { ...removePropObject(info, sourceInfo), id: sourceInfo.id }
        return info
    }

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='nguồn khách hàng'
            handleData={handleData} route={Number(id) ? '/source_customer/update' : '/source_customer/add'}
            actions={{ add: addSource, update: updateSource }}
            refreshObjects={[setInfos]} >
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên nguồn khách hàng (*)' required />
                <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã nguồn khách hàng (*)' required type='code' />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
};

export default UpdateSourceCustomer;
