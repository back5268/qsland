import { useState, useEffect, Fragment, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { formatNumber, statusBDS, useDetailAssembleProduct, useDetailProduct, useListAssembleProduct, useListCustomerByBill } from '../util';
import { removePropObject } from "@/utils";
import { listToast } from "@/utils";
import { AddForm, InputForm, DropdownForm, InputTextareaForm, InputNumber, InputSwitchForm } from "@/components/AddForm";
import { showToast } from '@/redux/features/toast';
import { Button } from 'primereact/button';
import { GD } from '../../category/util';
import { assembleProduct, updateAssembleProduct, updateProduct } from '../api';
import { useListUserV2 } from '@/modules/users/user/util';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useListCart } from '../../manager_cart/util';
import { useSelector } from 'react-redux';
import { useDetailCategory } from '../../building/util';
import BillByProduct from './BillByProduct';

const DropdownFormz = (props) => {
    const { label, optionLabel, optionValue, placeholder, className, ...inputprop } = props;
    return (
        <div className="w-full flex align-items-center mb-3">
            <label className="block text-900 font-medium w-3 mr-2">{label}</label>
            <Dropdown filter className={classNames("w-full", className)}
                optionLabel={optionLabel ? optionLabel : 'name'} optionValue="id"
                placeholder={placeholder || `Chọn ${label.toLowerCase()}`} {...inputprop} />
        </div>
    )
};

const Prioritize = (props) => {
    const { index, handleDelete, productInfo, idz, disabled, handleSetData, value, checkAssemble } = props;
    const [data, setData] = useState([]);
    const customers = useListCustomerByBill({ category_id: productInfo.category_id, product_id: productInfo.id });
    const users = useListUserV2({});

    useEffect(() => {
        if (customers && customers[0]) {
            let newData = [];
            customers.forEach((c, index) => {
                let name_user = '';
                let customer_info = {}
                users.forEach(u => {
                    if (u.id === c.user_sale_id) name_user = u.name;
                })
                if (c.info_customer && JSON.parse(c.info_customer)) customer_info = JSON.parse(c.info_customer);
                if (c.id) newData.push({
                    id: c.id + (checkAssemble.includes(Number(c.id)) ? " - assembled" : ""), name: customer_info.full_name + " - CCCD: " + customer_info.cmt_number + " - " + c.code
                        + " - NVKD: " + name_user + (checkAssemble.includes(c.id) ? " (Đã rap căn)" : "")
                });
            })
            setData([...newData]);
        }
    }, [customers, users, JSON.stringify(checkAssemble)])

    const template = (e) => {
        return (
            <div className="flex align-items-center">
                <div><b style={{ color: 'blue' }}>{e.name.split(' - CCCD:')[0]}</b><span> - {e.name.split(' - CCCD:')[1]}</span></div>
            </div>
        );
    }

    return (
        <div className='flex gap-2 mb-2'>
            <div className='.my-dropdown w-11'>
                <DropdownFormz disabled={disabled} value={value} onChange={e => handleSetData(e.target.value, index)} className="w-9" optionValue={undefined}
                    label={'Ưu tiên ' + index + ':'} itemTemplate={template} placeholder="Chọn khách hàng" options={data} />
            </div>
            <Button type='button' icon="pi pi-trash" className='mt-2'
                onClick={() => handleDelete(idz, index)} rounded outlined severity="danger" />
        </div>
    )
};

