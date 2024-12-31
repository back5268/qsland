import { Dropdownz } from "@/components/ListForm";
import { showToast } from "@/redux/features/toast";
import { Button, Column, DataTable } from "@/uiCore";
import { getSale, listToast } from "@/utils";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {useListCustomerRecall, useDetailUser, useListUserV2} from "../util";
import { deleteUser, recallCustomer } from "../api";
import { useListUser } from "../util";

const DeleteUser = (props) => {
    const dispatch = useDispatch();
    const { user_id, setVisibleDelete, paramsPaginator, setParamsPaginator } = props;
    const detailUser = useDetailUser(user_id);
    const [params, setParams] = useState({ user_id_sale: user_id, render: false });
    const customers = useListCustomerRecall(params);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [arrIdCustomer, setArrIdCustomer] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const newUsers = useListUserV2();

    useEffect(() => {
        let newArr = [];
        if (selectedProducts && selectedProducts[0]) {
            selectedProducts.forEach(s => {
                if (s.id) newArr.push(s.id);
            });
        };
        setArrIdCustomer(newArr);
    }, [selectedProducts]);

    useEffect(() => {
        setUsers(newUsers && newUsers.filter(u => u.id !== user_id));
    }, [newUsers]);

    async function handleRecall() {
        if (arrIdCustomer && arrIdCustomer[0]) {
            const res = await recallCustomer({ recalls: arrIdCustomer, transfers: [] });
            if (res.data.status) {
                setSelectedProducts([]);
                dispatch(showToast({ ...listToast[0], detail: 'Thu hồi khách hàng thành công!' }));
                setParams({ ...params, render: !params.render });
            };
        };
    };

    async function handleTransfer() {
        if (arrIdCustomer && arrIdCustomer[0]) {
            const res = await recallCustomer({ transfers: arrIdCustomer, user_id_sale: user, recalls: [] });
            if (res.data.status) {
                setSelectedProducts();
                dispatch(showToast({ ...listToast[0], detail: 'điều chuyển khách hàng thành công!' }));
                setIsShow(false);
                setParams({ ...params, render: !params.render });
            };
        };
    };

    async function handleDelete() {
        const res = await deleteUser({ id: user_id });
        if (res.data.status) {
            setVisibleDelete(false);
            dispatch(showToast({ ...listToast[0], detail: 'Xóa người dùng thành công!' }));
            if (paramsPaginator && setParamsPaginator) {
                setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
            };
        };
    };

    const saleBody = () => {
        return <Fragment >{detailUser && detailUser.user_info && detailUser.user_info.full_name}</Fragment>
    };

    return (
        <div className="card">
            <p>Nhân viên: <b style={{ color: 'red' }}>{detailUser && detailUser.user_info && detailUser.user_info.full_name}</b></p>
            {customers && customers[0] ? <Fragment>
                <p>Không thể xóa do có nhiều khách hàng đang chăm sóc</p>
                <h6>Danh sách khách hàng:</h6>
                <div className="card" style={{ minHeight: '300px' }}>
                    <DataTable value={customers} selectionMode={'checkbox'} scrollable scrollHeight="300px" selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                        <Column field="full_name" header="Khách hàng"></Column>
                        <Column field="phone" header="Số điện thoại"></Column>
                        <Column header="Nhân viên" body={saleBody}></Column>
                    </DataTable>
                </div>

                <div className="flex justify-content-center mt-4">
                    <i style={{ color: 'red' }} >Vui lòng thu hồi hoặc điều chuyển khách hàng trước khi xóa nhân viên</i>
                </div>
                <div className="flex justify-content-around mt-4">
                    <Button disabled={arrIdCustomer && !arrIdCustomer[0]} onClick={handleRecall} label="Thu hồi" />
                    <Button disabled={arrIdCustomer && !arrIdCustomer[0]} onClick={() => setIsShow(true)} label="Điều chuyển" />
                </div>
                {isShow ? <Fragment>
                    <div className="flex justify-content-end mt-4">
                        <Dropdownz value={user} onChange={e => setUser(e.target.value)} options={users} placeholder="Chọn nhân viên" />
                        <Button severity="warning" onClick={handleTransfer} label="OK" className="mr-7" style={{ height: '60px' }} />
                    </div>
                    <div style={{ height: '200px' }}></div>
                </Fragment> : ''}
            </Fragment> : <Fragment >
                <p>Bạn có tiếp tục muốn xóa!</p>
                <div className="flex justify-content-around mt-6">
                    <Button onClick={() => setVisibleDelete(false)} label="Không" severity="secondary" style={{ minWidth: '150px' }} />
                    <Button onClick={handleDelete} label="Có" style={{ minWidth: '150px' }} />
                </div>
            </Fragment>}
        </div>
    )
};

export default DeleteUser;