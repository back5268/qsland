import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { useDetailBank } from "../util";
import { updateBank, addBank } from "../api";

import { DropdownForm, InputForm, InputSwitchForm, AddForm } from "@/components/AddForm";
import { removePropObject } from "@/utils";

const UpdateBank = () => {
    const { id } = useParams();
    const bank = useDetailBank(id);
    const [banks, setBanks] = useState([]);
    const [bankInfo, setBankInfo] = useState({});
    const [infos, setInfos] = useState({
        account_holder: '', bank_number: '', status: true
    });

    useEffect(() => {
        fetch('https://api.vietqr.io/v2/banks')
            .then(response => response.json())
            .then(data => {
                setBanks(data.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    useEffect(() => {
        if (infos.short_name) {
            banks.forEach(b => {
                if (infos.short_name === b.short_name) {
                    setBankInfo({ name: b.name, logo: b.logo });
                };
            });
        }
    }, [infos.short_name]);

    useEffect(() => {
        if (Number(id)) setInfos({ ...infos, ...bank, status: bank.status === 0 ? false : true });
    }, [bank])

    const handleData = () => {
        let info = { ...infos, status: infos.status ? 1 : 0 }
        if (Number(id)) {
            info = {
                ...removePropObject(info, bank), id: Number(id),
            };
        }
        return info
    };


    return (
        <AddForm className='w-8' style={{ margin: '0 auto' }} checkId={Number(id)} title='ngân hàng'
            handleData={handleData} route={Number(id) ? '/payment_info/update' : '/payment_info/add'}
            actions={{ add: addBank, update: updateBank }}
            refreshObjects={[setInfos]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <DropdownForm label='Ngân hàng (*)' value={infos.short_name} optionLabel="shortName" optionValue="shortName"
                    onChange={(e) => setInfos({ ...infos, short_name: e.target.value })}
                    options={banks} showClear={false} />

                <div className='grid formgrid mb-3'>
                    <div className='col-12 lg:col-3'></div>
                    <div className='col-12 lg:col-9'>
                        <div className='card' style={{ minHeight: '280px' }}>
                            {infos.short_name && <Fragment >
                                <label className="block text-900 font-medium mr-2">Tên ngân hàng: <i>{bankInfo.name}</i> </label>
                                <img src={bankInfo.logo} style={{ maxHeight: '200px' }}></img></Fragment>}
                        </div>
                    </div>
                </div>

                <InputForm id='account_holder' value={infos.account_holder}
                    onChange={(e) => setInfos({ ...infos, account_holder: e.target.value })} label='Chủ tài khoản (*)' required />
                <InputForm id='bank_number' value={infos.bank_number}
                    onChange={(e) => setInfos({ ...infos, bank_number: e.target.value })} label='Số tài khoản (*)' type="number" required />
                <InputForm id='branch' value={infos.branch}
                    onChange={(e) => setInfos({ ...infos, branch: e.target.value })} label='Chi nhánh (*)' required />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
}

export default UpdateBank;