const Prioritizes = (props) => {
    const { product_id, productInfo, data, setData, disabled, checkAssemble, setCheckAssemble } = props;

    const handAdd = () => {
        const idz = (data && data[0]) ? (data[data.length - 1].idz + 1) : 1;
        setData([...data, { idz, bill_id: null }]);
    };

    const handleDelete = (idz, index) => {
        if (data && data[1]) {
            setData([...data.filter(d => d.idz !== idz)]);
        };
    };

    const handleSetData = (value, index) => {
        let newData = data;
        let newAssemble = checkAssemble
        if (value && index && newData[index - 1] && !value.includes("assembled")) {
            newData[index - 1].bill_id = value + " - assembled";
            newData[index - 1].sort = index;
            newAssemble[index - 1] = Number(value);
        };
        setCheckAssemble(newAssemble);
        setData([...newData]);
    };

    return (
        <Fragment>
            <div className='flex justify-content-between align-items-center'>
                <h6 style={{ padding: '0', margin: '0', lineHeight: "40px" }}><b>RÁP ƯU TIÊN</b></h6>
                {!(data.length >= 3) && <Button onClick={handAdd} disabled={disabled || (!data[data.length - 1].bill_id)} type="button" label="Thêm ưu tiên" size="small" />}
            </div>
            <div className='card mt-2'>
                {data.map((d, index) => {
                    return <Prioritize disabled={disabled} productInfo={productInfo} product_id={product_id} index={index + 1} idz={d.idz} value={d.bill_id}
                        handleSetData={handleSetData} key={index} handleDelete={handleDelete} checkAssemble={checkAssemble} />
                })}
            </div>
        </Fragment>
    )
};

