import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordAPI } from '@/modules/auth/api';
import { showToast } from '@/redux/features/toast';
import { useDispatch } from 'react-redux';

import { FormAuth, FormInput } from '../components';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    
    async function fetchData(param) {
        const response = await forgotPasswordAPI(param);
        if (response) setLoading(false);
        if (response.data.status) {
            localStorage.setItem('emailReset', response.data.data.email);
            localStorage.setItem('tokenReset', response.data.data.token);
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Mã xác nhận đã được gửi đến email ' + response.data.data.email,
                })
            );
            navigate('/auth/verifyaccount');
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
        let param = { username: email};
        if (/^([a-zA-Z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(email)) param = { email: email}
        setLoading(true);
        fetchData(param);
    };

    return (
        <FormAuth title='Forgot Password' subtitle='Back to login' handleSubmit={handleSubmit}
            linkSubtitle='/auth/login' loading={loading} disabled={!email} >

            <FormInput id='username' label='Email hoặc username' value={email}
                onChange={e => setEmail(e.target.value)} />

        </FormAuth>
    );
};

export default ForgotPassword;