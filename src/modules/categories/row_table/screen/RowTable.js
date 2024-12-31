import React, { useState, Fragment, useEffect } from 'react';
import { Dropdownz, GridForm, Inputz } from "@/components/ListForm";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useListBuilding, useListBuildingV2 } from '../../building/util';
import { useListCart } from '../../manager_cart/util';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatNumber, useCountBuilding, useCountProduct, useListProduct } from '../util';
import { Button } from '@/uiCore';
import { Dialog } from 'primereact/dialog';
import ImportProduct from './ImportProduct';
import { useSelector } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import {listToast, removeUndefinedProps, useDetailPermission} from '@/utils';
import { useDispatch } from 'react-redux';
import { exportProduct, listProduct, recallProduct } from '../api';
import { Paginator } from 'primereact/paginator';
import { guiUuTien, listBillNoPolicy } from '@/modules/transaction_management/contract/api';
import { useListExchange } from '@/modules/companys/exchange/util';
import { Body } from '@/components/DataTable';
import { useListUserV2 } from '@/modules/users/user/util';
import { statusBill } from '@/modules/transaction_management/contract/utils';

const status = [
    { title: 'Chưa MB', color: '#B2B2B2', code: 'CBA' },
    { title: 'Trống', color: '#FFFFFF', code: 'MBA' },
    { title: 'Ráp', color: '#F67B29', code: 'RAP' },
    { title: 'Lock', color: '#FEA837', code: 'CHLOCK' },
    { title: 'KH xác nhận', color: '#FF8585', code: 'ADD_CUSTOMER' },
    { title: 'Đặt chỗ', color: '#6DB040', code: 'DCH' },
    { title: 'Chờ duyệt GD', color: '#FFE601', code: 'CDDCO' },
    { title: 'Thanh toán', color: '#FF00F5', code: 'PAYMENT' },
    { title: 'Đặt cọc', color: '#FF0035', code: 'DCO' },
    { title: 'HĐMB', color: '#8B939C', code: 'HDO' },
    { title: 'CĐT thu hồi', color: '#1D60DE', code: 'HUY' },
];

const prioritizes = ['ƯU TIÊN 1', 'ƯU TIÊN 2', 'ƯU TIÊN 3'];

