import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePasswordAPI } from '@/modules/auth/api';
import { showToast } from '@/redux/features/toast';
import { useDispatch } from 'react-redux';

import { FormAuth, FormInput } from '../components';

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        password: '',
    });

    async function fetchData() {
        const response = await changePasswordAPI(passwords);
        if (response) setLoading(false);
        if (response.data.status) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data.mess,
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
        <FormAuth title='Đổi mật khẩu' subtitle='Go to Dashboard' handleSubmit={handleSubmit}
            linkSubtitle='/' loading={loading} disbled={!passwords.password || !passwords.oldPassword}>

            <FormInput id='oldPassword' label='Mật khẩu cũ' value={passwords.oldPassword} type='password'
                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })} />

            <FormInput id='newPassword' label='Mật khẩu mới' value={passwords.password} type='password'
                onChange={e => setPasswords({ ...passwords, password: e.target.value })} />

        </FormAuth>
    );
};

export default ChangePassword;