import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyAccountAPI } from '@/modules/auth/api';
import { showToast } from '@/redux/features/toast';
import { useDispatch } from 'react-redux';

import { FormAuth, FormInput } from '../components';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = localStorage.getItem('emailReset');
    const [loading, setLoading] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');

    async function fetchData() {
        const token = localStorage.getItem('tokenReset');
        const response = await verifyAccountAPI({ email: email, token: token, code: verifyCode });
        if (response) setLoading(false);
        if (response.data.status) {
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Successfully',
                    detail: 'Nhập mã xác nhận thành công!',
                })
            );
            navigate('/auth/setpassword')
        } else {
            dispatch(
                showToast({
                    severity: 'error',
                    summary: 'Failed',
                    detail: response.data.mess,
                })
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchData();
    };

    return (
        <FormAuth title='Verify Account' subtitle='Go back' handleSubmit={handleSubmit}
            linkSubtitle='/auth/forgotpassword' loading={loading} disabled={!verifyCode}>

            <FormInput id='email' label='Email address' disabled value={email} />

            <FormInput id='verifyCode' label='Verify code' value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)} />

        </FormAuth>
    );
};

export default VerifyAccount;