const StatusProduct = (props) => {
    const { title, color, code, paramsPaginator, setParamsPaginator } = props;
    return (
        <div onClick={() => setParamsPaginator({ ...paramsPaginator, p_status_web: code })} style={{ cursor: 'pointer', position: 'relative' }}
            className="mb-3 col-12 md:col-3 lg:col-2">
            <div className='flex align-items-center gap-2'>
                <div style={{ height: '24px', width: '48px', backgroundColor: color, border: '1px solid #999', borderRadius: '4px' }}></div>
                <span>{title}</span>
            </div>
            {paramsPaginator && paramsPaginator.p_status_web && !(paramsPaginator.p_status_web === code) &&
                <div style={{ height: '2px', width: '160px', backgroundColor: 'red', position: 'absolute', top: '50%', left: '-4px' }}></div>}
        </div>
    )
};

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const dispatch = useDispatch()
    const [filter, setFilter] = useState({});
    const [filterV2, setFilterV2] = useState( {
        category_id: (paramsPaginator.permission === 'quanlyrohang') ? paramsPaginator.category_id : undefined,
        cart_id: (paramsPaginator.permission === 'quanlyrohang') ? paramsPaginator.cart_id : undefined,
        permission: (paramsPaginator.permission === 'quanlyrohang') ? paramsPaginator.permission : undefined,
    });
    const [bills, setBills] = useState([]);
    const [productRecall, setProductRecall] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleF, setVisibleF] = useState(false);
    const [visibleTH, setVisibleTH] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prioritize, setPrioritize] = useState(null);
    const [categorys, setCategorys] = useState([]);
    const categories = useListCategoryV2();
    const buildings = useListBuildingV2({ parent_id: filter.category_id });
    const carts = useListCart({ category_id: filter.category_id });
    const permissionTool = useSelector(state => state.permission).permissionTool;
    const exchanges = useListExchange();
    const users = useListUserV2();
    const permissions = useDetailPermission();
    const [type, setType] = useState(null);

    useEffect(() => {
        setFilter(paramsPaginator);
    }, []);

    useEffect(() => {
        const newPermission = []
        const scope_ids = [];
        if (permissions[0]) {
            permissions.forEach(p => {
                if (p.staff_object_id && !newPermission.includes(p.staff_object_id)) {
                    newPermission.push(p.staff_object_id);
                }
                if (p.staff_object_id === "dieuphoikinhdoanh" && p.scope_id) scope_ids.push(p.scope_id);
            })
        }
        const newCategories = [];
        if (!newPermission.includes("admin")) {
            categories.forEach(c => {
                if (scope_ids.includes(c.id)) newCategories.push(c);
            })
            setCategorys([...newCategories])
        } else {
            setCategorys([...categories]);
        }
    }, [permissions, categories]);

    const checkBill = async (e) => {
        const res = await listBillNoPolicy({ category_id: filter.category_id, priority: e });
        if (res.status) {
            if (res.data.data) {
                if (res.data.data.bills) {
                    setBills(res.data.data.bills);
                } else {
                    setBills([])
                }
                if (res.data.data.type) {
                    setType(Number(res.data.data.type));
                } else {
                    setType(null);
                }
            }
        }
    }

    const getProductRecall = async () => {
        const res = await listProduct({ category_id: filter.category_id, p_status_web: "MBA" });
        if (res.status) {
            if (res.data.data) {
                let data = [];
                res.data.data.forEach(d => {
                    if (d.cart_id !== null && d.cart_id !== -1) data.push(d)
                })
                setProductRecall([...data]);
            }
        }
    }

    const handleFilter = (filter) => {
        if (filterV2.permission === 'quanlyrohang') {
            filter = { ...filter, category_id: filterV2.category_id, cart_id: filterV2.cart_id };
        }
        return filter;
    }

    async function fetchData() {
        const response = await exportProduct(new URLSearchParams(removeUndefinedProps(paramsPaginator)).toString());
        if (response) setLoading(false);
        if (response.status) {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(response.data);
            downloadLink.download = 'Products.xlsx';
            downloadLink.click();
            dispatch(showToast({ ...listToast[0], detail: "Export sản phẩm thành công!" }));
        }
        else dispatch(showToast({ ...listToast[1], detail: response.mess }));
    };

    async function fetchDataRecallProduct() {
        const params = [];
        productRecall.forEach(p => {
            if (p.id) params.push(p.id);
        })
        const response = await recallProduct({ ids: params });
        if (response.status) {
            dispatch(showToast({ ...listToast[0], detail: "Thu hồi sản phẩm về kho thành công!" }));
            setProductRecall([]);
            setVisibleTH(false);
        }
        else dispatch(showToast({ ...listToast[1], detail: response.mess }));
    };

    const handleExport = () => {
        setLoading(true);
        fetchData();
    };

    const handleGuiUuTien = async () => {
        setLoading(true);
        const res = await guiUuTien({ category_id: filter.category_id, sort: prioritize });
        if (res) setLoading(false);
        if (res.data.status) {
            dispatch(showToast({ ...listToast[0], detail: 'Gửi ưu tiên thành công!' }));
            setVisibleF(false)
        } else {
            dispatch(showToast({ ...listToast[1], detail: res.data.mess }));
            setVisibleF(false)
        }
    };

    return (
        <Fragment>
            <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
                filter={filter} setFilter={setFilter} handleFilter={handleFilter} moreFilter={(filterV2.permission === 'quanlyrohang') ? filterV2 : {}} className="lg:col-12" >
                <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })}
                    placeholder="Tìm kiếm theo mã căn" />
                <Dropdownz value={filterV2.category_id || filter.category_id} disabled={filterV2.permission === "quanlyrohang"}
                    onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })}
                    options={categorys} placeholder="Chọn dự án" />
                <Dropdownz value={filter.building_id}
                    onChange={(e) => setFilter({ ...filter, building_id: e.target.value })}
                    options={filter.category_id ? buildings : []} placeholder="Chọn tòa nhà" />
                <Dropdownz value={filterV2.cart_id || filter.cart_id} disabled={filterV2.permission === "quanlyrohang"}
                    onChange={(e) => setFilter({ ...filter, cart_id: e.target.value })}
                    options={carts} placeholder="Chọn rổ hàng" />
            </GridForm>

            <Dialog header="Import bảng hàng" visible={visible} position='top' style={{ width: '50vw' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <ImportProduct />
            </Dialog>

            {/* Gửi ưu tiên */}
            <Dialog header="THÔNG BÁO" visible={visibleF} position='top' style={{ width: '60vw' }}
                onHide={() => setVisibleF(false)} draggable={false} resizable={false}>
                {(!(bills && bills[0]) || type === 2 || type === 5) ? <div className='flex flex-column justify-content-center text-center gap-2'>
                    {!type && <Fragment>
                        <h6>Dự án: <b style={{ color: 'red' }}>{categorys.find(c => c.id === filter.category_id) && categorys.find(c => c.id === filter.category_id).cb_title}</b></h6>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>BẠN CÓ CHẮC CHẮC MUỐN GỬI YÊU CẦU CHUYỂN CỌC TỚI <b style={{ color: 'red' }}>{prioritizes[prioritize - 1]}</b> </span>
                    </Fragment>}
                    {type === 2 && <div style={{ padding: '0 auto' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Chuyển cọc ưu tiên {prioritize}, trường hợp ưu tiên {prioritize - 1} chưa hoàn tất </span> <br /> <br />
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>Danh sách hợp đồng chưa hoàn tất: </span> <br />
                        <div className='card'>
                            <DataTable value={bills} scrollable scrollHeight="300px" dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                                <Column field="code" header="Hợp đồng"></Column>
                                <Column body={e => Body(statusBill, e.status)} header="Tình trạng"></Column>
                                <Column body={e => Body(users, e.user_sale_id)} header="Nhân viên"></Column>
                                <Column body={e => Body(exchanges, e.exchange_id)} header="Sàn"></Column>
                            </DataTable>
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Bạn có chắc chắn muốn từ chối ưu tiên {prioritize -1}, và chuyển cọc ưu tiên {prioritize} ?</span> <br />
                    </div>}
                    {type === 5 && <div style={{ padding: '0 auto' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Gửi ưu tiên khi có hợp đồng với chính sách đã hết hạn</span> <br /> <br />
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>Danh sách hợp đồng có chính sách hết hạn: </span> <br />
                        <div className='card'>
                            <DataTable value={bills} scrollable scrollHeight="300px" dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                                <Column field="code" header="Hợp đồng"></Column>
                                <Column body={e => Body(statusBill, e.status)} header="Tình trạng"></Column>
                                <Column body={e => Body(users, e.user_sale_id)} header="Nhân viên"></Column>
                                <Column body={e => Body(exchanges, e.exchange_id)} header="Sàn"></Column>
                            </DataTable>
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Bạn có chắc chắn muốn từ chối ưu tiên {prioritize -1}, và chuyển cọc ưu tiên {prioritize} ?</span> <br />
                    </div>}
                    {(!type || type === 2) && <div className='flex w-full justify-content-evenly mt-6'>
                        <Button loading={loading} onClick={() => setVisibleF(false)} type="button" label="Không" className="mr-3" severity="danger" size="small" raised style={{ minWidth: '120px' }} />
                        <Button loading={loading} onClick={() => handleGuiUuTien()} type="button" label="Có" className="mr-3" size="small" raised style={{ minWidth: '120px' }} />
                    </div>}
                </div> : <div style={{ padding: '0 auto' }}>
                    <span style={{ fontWeight: '600', fontSize: '16px', }}>KHÔNG THỂ GỬI YÊU CẦU CHUYỂN CỌC !</span> <br /> <br />
                    {(type === 1) && <Fragment>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Hợp đồng ưu tiên trước chưa được xác nhận hết ?</span> <br /> <br />
                        <div className='card'>
                            <DataTable value={bills} scrollable scrollHeight="300px" dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                                <Column field="code" header="Hợp đồng"></Column>
                                <Column body={e => Body(statusBill, e.status)} header="Tình trạng"></Column>
                                <Column body={e => Body(users, e.user_sale_id)} header="Nhân viên"></Column>
                                <Column body={e => Body(exchanges, e.exchange_id)} header="Sàn"></Column>
                            </DataTable>
                        </div>
                    </Fragment>}
                    {!type && <Fragment>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>NVKD cần bổ sung CSBH áp dụng cho các hợp đồng:</span> <br /> <br />
                        <div className='card'>
                            <DataTable value={bills} scrollable scrollHeight="300px" dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                                <Column field="code" header="Hợp đồng"></Column>
                                <Column body={e => Body(users, e.user_sale_id)} header="Nhân viên"></Column>
                                <Column body={e => Body(exchanges, e.exchange_id)} header="Sàn"></Column>
                            </DataTable>
                        </div>
                    </Fragment>}
                </div>
                }
                {type === 3 && <p style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Không thể gửi yêu cầu chuyển cọc đến ưu tiên {prioritize} khi chưa gửi yêu cầu chuyển cọc đến ưu tiên {prioritize - 1}</p>}
                {type === 4 && <p style={{ fontWeight: '600', fontSize: '16px', color: 'red' }}>Không có hợp đồng nào phù hợp đang ở tình trạng ưu tiên {prioritize}</p>}
            </Dialog>

            {/* Thu hồi SP */}
            <Dialog header="THÔNG BÁO" visible={visibleTH} position='top' style={{ width: '60vw' }}
                onHide={() => setVisibleTH(false)} draggable={false} resizable={false}>
                <div className='flex flex-column justify-content-center text-center gap-2'>
                    <h6>Dự án: <b style={{ color: 'red' }}>{categorys.find(c => c.id === filter.category_id) && categorys.find(c => c.id === filter.category_id).cb_title}</b></h6>
                    {productRecall.length ? <Fragment>
                        <span style={{ fontWeight: '600' }}>SẢN PHẨM CÓ THỂ THU HỒI </span>
                        <div className="card" style={{ minHeight: '300px' }}>
                            <DataTable value={productRecall} scrollable scrollHeight="300px" dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} bodyStyle={{ textAlign: 'center' }} />
                                <Column field="code" header="Mã sản phẩm" bodyStyle={{ textAlign: 'center' }}></Column>
                                <Column field="cdt_code" header="Mã BDS thực tế" bodyStyle={{ textAlign: 'center' }}></Column>
                                <Column body={e => status.find(s => s.code === e.p_status) && status.find(s => s.code === e.p_status).title} header="Trạng thái" bodyStyle={{ textAlign: 'center' }}></Column>
                                <Column body={e => Body(carts, e.cart_id)} header="Rổ hàng"></Column>
                            </DataTable>
                        </div>
                        <span style={{ fontWeight: '600' }}>BẠN CÓ CHẮC CHẮN MUỐN THU HỒI SẢN PHẨM VỀ KHO </span>
                        <div className='flex w-full justify-content-evenly mt-4'>
                            <Button onClick={() => setVisibleTH(false)} type="button" label="Không" className="mr-3" severity="danger" size="small" raised style={{ minWidth: '96px' }} />
                            <Button onClick={() => fetchDataRecallProduct()} type="button" label="Có" className="mr-3" size="small" raised style={{ minWidth: '96px' }} />
                        </div>
                    </Fragment>
                        : <span style={{ fontWeight: '600' }}> KHÔNG CÓ SẢN PHẨM NÀO CÓ THỂ THU HỒI ? </span>}
                </div>
            </Dialog>

            <div className='mt-4' style={{ backgroundColor: '#f8f9fa', padding: '1rem', border: '1px solid #dee2e6' }}>
                <div className='flex justify-content-between align-items-center'>
                    <h4 className="m-0">Bảng hàng - dự án</h4>
                    <div>
                        {permissionTool.includes('/row_table/recall_product') && <Button onClick={() => { setVisibleTH(true); getProductRecall() }} disabled={!filter.category_id} type="button" label="Thu hồi SP về kho" className="mr-3" size="small" raised style={{ minWidth: '96px' }} />}
                        {permissionTool.includes('/row_table/send_priority') && <Fragment>
                            <Button onClick={() => { checkBill(1); setPrioritize(1); setVisibleF(true) }} disabled={!filter.category_id} type="button" label="Gửi ưu tiên 1" className="mr-3" severity="danger" size="small" raised style={{ minWidth: '96px' }} />
                            <Button onClick={() => { checkBill(2); setPrioritize(2); setVisibleF(true) }} disabled={!filter.category_id} type="button" label="Gửi ưu tiên 2" className="mr-3" severity="info" size="small" raised style={{ minWidth: '96px' }} />
                            <Button onClick={() => { checkBill(3); setPrioritize(3); setVisibleF(true) }} disabled={!filter.category_id} type="button" label="Gửi ưu tiên 3" className="mr-3" severity="warning" size="small" raised style={{ minWidth: '96px' }} />
                        </Fragment>}
                        {permissionTool.includes('/row_table/import') &&
                            <Button onClick={() => setVisible(true)} type="button" label="Import" severity="warning" icon='pi pi-upload' size="small" className="mr-3" raised style={{ minWidth: '96px' }} />}
                        {permissionTool.includes('/row_table/export') &&
                            <Button loading={loading} label="Export" onClick={handleExport} icon='pi pi-download' severity="warning" size="small" style={{ minWidth: '96px' }} raised />}
                    </div>

                </div>
            </div>
            <div className='card mt-0 pb-0' style={{ borderRadius: '0', paddingButtom: '0' }}>
                <div className='grid formgrid align-items-center'>
                    {status.map(s => {
                        return <StatusProduct code={s.code} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} key={s.title} title={s.title} color={s.color} />
                    })}
                </div>
            </div>
        </Fragment>
    )
};

const RowTable = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paramsPaginator, setParamsPaginator] = useState(() => {
        const params = {};
        params.page = 1;
        params.first = 0;
        params.rows = 5;
        params.limit = 5;
        const queryParams = new URLSearchParams(location.search);
        for (let [key, value] of queryParams.entries()) {
            params[key] = Number(value) || value;
        };
        return params;
    });
    const [data, setData] = useState([]);
    const products = useListProduct({ status: undefined, ...paramsPaginator, first: undefined, limit: 5, rows: undefined });
    const buildings = useListBuildingV2();

    useEffect(() => {
        const params = {};
        for (let key in paramsPaginator) {
            if (paramsPaginator.hasOwnProperty(key)) {
                const value = paramsPaginator[key];
                if (value !== undefined && value !== null) {
                    params[key] = value;
                };
            };
        };
        navigate(location.pathname + '?' + new URLSearchParams(params).toString());
    }, [paramsPaginator]);

    useEffect(() => {
        const items = [];
        products.forEach(p => {
            if (p.code) {
                items.push({ code: p.code, building_id: p.building_id, price: p.gia_niem_yet, status: p.p_status, idz: p.id });
            }
        });
        const building = [];
        for (const item of items) {
            const groupKey = item.building_id;
            const existingGroup = building.find(group => group.id === groupKey);
            if (existingGroup) {
                existingGroup.children.push(item);
            } else {
                building.push({ id: groupKey, children: [item] });
            };
        };

        let newBuildings = [];
        building.forEach(b => {
            b.apartments = [];
            b.floor = [];
            var uniqueObjects = [];
            var existingCodes = [];

            for (var i = 0; i < b.children.length; i++) {
                var currentCode = b.children[i].code;
                if (!existingCodes.includes(currentCode)) {
                    uniqueObjects.push(b.children[i]);
                    existingCodes.push(currentCode);
                }
            };

            b.children.forEach(c => {
                b.apartments.push(Number(c.code.substring(10, 13)));
                const groupKey = c.code.substring(6, 9);
                const existingGroup = b.floor.find(group => group.id === groupKey);
                if (existingGroup) {
                    existingGroup.children.push(c);
                } else {
                    b.floor.push({ id: groupKey, children: [c] });
                };
            });
            let min = Math.min(...b.apartments);
            let max = Math.max(...b.apartments);
            b.apartments = [];
            for (let i = min; i <= max; i++) {
                b.apartments.push(Number(i));
            };
            newBuildings.push({ id: b.id, data: b.floor, apartments: b.apartments, children: uniqueObjects });
        });
        setData([...newBuildings]);
    }, [products]);

    const apartmentBody = (e) => {
        let backgroundColor = '';
        let code = {};
        data[e.index].children.forEach(d => {
            if (e.floor === d.code.substring(6, 9) && e.id === Number(d.code.substring(10, 13)) && d.price) {
                if (d.status === 'LOCKED') d.status = 'CHLOCK';
                if (d.status === 'CUSTOMER_CONFIRM') d.status = 'ADD_CUSTOMER';
                status.forEach(s => {
                    if (d.status === s.code) {
                        backgroundColor = s.color;
                    }
                });
                code = d;
            };
        });
        if (code.code) {
            let router = '/row_table/detail/' + code.idz + '?' + new URLSearchParams(removeUndefinedProps({ category_id: paramsPaginator.category_id, building_id: paramsPaginator.building_id, cart_id: paramsPaginator.cart_id })).toString();
            return (
                <Link to={router} >
                    <div className='flex flex-column align-items-center justify-content-center' style={{ backgroundColor: backgroundColor, height: '100%' }}>
                        <b>{code.code.substring(3, 6) + code.code.substring(6, 9) + '-' + ((Number(e.id) < 10) ? "0" + e.id : e.id)}</b>
                        <span>{formatNumber(Math.floor(Number(code.price) / 1000000))}</span>
                    </div>
                </Link>
            )
        }
    };

    const getBuildingName = (id) => {
        let building = buildings.find(b => b.id === id);
        if (building) return building.name;
        return ''
    };

    const onPageChange = (e) => {
        setParamsPaginator({ ...paramsPaginator, first: e.first, rows: e.rows, page: e.page + 1 });
    }
    const totalProduct = useCountProduct({ ...paramsPaginator, status: undefined, first: undefined })
    const totalRecords = useCountBuilding({ ...paramsPaginator, status: undefined, first: undefined })

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} tableStyle={{ width: '500px' }} />
            {data && data[0] && <div className='card rowTable'>
                {data.map((d, index) => {
                    let width = (Number(d.apartments.length) + 1) * 100 + 50 + 'px';
                    return (
                        <div key={index} style={{ maxWidth: width, marginBottom: '2rem' }}>
                            <div className='card'>
                                <h5>{getBuildingName(Number(d.id))}</h5>
                                <DataTable value={d.data} showGridlines >
                                    <Column body={e => <Fragment>{"Tầng " + e.id}</Fragment>} field='id' header="" bodyStyle={{ textAlign: 'center', height: '60px', minWidth: '100px', backgroundColor: '#dee2e6' }} />
                                    {d.apartments && d.apartments.map((col, i) => (
                                        <Column key={col} body={e => apartmentBody({ id: col, index: index, floor: e.id })}
                                            header={(Number(col) < 10) ? "0" + col : col} headerStyle={{ minWidth: '60px', textAlign: 'center', justifyContent: 'center' }}
                                            bodyStyle={{ textAlign: 'center', height: '60px', minWidth: '100px', fontSize: '15px' }} />
                                    ))}
                                </DataTable>
                            </div>
                        </div>
                    )
                })}
            </div>}
            {data && !data[0] && <div className='card'>
                <h5 className='text-center mt-3'>Không tìm thấy căn hộ nào</h5>
            </div>}
            <Paginator first={paramsPaginator.first} rows={paramsPaginator.rows} totalRecords={totalRecords} onPageChange={onPageChange} />
            <div className='w-full text-center' >
                <span style={{ margin: '0 auto' }}>Tổng số: {totalProduct} sản phẩm</span>
            </div>
        </div>
    )
}

export default RowTable;