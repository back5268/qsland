import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPasswordAPI } from '@/modules/auth/api';
import { showToast } from '@/redux/features/toast';
import { useDispatch } from 'react-redux';

import { FormAuth, FormInput } from '../components';

const SetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = localStorage.getItem('emailReset');
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    async function fetchData() {
        const token = localStorage.getItem('tokenReset');
        const response = await setPasswordAPI({ email: email, token: token, pword: newPassword });
        if (response) setLoading(false);
        if (response.data.status) {
            localStorage.removeItem('tokenReset');
            localStorage.removeItem('emailReset');
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Đổi mật khẩu thành công!',
                })
            );
            navigate('/auth/login');
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
        <FormAuth title='Đặt mật khẩu mới' subtitle='Go back' handleSubmit={handleSubmit}
            linkSubtitle='/auth/forgotpassword' loading={loading} disabled={!newPassword}>

            <FormInput id='email' label='Email address' disabled value={email} />

            <FormInput id='newPassword' label='New password' value={newPassword} type='password'
                onChange={e => setNewPassword(e.target.value)} />

        </FormAuth>
    );
};

export default SetPassword;