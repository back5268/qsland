import { Button, TreeSelect, Column, DataTable } from "@/uiCore";
import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import { useListCompany } from "@/modules/companys/company/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListUser } from "@/modules/users/user/util";

import { useDetailPermissionGroup, useListPermissionToolCate, basePermissions } from "../util";
import { addPermissionGroup, updatePermissionGroup } from "../api";

import { formatTreeData, formatTreeSelect, getArrId, getArrIdFromTreeSelect, getSale, removePropObject } from "@/utils";

import { AddForm, InputForm, InputSwitchForm, InputTextareaForm } from "@/components/AddForm";
import { MultiSelect } from "@/components/MultiSelectx";
import { MultiSelect as MultiSelectz } from "primereact/multiselect";
import { useListGroupSaleV2 } from "@/modules/users/group_sale/util";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { Dialog } from "primereact/dialog";
import MultiSelectList from "@/components/MultiSelectList";

const renderTreeData = (array1, array2, array3) => {
    let newData1 = array1;
    let newData2 = array2;
    let newData3 = array3;
    newData2.forEach(a2 => {
        a2.children = [];
        newData3.forEach(a3 => {
            if (a2.id === a3.exchange_id) a2.children.push(a3);
            if (a3.scopes && a3.scopes[0]) a3.scopes = [];
        });
    });
    newData1.forEach(a1 => {
        a1.children = [];
        newData2.forEach(a2 => {
            if (a1.id === a2.company_id) a1.children.push(a2);
        });
    });
    return newData1;
};

const getPermissionArr = (array1, array2) => {
    array1 = array1 || [];
    array2 = array2 || [];
    array1.forEach(a1 => {
        a1.children = [];
        array2.forEach(a2 => {
            if (a2.actions) a2.children = JSON.parse(a2.actions);
            if (a1.id === a2.category_id) a1.children.push(a2);
        });
    });
    return array1;
};

const ListUser = (props) => {
    const { users, data, setData, id } = props;
    const companys = useListCompany();
    const exchanges = useListExchange();
    const saleTrees = formatTreeData(renderTreeData(companys, exchanges, getSale(users)));
    const groupSale = useListGroupSaleV2();
    const categories = useListCategoryV2();
    const companies = useListCompany();
    const [selectTree, setSelectTree] = useState([]);
    const [scopeType, setScopeType] = useState({});
    const [visible, setVisible] = useState([]);
    const totalRecords = data.length;

    useEffect(() => {
        setSelectTree(formatTreeSelect(getArrId(data)));
    }, [data]);

    useEffect(() => {
        let newObj = {};
        if (!Number(id)) {
            switch (id) {
                case 'quanlynhansu':
                case 'thukydonvi':
                case 'truongphong':
                case 'giamdocsan':
                    newObj.data = exchanges;
                    break;
                case 'truongnhom':
                    newObj.data = groupSale;
                    break;
                case 'dichvukhachhang':
                case 'ketoan':
                case 'dieuphoikinhdoanh':
                    newObj.data = categories;
                    break;
                case 'nguoidangtin':
                    newObj.data = companies;
                    break;
                default:
                    break;
            };
            setScopeType({ ...newObj });
        }
    }, [id, exchanges, groupSale, categories]);

    const onChange = (e) => {
        let idArr = getArrIdFromTreeSelect(e.value);
        const newData = data.filter(obj => idArr.includes(obj.id));

        idArr.forEach(id => {
            const isIdExist = newData.some(obj => obj.id === id);
            if (!isIdExist) {
                users.forEach(u => {
                    if (u.user_id === id) newData.push(u);
                });
            };
        });
        setData([...newData]);
    };

    const actionBody = (e) => {
        const handleDelete = () => {
            setData(data.filter(d => d !== e));
        };
        return (
            <Button type='button' icon="pi pi-trash" onClick={handleDelete} rounded outlined severity="danger" />
        )
    };

    const selectScope = (e) => {
        const handleChange = (value) => {
            const newData = data;
            newData.forEach(n => {
                if (n.user_id === e.user_id) {
                    n.scopes = (value.target && value.target.value) || value
                };
            });
            setData([...newData]);
        };

        return (
            <Fragment>
                <Dialog header="Phạm vi quản lý" visible={visible[e.id]} position='top' style={{ width: '60vw' }}
                    onHide={() => setVisible([])} draggable={false} resizable={false}>
                    {(categories && categories[0]) ? <MultiSelectList minHeight="400px" title="Chọn phạm vi quản lý" value={e.scopes} data={categories} setValue={e => handleChange(e)} optionLabel="name" /> :
                        <MultiSelectList minHeight="400px" title="Chọn phạm vi quản lý" data={[]} />}
                </Dialog>
                {(id === "dieuphoikinhdoanh" || id === "dichvukhachhang" || id === "ketoan") ?
                    <Button type='button' size="small" onClick={() => { let newVisible = visible; newVisible[e.id] = true; setVisible([...newVisible]) }} label="Phạm vi" className="w-full" />
                    : (scopeType.data && scopeType.data[0]) ? <MultiSelectz filter options={scopeType.data} optionLabel="name" optionValue="id" display="chip"
                        value={e.scopes} onChange={e => handleChange(e)} placeholder="Chọn phạm vi quản lý" className="w-full" /> : <MultiSelectz options={[]} placeholder="Chọn phạm vi quản lý" className="w-full" />}
            </Fragment>
        )
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="card">
            <div className="flex justify-items-between align-items-center mb-4">
                <h5 className="w-full" style={{ padding: '0', margin: '0' }}>Danh sách nhân viên</h5>
                <TreeSelect value={selectTree} filter onChange={onChange} options={saleTrees}
                    metaKeySelection={false} className="w-9" selectionMode="checkbox" display="chip"
                    placeholder="Chọn nhân viên" style={{ minHeight: '3rem' }} >
                </TreeSelect>
            </div>
            <DataTable value={data} lazy
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginator first='0' rows='100' totalRecords={totalRecords}
                dataKey="user_id" selectionMode="checkbox" showGridlines
                emptyMessage="Không tìm thấy nhân viên." currentPageReportTemplate="Tổng số: {totalRecords} bản ghi">
                <Column field="user_id" header="Id" style={{ minWidth: '1rem', textAlign: 'center' }} />
                <Column field="full_name" header="Họ tên" style={{ minWidth: '12rem' }} />
                <Column field="code_staff" header="Mã nhân viên" style={{ minWidth: '12rem' }} />
                <Column field="username" header="Tài khoản" style={{ minWidth: '12rem' }} />
                <Column field="email" header="Email" style={{ minWidth: '12rem' }} />
                {scopeType.data &&
                    <Column body={selectScope} header="Chọn phạm vi quản lý" style={{ minWidth: '24rem' }} />
                }
                <Column header="Action" body={actionBody} style={{ minWidth: '1rem', textAlign: "center" }} />
            </DataTable>
        </div>
    )
};

