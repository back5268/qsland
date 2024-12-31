import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDetailRevenueCode } from "../util";
import { updateRevenueCode, addRevenueCode } from "../api";
import { removePropObject } from "@/utils";
import { InputForm, InputSwitchForm, AddForm } from "@/components/AddForm";

const UpdateRevenueCode = () => {
    const { id } = useParams();
    const revenueCodeInfo = useDetailRevenueCode(id);
    const [infos, setInfos] = useState({ name: '', code: '', status: true });

    useEffect(() => {
        let newRevenueCodeInfo = { ...infos, ...revenueCodeInfo, status: revenueCodeInfo.status === 0 ? false : true };
        setInfos(newRevenueCodeInfo);
    }, [revenueCodeInfo]);

    const handleData = () => {
        let info = { ...infos, status: infos.status ? 1 : 0 };
        info = { ...removePropObject(info, revenueCodeInfo), id: revenueCodeInfo.id }
        return info
    };

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='mã doanh thu' handleData={handleData}
            route={Number(id) ? '/revenue_code/update' : '/revenue_code/add'}
            actions={{ add: addRevenueCode, update: updateRevenueCode }}
            refreshObjects={[setInfos]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên mã doanh thu (*)' required />
                <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã mã doanh thu (*)' required type='code' />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
};

export default UpdateRevenueCode;
