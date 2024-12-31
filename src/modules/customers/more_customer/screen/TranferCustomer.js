import { Dropdownz } from "@/components/ListForm";
import { showToast } from "@/redux/features/toast";
import { Button, Column, DataTable } from "@/uiCore";
import { getSale, listToast } from "@/utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { recallCustomer } from "@/modules/users/user/api";
import { useListUserV2 } from "@/modules/users/user/util";

const TranferCustomer = (props) => {
    const dispatch = useDispatch();
    const { customers, setVisible, paramsPaginator, setParamsPaginator, setSelectedProducts } = props;
    const [user, setUser] = useState('');
    const users = useListUserV2();

    async function handleTransfer() {
        let newArr = [];
        if (customers && customers[0]) {
            customers.forEach(s => {
                if (s.id) newArr.push(s.id);
            });
        };
        const res = await recallCustomer({ transfers: newArr, user_id_sale: user, recalls: [] });
        if (res.data.status) {
            setVisible(false);
            setSelectedProducts([]);
            setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render })
            dispatch(showToast({ ...listToast[0], detail: 'điều chuyển khách hàng thành công!' }));
        };
    };

    return (
        <div className="card">
            <i>Bạn đang thực hiện điều chuyển <b>{customers.length}</b> khách hàng</i>
            <DataTable value={customers} selectionMode={'checkbox'} scrollable scrollHeight="300px" dataKey="id" className="mt-4" tableStyle={{ minWidth: '50rem' }}>
                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                <Column field="full_name" header="Khách hàng"></Column>
                <Column field="phone" header="Số điện thoại"></Column>
                <Column field="email" header="Email"></Column>
            </DataTable>

            <div className="flex justify-content-around align-items-center mt-4">
                <Dropdownz value={user} onChange={e => setUser(e.target.value)} options={users} placeholder="Chọn nhân viên" />
                <Button onClick={handleTransfer} label="Điều chuyển" style={{ height: '48px' }} />
            </div>
        </div>
    )
};

export default TranferCustomer;