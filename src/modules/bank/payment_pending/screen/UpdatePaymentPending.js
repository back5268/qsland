// import { useState, useEffect, Fragment } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { showToast } from '@/redux/features/toast';
// import { classNames } from 'primereact/utils';

// import { branches, pttts, useDetailBank } from "../util";
// import { updateBank, addBank } from "../api";

// import { DropdownForm, InputForm, InputSwitchForm, AddForm } from "@/components/AddForm";
// import { listToast, scrollToTop, removePropObject, refreshObject } from "@/utils";

const UpdatePaymentPending = () => {
    // const { id } = useParams();
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const bank = useDetailBank(id);
    // const [loading, setLoading] = useState(false);
    // const [error1, setError1] = useState(false);
    // const [banks, setBanks] = useState([]);
    // const [bankInfo, setBankInfo] = useState({});
    // const [infos, setInfos] = useState({
    //     account_holder: '', bank_number: '', status: true
    // });

    // useEffect(() => {
    //     fetch('https://api.vietqr.io/v2/banks')
    //         .then(response => response.json())
    //         .then(data => {
    //             setBanks(data.data);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // }, []);

    // useEffect(() => {
    //     if (infos.short_name) {
    //         banks.forEach(b => {
    //             if (infos.short_name === b.short_name) {
    //                 setBankInfo({ name: b.name, logo: b.logo });
    //             };
    //         });
    //     }
    // }, [infos.short_name]);

    // useEffect(() => {
    //     if (Number(id)) setInfos({ ...infos, ...bank, status: bank.status === 0 ? false : true });
    // }, [bank]);

    // async function fetchDataSubmit(info) {
    //     if (Number(id)) {
    //         const response = await updateBank(info);
    //         if (response) setLoading(false);
    //         if (response.data.status) {
    //             navigate('/payment_info');
    //             dispatch(showToast({ ...listToast[0], detail: 'Cập nhật ngân hàng thành công!' }));
    //         } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    //     } else {
    //         const response = await addBank(info);
    //         if (response) setLoading(false);
    //         if (response.data.status) {
    //             scrollToTop();
    //             setInfos({ ...refreshObject(infos), status: true })
    //             dispatch(showToast({ ...listToast[0], detail: 'Thêm ngân hàng thành công!' }));
    //         } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    //     }
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     let info = { ...infos, status: infos.status ? 1 : 0 }
    //     if (Number(id)) {
    //         info = {
    //             ...removePropObject(info, bank), id: Number(id),
    //         };
    //     };
    //     setLoading(true);
    //     fetchDataSubmit(info);
    // };


    return (
        // <AddForm className='w-8' style={{ margin: '0 auto' }} checkId={Number(id)} title='ngân hàng'
        //     loading={loading} onSubmit={handleSubmit} route={Number(id) ? '/payment_info/update' : '/payment_info/add'}>
        //     <div style={{ backgroundColor: '#f8f9fa' }} className="card">
        //         <DropdownForm label='Ngân hàng (*)' value={infos.short_name} optionLabel="shortName" optionValue="shortName"
        //             onChange={(e) => (setInfos({ ...infos, short_name: e.target.value }), setError1(false))}
        //             options={banks} className={classNames({ 'p-invalid': error1 })} showClear={false} />

        //         <div className='grid formgrid mb-3'>
        //             <div className='col-12 lg:col-3'></div>
        //             <div className='col-12 lg:col-9'>
        //                 <div className='card' style={{ minHeight: '280px' }}>
        //                     {infos.short_name && <Fragment >
        //                         <label className="block text-900 font-medium mr-2">Tên ngân hàng: <i>{bankInfo.name}</i> </label>
        //                         <img src={bankInfo.logo} style={{ maxHeight: '200px' }}></img></Fragment>}
        //                 </div>
        //             </div>
        //         </div>

        //         <InputForm id='account_holder' value={infos.account_holder}
        //             onChange={(e) => setInfos({ ...infos, account_holder: e.target.value })} label='Chủ tài khoản (*)' required />
        //         <InputForm id='bank_number' value={infos.bank_number}
        //             onChange={(e) => setInfos({ ...infos, bank_number: e.target.value })} label='Số tài khoản (*)' type="number" required />
        //         <DropdownForm label='Phương thức thanh toán (*)' value={infos.type_payment} showClear={false}
        //             onChange={(e) => (setInfos({ ...infos, type_payment: e.target.value }), setError1(false))}
        //             options={pttts} className={classNames({ 'p-invalid': error1 })} />
        //         <InputForm id='branch' value={infos.branch}
        //             onChange={(e) => setInfos({ ...infos, branch: e.target.value })} label='Chi nhánh (*)' required />
        //         <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
        //     </div>
        // </AddForm>
        <div></div>
    )
}

export default UpdatePaymentPending;
