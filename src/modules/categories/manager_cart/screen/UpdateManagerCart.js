import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { addCart, updateCart } from "../api";
import { useDetailCart } from "../util";
import { useListCompany } from "@/modules/companys/company/util";
import { formatTreeSelect, getArrIdFromTreeSelect, getSale } from "@/utils";
import { removePropObject } from "@/utils";
import { AddForm, DropdownForm, InputForm, InputSwitchForm, InputTextareaForm } from "@/components/AddForm";
import { classNames } from 'primereact/utils';
import { Button, MultiSelect } from '@/uiCore';
import { useListSale } from '@/modules/users/group_sale/util';
import { ListSaleByTree } from '@/modules/customers/campaign/screen/UpdateCampaign';
import { useListCategoryV2 } from '../../category/util';
import ImportProduct from '../../row_table/screen/ImportProduct';
import { Dialog } from 'primereact/dialog';
import { UploadImg } from '@/components/UploadImages';
import { useSelector } from 'react-redux';

export const MoreOptions = (props) => {
    const navigate = useNavigate();
    const { value } = props;
    const [visible, setVisible] = useState(false);
    const permissionTool = useSelector(state => state.permission).permissionTool;
    return (
        <Fragment>
            <Dialog header="Import bảng hàng" visible={visible} position='top' style={{ width: '50vw' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <ImportProduct />
            </Dialog>

            <div className="flex">
                {permissionTool.includes('/row_table/import') && <Button type='button' onClick={() => setVisible(true)} icon='pi pi-upload' label="Import chia rổ" className="ml-2" severity="warning" size="small" raised />}
                <Button onClick={() => navigate(`/row_table?category_id=${value.category_id}&cart_id=${value.id}&permission=${'quanlyrohang'}`)} type='button' label="Sản phẩm rổ hàng" className="ml-2" severity="info" size="small" raised />
            </div>
        </Fragment>
    )
};

export const convertArrIdToArrObj = (arr) => {
    let newArr = [];
    if (arr && arr[0]) {
        arr.forEach(a => {
            newArr.push({ user_id: a });
        });
    }
    return newArr;
};

const UpdateManagerCart = () => {
    const { id } = useParams();
    const cartInfo = useDetailCart(id);
    const [disabled, setDisabled] = useState(false);
    const [image, setImage] = useState(null);
    const [infos, setInfos] = useState({
        name: '', desc: '', time_hold: '', status: true
    });
    const [selectedNodeKeys, setSelectedNodeKeys] = useState([]);
    const companys = useListCompany();
    const users = getSale(useListSale({ company_id: infos.company_id }));
    const categories = useListCategoryV2({});

    useEffect(() => {
        if (Number(id)) {
            let newManagerId = [];
            if (cartInfo.user_id_manager && cartInfo.user_id_manager[0]) {
                cartInfo.user_id_manager.forEach(u => {
                    if (u.user_id) newManagerId.push(u.user_id);
                });
            };
            setInfos({ ...infos, ...cartInfo, user_id_manager: (newManagerId && newManagerId[0]) ? newManagerId : [], status: cartInfo.status === 0 ? false : true });
            if (cartInfo && cartInfo.user_id_sales) {
                let newSaleId = [];
                if (cartInfo.user_id_sales && cartInfo.user_id_sales[0]) {
                    cartInfo.user_id_sales.forEach(u => {
                        if (u.user_id) newSaleId.push(u.user_id);
                    });
                };
                if (newSaleId && newSaleId[0]) setSelectedNodeKeys(formatTreeSelect(newSaleId));
            };
            if (cartInfo.image)
                setImage({ ...image, preview: cartInfo.image })
            if (Number(id)) setDisabled((cartInfo.scope_type === 'quanlydohang'));
        };
    }, [cartInfo]);

    const handleSubmit = () => {
        let newManagerId = convertArrIdToArrObj(infos.user_id_manager);
        let newSaleId = convertArrIdToArrObj(getArrIdFromTreeSelect(selectedNodeKeys));
        if (!infos.company_id) {
            return "Vui lòng chọn công ty"
        }
        if (!infos.category_id) {
            return "Vui lòng chọn dự án"
        }
        if (infos.user_id_manager && !infos.user_id_manager[0]) {
            return "Vui lòng chọn người quản lý"
        }
        if (Number(id)) {
            if (JSON.stringify(newManagerId) === JSON.stringify(cartInfo.user_id_manager)) newManagerId = [];
            else {
                const foundElement = cartInfo.user_id_manager.filter(d => !newManagerId.some(n => n.user_id === d.user_id));
                if (foundElement && foundElement[0]) {
                    foundElement.forEach(f => {
                        newManagerId.push({ id: f.id, deleted_at: 1, user_id: f.user_id });
                    });
                };
                cartInfo.user_id_manager.forEach(d => {
                    newManagerId.forEach((n, index) => {
                        if (n.user_id === d.user_id) {
                            if (JSON.stringify(n) === JSON.stringify({ user_id: d.user_id })) newManagerId.splice(index, 1);
                            else {
                                newManagerId.splice(index, 1);
                                newManagerId.push({ ...removePropObject(n, d), id: d.id });
                            };
                        };
                    })
                })
            };

            if (JSON.stringify(newSaleId) === JSON.stringify(cartInfo.user_id_sales)) newSaleId = [];
            else {
                const foundElement = cartInfo.user_id_sales.filter(d => !newSaleId.some(n => n.user_id === d.user_id));
                if (foundElement && foundElement[0]) {
                    foundElement.forEach(f => {
                        newSaleId.push({ id: f.id, deleted_at: 1 });
                    });
                };
                cartInfo.user_id_sales.forEach(d => {
                    newSaleId.forEach((n, index) => {
                        if (n.user_id === d.user_id) {
                            if (JSON.stringify(n) === JSON.stringify({ user_id: d.user_id })) newSaleId.splice(index, 1);
                            else {
                                newSaleId.splice(index, 1);
                                newSaleId.push({ ...removePropObject(n, d), id: d.id });
                            };
                        };
                    })
                })
            };
        };

        let info = {
            ...removePropObject({
                ...infos, user_id_sales: newSaleId, status: infos.status ? 1 : 0,
                time_hold: infos.time_hold ? Number(infos.time_hold) : undefined, user_id_manager: newManagerId, image: image
            }, cartInfo), id: Number(id)
        };
        if (Number(id)) info.image = cartInfo.image ? (image ? (String(image.preview) === cartInfo.image ? undefined : image) : 'none') : (image ? image : undefined);
        return info
    };

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='rổ hàng dự án'
            route={Number(id) ? '/manager_cart/update' : '/manager_cart/add'}
            onSubmit={handleSubmit} moreOptions={{ scope_type: infos.scope_type, id: id, category_id: infos.category_id }}
            actions={{ add: addCart, update: updateCart }}
            refreshObjects={[setInfos, setSelectedNodeKeys, setImage]}>
            <h6>Thông tin rổ hàng</h6>
            <div className='card' style={{ backgroundColor: '#f8f9fa' }} >
                <InputForm disabled={disabled} id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên rổ hàng (*)' required />
                <DropdownForm disabled={disabled} label='Công ty (*)' value={infos.company_id} showClear={false}
                    onChange={(e) => setInfos({ ...infos, company_id: e.target.value })} options={companys} />
                <DropdownForm disabled={disabled} label='Dự án (*)' value={infos.category_id}
                    onChange={(e) => setInfos({ ...infos, category_id: e.target.value })}
                    options={infos.company_id ? categories : []} />
                <InputTextareaForm disabled={disabled} id='desc' value={infos.desc} label='Mô tả'
                    onChange={(e) => setInfos({ ...infos, desc: e.target.value })} />
                <div className="flex align-items-center mb-3">
                    <label className="block text-900 font-medium w-3 mr-2">Người quản lý rổ hàng (*)</label>
                    {(users && users[0]) ? <MultiSelect disabled={disabled} value={infos.user_id_manager} filter options={users}
                        onChange={(e) => setInfos({ ...infos, user_id_manager: e.target.value })}
                        optionLabel="full_name" optionValue="user_id"
                        placeholder="Chọn người quản lý rổ hàng (*)" className={classNames('w-9')} /> :
                        <MultiSelect disabled={disabled} options={[]} placeholder="Chọn người quản lý rổ hàng (*)" className={classNames('w-9')} />}
                </div>
            </div>
            <h6>Thiết lập rổ hàng</h6>
            <div className='card' style={{ backgroundColor: '#f8f9fa' }} >
                <div className='mb-4'><UploadImg image={image} setImage={setImage} title='Ảnh đại diện' /></div>
                <InputForm id='time_hold' value={infos.time_hold} type='number' label='Thời gian giữ chỗ / căn (phút)'
                    onChange={(e) => setInfos({ ...infos, time_hold: e.target.value })} />
                <ListSaleByTree selectedNodeKeys={selectedNodeKeys} setSelectedNodeKeys={setSelectedNodeKeys}
                    company_id={infos.company_id} title="Sale phụ trách bán" />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
};

export default UpdateManagerCart;
