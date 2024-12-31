import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addInvestor, updateInvestor } from '../api';

import { removePropObject } from "@/utils";
import { InputForm, AddForm, InputSwitchForm } from "@/components/AddForm";
import { useDetailInvestor } from '../util';

const UpdateInvestor = () => {
    const { id } = useParams();
    const investorInfo = useDetailInvestor(id);
    const [infos, setInfos] = useState({ name: '', code: '', status: true });

    useEffect(() => {
        setInfos({ ...infos, ...investorInfo, status: investorInfo.status === 0 ? false : true });
    }, [investorInfo]);

    const handleData = () => {
        let info = { ...infos, status: infos.status ? 1 : 0 }
        if (id) info = { ...removePropObject(info, investorInfo), id: id }
        return info
    };

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='chủ đầu tư' handleData={handleData}
            route={Number(id) ? '/investor/update' : '/investor/add'}
            actions={{ add: addInvestor, update: updateInvestor }}
            refreshObjects={[setInfos]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên chủ đầu tư (*)' required />
                <InputForm id='code' value={infos.code} onChange={(e) => setInfos({ ...infos, code: e.target.value })} label='Mã chủ đầu tư (*)' required type='code' />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
};

export default UpdateInvestor;
