import { Link } from 'react-router-dom';
import React, { forwardRef, useState, Fragment } from 'react';
import { Dialog } from '@/uiCore';
import {useDispatch, useSelector} from 'react-redux'
import { showToast } from '@/redux/features/toast';
import { listToast } from '@/utils';
import { DetailUser } from '@/modules/users';
import {clearUserInfo} from "@/redux/features/userInfo";

const AppTopbar = forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const userInfo = useSelector((state) => state.userInfo)

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(clearUserInfo())
        dispatch(showToast({ ...listToast[0], detail: 'Đăng xuất thàng công!' }));
    };

    return (
        <Fragment>
            <Dialog header="Thông tin người dùng" visible={visible} position='top' style={{ width: '75vw' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <DetailUser user_id={userInfo && userInfo.user_id} />
            </Dialog>
            <div className="layout-topbar">
                <Link to="/" className="layout-topbar-logo">
                    <img src='/assets/img/logo.png' widt={'true'} alt="logo" />
                    <span>QS Land</span>
                </Link>

                <button type="button" className="p-link layout-menu-button layout-topbar-button" onClick={props.onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>

                <div className="layout-topbar-menu">
                    <span>{userInfo && userInfo.full_name}</span>
                    <div className="p-link layout-topbar-button">
                        {userInfo && userInfo.avatar && userInfo.avatar[3] && <img src={JSON.parse(userInfo.avatar)} alt="Ảnh đại diện" height='40px' width='40px' style={{ backgroundColor: '#2196F3', borderRadius: '50%' }} />}
                        {userInfo && userInfo.avatar && !userInfo.avatar[3] && <img src='/assets/img/avatarIcon.jpg' alt="Ảnh đại diện" height='40px' width='40px' style={{ backgroundColor: '#2196F3', borderRadius: '50%' }} />}
                        <div className='menu-topbar'>
                            <div onClick={() => setVisible(true)} className="p-link">
                                {userInfo && userInfo.username}
                            </div>
                            <Link to='/auth/changepassword'>
                                <div className="p-link" >
                                    Change password
                                </div>
                            </Link>
                            <div className="p-link flex align-items-center gap-4" onClick={handleLogout}>
                                <i className='pi pi-sign-out' style={{ fontSize: '16px' }} /> Logout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
});

export default AppTopbar;