const UpdateCampaign = () => {
    const { id } = useParams();
    const location = useLocation();
    const [params, setParams] = useState(() => {
        return location.search
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productInfo = useDetailProduct(id);
    const detailAssemble = useListAssembleProduct({ product_id: id });
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const [data, setData] = useState([{ idz: 1, bill_id: null }]);
    const [checkAssemble, setCheckAssemble] = useState([]);
    const [infos, setInfos] = useState({
        cdt_code: '', dt_thong_thuy: '', dt_tim_tuong: '', direction: '', view: '', gia_thong_thuy: '', total: '',
        gia_tim_tuong: '', gia_tran: '', gia_san: '', gia_niem_yet: '', don_gia_chua_vat: '', don_gia_co_vat: '', note: ''
    });
    const carts = useListCart({ category_id: productInfo.category_id });
    const permissionTool = useSelector(state => state.permission).permissionTool;
    const building = useDetailCategory(Number(productInfo.building_id)) || {};

    useEffect(() => {
        if (Number(id) && productInfo) {
            if (!productInfo.cart_id) productInfo.cart_id = -2;
            if (!(permissionTool.includes('/row_table/update')) ||
                (productInfo.p_status && !(["MBA", "CBA", "DCH", "PAYMENT"].includes(productInfo.p_status)))) {
                setIsView(true);
            };
            setInfos({ ...infos, ...productInfo, status: Number(productInfo.status) === 1 ? true : false });
        };
    }, [productInfo]);

    useEffect(() => {
        if (detailAssemble && detailAssemble[0]) {
            let newData = [];
            let newAssembled = [];
            if (detailAssemble && detailAssemble[0]) {
                detailAssemble.forEach((b, index) => {
                    newData[(b.sort - 1)] = { idz: b.sort, bill_id: String(b.bill_id) + " - assembled", sort: b.sort };
                    newAssembled[(b.sort - 1)] = Number(b.bill_id) || index + 1;
                })
                const sort_1 = detailAssemble.find(d => d.sort === 1)
                const sort_2 = detailAssemble.find(d => d.sort === 2)
                const sort_3 = detailAssemble.find(d => d.sort === 3)
                if (!sort_1) {
                    newData[0] = { idz: 1, sort: 1 }
                    newAssembled[0] = 0
                }
                else if (!sort_2 && sort_3) {
                    newData[1] = { idz: 2, sort: 2 }
                    newAssembled[1] = 0
                }
            };
            setCheckAssemble([...newAssembled])
            setData([...newData])
        }
    }, [detailAssemble]);

    async function fetchDataSubmit(info) {
        const response = await updateProduct(info);
        if (response) setLoading(false);
        if (response.data.status) {
            navigate('/row_table');
            dispatch(showToast({ ...listToast[0], detail: 'Cập nhật sản phẩm thành công!' }));
        } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    };

    async function fetchData(info) {
        if (detailAssemble && detailAssemble[0] && detailAssemble[0].id) {
            const response = await updateAssembleProduct(info);
            if (response.data.status) {
                navigate('/row_table' + params);
                dispatch(showToast({ ...listToast[0], detail: 'Cập nhật ráp căn thành công!' }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        } else {
            const response = await assembleProduct(info);
            if (response.data.status) {
                navigate('/row_table' + params);
                dispatch(showToast({ ...listToast[0], detail: 'Ráp căn thành công!' }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        let info = { ...removePropObject({ ...infos, status: infos.status ? 1 : 0 }, productInfo), id: id };
        for (const key in info) {
            if (info.hasOwnProperty.call(info, key)) {
                info[key] = Number(info[key]) || info[key];
            };
        };
        fetchDataSubmit(info);
    };

    const assembled = () => {
        let newBills = [];
        if (data && data[0]) {
            data.forEach(d => {
                if (d.bill_id) newBills.push({ bill_id: Number(d.bill_id.split(" - ")[0]), sort: d.sort });
            })
        }
        if (detailAssemble && detailAssemble[0]) {
            const foundElement = detailAssemble.filter(d => !newBills.some(n => (d.bill_id === n.bill_id)));
            if (foundElement && foundElement[0]) {
                foundElement.forEach(f => {
                    newBills.push({ id: f.id, bill_id: f.bill_id, deleted_at: 1 });
                });
            };
            newBills.forEach((n, index) => {
                detailAssemble.forEach(d => {
                    if (n.bill_id === d.bill_id) n.id = d.id;
                })
            })
        };
        let info = { cart_id: productInfo.cart_id ? productInfo.cart_id : undefined, product_id: Number(id), bills: newBills };
        fetchData(info);
    }

    return (
        <div className='card' >
            <div className="flex justify-content-between align-items-center mb-4">
                <h4 className="m-0 ml-2" style={{ fontWeight: '700' }}>RÁP CĂN <span style={{ color: 'blue' }}>{infos.code}</span> </h4>
            </div>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <form onSubmit={handleSubmit} className="grid formgrid">
                    <div className="col-12 lg:col-6">
                        <h6 className='mt-3'><b>THÔNG TIN CĂN</b></h6>
                        <div className='card'>
                            <InputForm id='code' value={infos.cdt_code} label='Mã BĐS thực tế' disabled={isView}
                                onChange={(e) => setInfos({ ...infos, cdt_code: e.target.value })} />
                            <DropdownForm label='Tình trạng (*)' value={infos.p_status} options={statusBDS} showClear={false}
                                onChange={(e) => (setInfos({ ...infos, p_status: e.target.value }))} disabled={isView || !(["CBA", "MBA"].includes(productInfo.p_status))} />
                            <DropdownForm label='Giai đoạn (*)' value={infos.stage} options={GD} showClear={false}
                                onChange={(e) => (setInfos({ ...infos, stage: e.target.value }))} disabled={isView} />
                            <DropdownForm label='Rổ hàng' value={infos.cart_id} options={[ ...carts, { name: "Thu hồi về kho", id: -1 } ]} showClear={false}
                                onChange={(e) => (setInfos({ ...infos, cart_id: e.target.value }))} disabled={isView} />
                            <InputNumber id='dt_thong_thuy' value={infos.dt_thong_thuy} label='Diện tích thông thủy (m2)'
                                handleChange={(e) => setInfos({ ...infos, dt_thong_thuy: e })} disabled={isView} />
                            <InputNumber id='dt_tim_tuong' value={infos.dt_tim_tuong} label='Diện tích tim tường (m2)'
                                handleChange={(e) => setInfos({ ...infos, dt_tim_tuong: e })} disabled={isView} />
                            <InputForm id='direction' value={infos.direction} label='Hướng' disabled={isView}
                                onChange={(e) => setInfos({ ...infos, direction: e.target.value })} />
                            <InputForm id='view' value={infos.view} label='View' disabled={isView}
                                onChange={(e) => setInfos({ ...infos, view: e.target.value })} />
                            <InputForm id='corner_unit' value={infos.corner_unit} label='Góc' disabled={isView}
                                onChange={(e) => setInfos({ ...infos, corner_unit: e.target.value })} />
                            <InputNumber id='gia_thong_thuy' value={infos.gia_thong_thuy} label='Giá thông thủy'
                                handleChange={(e) => setInfos({ ...infos, gia_thong_thuy: e })} disabled={isView} />
                            <InputNumber id='gia_tim_tuong' value={infos.gia_tim_tuong} label='Giá tim tường'
                                handleChange={(e) => setInfos({ ...infos, gia_tim_tuong: e })} disabled={isView} />
                            <InputNumber id='gia_san' value={infos.gia_san} label='Giá sàn'
                                handleChange={(e) => setInfos({ ...infos, gia_san: e })} disabled={isView} />
                            <InputNumber id='gia_tran' value={infos.gia_tran} label='Giá trần'
                                handleChange={(e) => setInfos({ ...infos, gia_tran: e })} disabled={isView} />
                            <InputNumber id='gia_niem_yet' value={infos.gia_niem_yet} label='Tổng giá bán'
                                handleChange={(e) => setInfos({ ...infos, gia_niem_yet: e })} disabled={isView} />
                            <InputTextareaForm id='gi_chu_niem_yet' value={infos.gi_chu_niem_yet} label='Chi chú giá bán'
                                onChange={(e) => setInfos({ ...infos, gi_chu_niem_yet: e.target.value })} disabled={isView} />
                            <InputNumber id='don_gia_chua_vat' value={infos.gia_ban_chua_vat} label='Giá bán chưa VAT'
                                handleChange={(e) => setInfos({ ...infos, gia_ban_chua_vat: e })} disabled={isView} />
                            <InputNumber id='total' value={infos.total} label='Số tiền yêu cầu'
                                handleChange={(e) => setInfos({ ...infos, total: e })} disabled={isView} />
                            <InputTextareaForm id='note' value={infos.note} label='Chi chú'
                                onChange={(e) => setInfos({ ...infos, note: e.target.value })} disabled={isView} />
                            <InputSwitchForm disabled={isView} checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                        </div>
                        <div className="w-full justify-content-end flex mt-4">
                            <Button type='button' onClick={() => navigate('/row_table')} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />
                            {!isView && <Button type='submit' loading={loading} label="Cập nhật" className="ml-2" severity="info" size="small" raised />}
                        </div>
                    </div>
                    <div className="col-12 lg:col-1 mt-4">
                    </div>
                    <div className="col-12 lg:col-5">
                        <Prioritizes disabled={!(infos.scope_type && infos.scope_type.includes('quanlydohang') && (building.assemble === 1) && ['MBA', 'CBA', 'RAP'].includes(productInfo.p_status) && (productInfo.stage === 1))}
                            productInfo={productInfo} checkAssemble={checkAssemble} setCheckAssemble={setCheckAssemble} data={data} setData={setData} product_id={Number(id)} />
                        <div className='flex justify-content-center'>
                            <Button disabled={!(infos.scope_type && infos.scope_type.includes('quanlydohang') && (building.assemble === 1) && ['MBA', 'CBA', 'RAP'].includes(productInfo.p_status))}
                                onClick={assembled} type="button" label="Xác nhận rap căn" size="small" />
                        </div>
                        <div className='mt-4'></div>
                        <BillByProduct list_bill={(productInfo && productInfo.list_bill) ? productInfo.list_bill : []} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateCampaign;