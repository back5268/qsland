import {Fragment, useEffect} from "react";
import {useDispatch} from 'react-redux'
import {useNavigate} from "react-router-dom";
import {ProgressBar} from 'primereact/progressbar';
import {getData} from "@/lib/request";
import {setRoles} from "@/redux/features/role";
import {setPermission} from "@/redux/features/permission";
import {ToggleLoading} from "@/redux/features/loading";
import {setUserInfo} from "@/redux/features/userInfo";

const Loading = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    async function fetchData() {
        const getAuth = await getData('web/auth/get');
        if (getAuth.data.status) {
            const userInfo = getAuth.data.data;
            const roles = getAuth.data.rest.permission;
            dispatch(setRoles(roles));
            dispatch(setUserInfo(userInfo));
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
            localStorage.clear('token')
        }
        const getPermission = await getData('web/permission_tool_category/getListPermissionToolCateBy');
        if (getPermission.data.status) {
            let permission = getPermission.data.data;
            let permissionCate = permission.permission_cate;
            let permissionTool = ['/'];
            if (permissionCate) {
                permissionCate.sort((a, b) => a.sort - b.sort);
                permissionCate.forEach(item => {
                    if (item.items && item.items[0] && item.items[0].route === '/') {
                        item.route = '/';
                        item.items = undefined;
                    }
                    ;
                });
            }
            if (permission.permissions_tool) {
                permission.permissions_tool.forEach(item => {
                    if (item.permission) {
                        JSON.parse(item.permission).forEach(p => {
                            let route = '';
                            if (p.action) route = item.route + '/' + p.action;
                            if (p.action === 'view') route = item.route;
                            permissionTool.push(route);
                        })
                    }
                })
            }
            dispatch(setPermission({permissionTool: permissionTool, permissionCate: permissionCate}));
            dispatch(ToggleLoading(false))
        }
        ;
    };

    useEffect(() => {
        const token = localStorage.getItem('token')
        const clientId = localStorage.getItem('clientId')
        if (!token || !clientId) {
            dispatch(ToggleLoading(false))
            navigate('/auth/login')
        } else fetchData()
    }, [])

    return (
        <Fragment>
            <Fragment>
                <ProgressBar mode="indeterminate" style={{height: '4px', zIndex: '1001'}}></ProgressBar>
                <div style={{
                    backgroundColor: '#eff3f8', display: 'block', position: 'fixed',
                    top: '0', left: '0', height: '100%', width: '100%', zIndex: '1000'
                }}></div>
            </Fragment>
            {props.children}
        </Fragment>
    )
};

export default Loading;