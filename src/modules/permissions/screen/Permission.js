import {InputSwitch} from "@/uiCore";
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {listToast} from "@/utils";
import {showToast} from "@/redux/features/toast";
import {confirmDialog} from "primereact/confirmdialog";
import {GridForm, Dropdownz} from "@/components/ListForm";
import {RenderHeader, TimeBody, Columnz, DataTablez, useGetParams} from "@/components/DataTable";
import {useListPermissionGroup, useCountPermissionGroup, basePermissions} from "../util";
import {updatePermissionGroup, deletePermissionGroup} from "../api";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import {useListUserV2} from "@/modules/users/user/util";

const Header = ({paramsPaginator, setParamsPaginator}) => {
    const [filter, setFilter] = useState({});
    const users = useListUserV2();

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
                  filter={filter} setFilter={setFilter} className="lg:col-9">
            <Dropdownz value={filter.user_id} options={users} placeholder="Chọn nhân viên"
                       onChange={(e) => setFilter({...filter, user_id: e.target.value})}/>
        </GridForm>
    )
};

const Permission = () => {
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(null);
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const permissions = useListPermissionGroup({...paramsPaginator, first: undefined});
    const countData = useCountPermissionGroup({...paramsPaginator, first: undefined});

    useEffect(() => {
        if (permissions && permissions.permissions) {
            if (permissions.basePermissions === 'all') {
                setData([...basePermissions, ...permissions.permissions])
                setTotalRecords(permissions.permissions.length + basePermissions.length)
            } else if (Array.isArray(permissions.basePermissions)) {
                const newPermissions = basePermissions.filter(b => permissions.basePermissions.includes(b.id))
                setData([...newPermissions, ...permissions.permissions ])
                setTotalRecords(permissions.permissions.length + newPermissions.length)
            }
        }
    }, [permissions, countData])

    const StatusBody = (rowData, actions) => {
        const dispatch = useDispatch();
        const permissionTool = useSelector(state => state.permission).permissionTool;

        const accept = () => {
            actions.action({id: rowData.id, status: checked ? 0 : 1});
            setChecked(!checked);
            dispatch(showToast({...listToast[0], detail: 'Đổi trạng thái thành công!'}));
        };

        const confirm = () => {
            confirmDialog({
                message: 'Bạn có muốn tiếp tục thay đổi trạng thái?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            });
        };

        const [checked, setChecked] = useState(rowData.status ? true : false);
        return <InputSwitch disabled={!Number(rowData.id) || rowData.is_master === 1}
                            checked={checked} onChange={permissionTool.includes(actions.route) ? confirm : () => {
        }}/>
    };

    const ActionBody = (rowData, editRoute, actions) => {
        const permissionTool = useSelector(state => state.permission).permissionTool;
        const dispatch = useDispatch();

        async function accept() {
            const res = await actions.action({id: rowData.id});
            if (res.data.status) {
                dispatch(showToast({...listToast[0], detail: 'Xóa dữ liệu thành công!'}));
                if (paramsPaginator && setParamsPaginator) {
                    setParamsPaginator({...paramsPaginator, render: !paramsPaginator});
                }
            }
        }
        const confirm = () => {
            confirmDialog({
                message: 'Bạn có muốn tiếp tục xóa?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            });
        };

        return (
            <React.Fragment>
                {editRoute && permissionTool.includes(editRoute) && <Link to={editRoute + '/' + rowData.id}>
                    <Button icon="pi pi-eye" rounded outlined className="mr-2"/>
                </Link>}
                {actions && permissionTool.includes(actions.route) && !(!Number(rowData.id) || rowData.is_master === 1)
                    && <Button type='button' icon="pi pi-trash" onClick={actions.options ? actions.options : confirm}
                               rounded outlined severity="danger"/>}
            </React.Fragment>
        );
    };

    const rowClassName = (e) => (!Number(e.id) || e.is_master === 1) ? 'base-permissions' : '';
    const header = RenderHeader({title: 'Danh sách nhóm quyền', add: '/permission/add'});
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}/>
            <DataTablez value={data} header={header} title="nhóm quyền" totalRecords={totalRecords}
                       paramsPaginator={paramsPaginator} rowClassName={rowClassName}
                       setParamsPaginator={setParamsPaginator}>
                <Columnz field="name" header="Tên nhóm quyền"/>
                <Columnz field="desc" header="Mô tả"/>
                <Columnz header="Ngày khởi tạo" body={e => TimeBody(e.created_at)} bodyStyle={{textAlign: 'center'}}/>
                <Columnz field="status" header="Hiển thị" body={e => StatusBody(e,
                    {route: '/permission/update', action: updatePermissionGroup})} bodyStyle={{textAlign: 'center'}}/>
                <Columnz header="Actions" body={(e) => ActionBody(e, '/permission/detail',
                    {route: '/permission/delete', action: deletePermissionGroup},
                    paramsPaginator, setParamsPaginator)} bodyStyle={{textAlign: 'center'}}/>
            </DataTablez>
        </div>
    )
}

export default Permission;