import { Body } from "@/components/DataTable";
import { useListBill } from "@/modules/transaction_management/contract/utils";
import { useListUserV2 } from "@/modules/users/user/util";
import { showToast } from "@/redux/features/toast";
import { Button, Column, DataTable } from "@/uiCore";
import { listToast } from "@/utils";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { deleteSalePolicy } from "../api";
import { useDetailSalePolicy } from "../util";

const DeleteSalePolicy = (props) => {
    const dispatch = useDispatch();
    const { setVisible, salePolicy, paramsPaginator, setParamsPaginator } = props;
    const bills = useListBill({ sale_policy_id: salePolicy }) || [];
    const users = useListUserV2();
    const sale_policy = useDetailSalePolicy(salePolicy);

    async function handleDelete() {
        const res = await deleteSalePolicy({ id: salePolicy });
        if (res.data.status) {
            setVisible(false);
            dispatch(showToast({ ...listToast[0], detail: 'Xóa chính sách thành công!' }));
            if (paramsPaginator && setParamsPaginator) {
                setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
            };
        };
    };

    return (
        <div className="card">
            <p style={{ margin: '0 auto' }}>CSBH: <b style={{ color: 'red' }}>{sale_policy && sale_policy.title}</b></p>
            {bills && bills[0] ? <Fragment>
                <p>Đang được áp dụng một số hợp đồng. Vui lòng kiểm tra lại!</p>
                <h6>Danh sách hợp đồng áp dụng CSBH:</h6>
                <DataTable value={bills} selectionMode={'checkbox'} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                    <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ minWidth: '1rem' }} />
                    <Column field="code" header="Hợp đồng"></Column>
                    <Column body={e => Body(users, e.user_sale_id)} header="Nhân viên"></Column>
                </DataTable>
            </Fragment> : <Fragment >
                <p>Bạn có chắc chắn muốn xóa chính sách này không!</p>
                <div className="flex justify-content-around mt-6">
                    <Button onClick={() => setVisible(false)} label="Không" severity="secondary" style={{ minWidth: '150px' }} />
                    <Button onClick={handleDelete} label="Có" style={{ minWidth: '150px' }} />
                </div>
            </Fragment>}
        </div>
    )
};

export default DeleteSalePolicy;