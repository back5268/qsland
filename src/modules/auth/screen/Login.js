import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '@/modules/auth/api';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { FormAuth, FormInput } from '../components';
import {setUserInfo} from "@/redux/features/userInfo";
import {ToggleLoading} from "@/redux/features/loading";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    async function fetchData() {
        // await new Promise((resolve, reject) => setTimeout(() => {resolve()},5000))
        const response = await loginAPI(user);
        if (response) setLoading(false);
        if (response.data.status) {
            const token = response.data.data.token;
            localStorage.setItem('token', token)
            dispatch(ToggleLoading(true));
            dispatch(
                showToast({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Đăng nhập thành công!',
                })
            );
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
        <FormAuth title='Welcome' subtitle='Sign in to continue' handleSubmit={handleSubmit} lableSubmit='Sign in'
            titleFooter='Forgot password' linkTitleFooter='/auth/forgotpassword' disabled={!user.username || !user.password} loading={loading}>

            <FormInput id='username' label='Username' value={user.username}
                onChange={e => setUser({ ...user, username: e.target.value })} />

            <FormInput id='password' label='Password' type='password' value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })} />

        </FormAuth>
    );
};

export default Login;