const handlePermissions = (permissionToolbar, permissionTool) => {
    let result = [];
    permissionTool = permissionTool || [];
    permissionTool.forEach(pt => {
        let newObject = {};
        newObject.permission = [];
        permissionToolbar.forEach(pb => {
            if (pt.name === pb.split(' - ')[0]) {
                newObject.tool_id = pt.id;
                newObject.permission.push({ action: pb.split(' - ')[1] })
            };
        })
        if (newObject.tool_id) result.push(newObject);
    })
    return result;
};

const UpdatePermission = () => {
    const [permissionDetail, setPermissionDetail] = useState({});
    const [infos, setInfos] = useState({ status: true, name: '', desc: '' });
    const [permissionToolbar, setPermissionToolbar] = useState([]);
    const [data, setData] = useState([]);

    let desc = '';
    let { id } = useParams();
    let staff_object_id = undefined;

    if (id && !Number(id)) {
        staff_object_id = id;
        basePermissions.forEach((b, index) => {
            if (b.id === staff_object_id) desc = b.name;
        })
    };

    const users = useListUser();
    const detailPermissionGroup = useDetailPermissionGroup({ staff_object_id, id: staff_object_id ? undefined : id });
    const permissionToolCate = useListPermissionToolCate();
    const permissionTool = permissionToolCate.permissionTool;
    const permissionToolCategory = permissionToolCate.permissionToolCategory;
    const permissionArr = getPermissionArr(permissionToolCategory, permissionTool);

    useEffect(() => {
        let newArr = [];
        if (detailPermissionGroup.permission_members) {
            detailPermissionGroup.permission_members.forEach((item) => {
                const existingItem = newArr.find((el) => el.user_id === item.user_id);
                if (existingItem) {
                    newArr.forEach(n => {
                        if (n.user_id === item.user_id) {
                            n.scopes.push(item.scope_id);
                        };
                    })
                } else {
                    newArr.push({ ...item, scopes: [item.scope_id] });
                }
            });
        };

        let newData = [];
        users.forEach(u => {
            const existingItem = newArr.find((el) => el.user_id === u.user_id);
            if (existingItem) {
                newData.push({ ...existingItem, ...u });
            };
        });

        let newDetailPermission = { ...detailPermissionGroup.permission };
        if (id || staff_object_id) {
            setInfos({ ...newDetailPermission, status: newDetailPermission.status === 0 ? false : true })
            setPermissionDetail({ ...newDetailPermission, status: newDetailPermission.status === 0 ? false : true })
            setData(newData);
        };
    }, [detailPermissionGroup, users]);

    useEffect(() => {
        let newPermissionTool = [];
        if (detailPermissionGroup.permission_tools) {
            detailPermissionGroup.permission_tools.forEach(p => {
                let permission = JSON.parse(p.permission);
                if (permissionTool) {
                    permissionTool.forEach(c => {
                        let title = '';
                        if (c.id === p.tool_id) title = c.name;
                        permission.forEach(p => {
                            if (title && p.action) newPermissionTool.push(title + ' - ' + p.action);
                        })
                    });
                }
            })
        };
        setPermissionToolbar(newPermissionTool);
    }, [detailPermissionGroup.permission_tools, permissionTool]);

    const handleData = () => {
        let newTools = [];
        let scope_type = undefined;
        if (id && !Number(id)) {
            switch (id) {
                case "truongnhom":
                    scope_type = "group";
                    break;
                case "quanlynhansu":
                case "truongphong":
                case "giamdocsan":
                case "thukydonvi":
                    scope_type = "department";
                    break;
                case "dichvukhachhang":
                    scope_type = "category";
                    break;
                case "ketoan":
                    scope_type = "category";
                    break;
                case "dieuphoikinhdoanh":
                    scope_type = "category";
                    break;
                case "nguoidangtin":
                    scope_type = "company";
                    break;
                default:
                    break;
            }
        }
        handlePermissions(permissionToolbar, permissionTool).forEach(n => {
            newTools.push(n);
        });
        if (detailPermissionGroup.permission_tools) {
            const foundElement = detailPermissionGroup.permission_tools.filter(d => !newTools.some(n => n.tool_id === d.tool_id));
            if (foundElement && foundElement[0]) {
                foundElement.forEach(f => {
                    newTools.push({ id: f.id, tool_id: f.tool_id, deleted_at: 1 });
                });
            };

            detailPermissionGroup.permission_tools.forEach(d => {
                newTools.forEach((n, index) => {
                    if (n.tool_id === d.tool_id) {
                        if (d.permission === JSON.stringify(n.permission)) {
                            newTools.splice(index, 1);
                        } else {
                            n.id = d.id;
                        }
                    };
                });
            });
        };

        let info = {
            ...infos, status: infos.status ? 1 : 0, tools: newTools, is_master: 0,
        };
        let newData = data;
        let newGroup_members = [];
        if (newData && newData[0]) {
            newData.forEach(d => {
                if (d.user_id) {
                    if (d.scopes && d.scopes[0]) {
                        d.scopes.forEach(s => {
                            newGroup_members.push({ user_id: d.user_id, scope_type: scope_type, scope_id: s });
                        })
                    } else {
                        newGroup_members.push({ user_id: d.user_id, scope_type: null, scope_id: null });
                    }
                }
            });
        };

        if (detailPermissionGroup.permission_members) {
            if (Number(id)) {
                const foundElement = detailPermissionGroup.permission_members.filter(d => !newGroup_members.some(n => n.user_id === d.user_id));
                if (foundElement && foundElement[0]) {
                    foundElement.forEach(f => {
                        newGroup_members.push({ id: f.id, deleted_at: 1 });
                    });
                };
            } else {
                const foundElement = detailPermissionGroup.permission_members.filter(d => !newGroup_members.some(n => (n.user_id === d.user_id && n.scope_id === d.scope_id)));
                if (foundElement && foundElement[0]) {
                    foundElement.forEach(f => {
                        newGroup_members.push({ id: f.id, deleted_at: 1 });
                    });
                };
            }
            detailPermissionGroup.permission_members.forEach(d => {
                newGroup_members.forEach((n, index) => {
                    if (JSON.stringify({ user_id: d.user_id, scope_type: scope_type, scope_id: d.scope_id }) === JSON.stringify(n)
                        || JSON.stringify({ user_id: d.user_id }) === JSON.stringify(n)) {
                        newGroup_members.splice(index, 1);
                    }
                });
            });
        };
        info = { ...removePropObject(info, permissionDetail) }
        info = { ...info, group_members: newGroup_members, id: staff_object_id ? undefined : id, staff_object_id: staff_object_id || undefined };
        return info;
    };

    return (
        <AddForm checkId={infos.id || staff_object_id} title='nhóm quyền' handleData={handleData}
            route={Number(id) ? '/permission/update' : '/permission/add'}
            actions={{ add: addPermissionGroup, update: updatePermissionGroup }}
            refreshObjects={[setInfos, setPermissionToolbar]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <div className="grid formgrid">
                    <div className="col-12 lg:col-6">
                        <InputForm id='name' value={staff_object_id ? desc : infos.name} disabled={staff_object_id}
                            onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên nhóm quyền (*)' required />
                        <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                    </div>
                    <div className="col-12 lg:col-6">
                        <InputTextareaForm id='desc' label='Mô tả' disabled={staff_object_id} value={staff_object_id ? desc : infos.desc}
                            onChange={(e) => setInfos({ ...infos, desc: e.target.value })} />
                    </div>
                </div>
            </div>
            <ListUser id={id} users={users} data={data} setData={setData} />
            <div className="flex justify-content-center mb-4">
                <MultiSelect tree={permissionArr} permissionToolbar={permissionToolbar} setPermissionToolbar={setPermissionToolbar} />
            </div>
        </AddForm>
    )
};

export default UpdatePermission;
