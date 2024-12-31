import React, { useState } from 'react';
import {RenderHeader, TimeBody, Columnz, DataTablez, Body, useGetParams} from "@/components/DataTable";
import { useListLogImportProduct, useCountLogImportProduct } from "../util";
import { Calendarz, Dropdownz, GridForm } from '@/components/ListForm';
import { useListUserV2 } from '@/modules/users/user/util';
import { formatNumber, useListProductName } from '../../row_table/util';
import { databaseDate } from '@/lib/convertDate';
import { GD, LH } from '../../category/util';
import { useListCart } from '../../manager_cart/util';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({});
    const products = useListProductName();
    const users = useListUserV2();

    const handleFilter = (filter) => {
        const filters = {
            ...filter, from: filter.dates && databaseDate(filter.dates[0]),
            to: filter.dates && filter.dates[1] ? databaseDate(filter.dates[1], true)
                : filter.dates && databaseDate(filter.dates[0], true), dates: undefined,
        };
        return filters;
    };


    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-3">
            <Dropdownz value={filter.user_id} options={users} placeholder="Người cập nhật"
                onChange={(e) => setFilter({ ...filter, user_id: e.target.value })} />
            <Dropdownz value={filter.code} options={products} placeholder="Mã sản phẩm" optionValue="name"
                onChange={(e) => setFilter({ ...filter, code: e.target.value })} />
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
        </GridForm>
    )
};

const LogImportProduct = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListLogImportProduct({ status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountLogImportProduct({ status: undefined, ...paramsPaginator, first: undefined });
    const users = useListUserV2();
    const carts = useListCart();

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách lịch sử cập nhật sản phẩm' })}
                title="lịch sử cập nhật sản phẩm" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="id" header="Id" bodyStyle={{ minWidth: '2rem' }} />
                <Columnz body={e => Body(users, e.user_id)} header="Người cập nhật" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz header="Ngày cập nhật" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="code" header="Code" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="cdt_code" header="Mã BĐS thực tế" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="" header="Đơn vị QLSP" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="p_status" header="Tình trạng Sản phẩm" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => Body(LH, e.type)} header="Loại Sản phẩm" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="status" header="Trạng thái" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="location" header="Vị Trí" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="lot_number" header="Số Lô" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="road" header="Đường (m)" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="bedroom" header="Phòng ngủ" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="toilet" header="Nhà vệ sinh" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="direction" header="Hướng" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="balcony_direction" header="Hướng ban công" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="view" header="View" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="corner_unit" header="Căn Góc" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="dt_thong_thuy" header="DT thông thủy " bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="dt_tim_tuong" header="DT tim tường" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="dt_san_vuon" header="DT sân vườn" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => formatNumber(e.gia_thong_thuy)} field="gia_thong_thuy" header="Giá thông thủy" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.gia_tim_tuong)} field="gia_tim_tuong" header="Giá tim tường" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.gia_san)} field="gia_san" header="Giá sàn (Min)" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.gia_tran)} field="gia_tran" header="Giá trần (Max)" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.gia_niem_yet)} field="gia_niem_yet" header="Giá niêm yết" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz field="gi_chu_niem_yet" header="Ghi chú Giá niêm yết" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => formatNumber(e.gia_ban_chua_vat)} field="gia_ban_chua_vat" header="Giá bán chưa VAT" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => formatNumber(e.don_gia_co_vat)} header="Đơn giá có VAT" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.don_gia_chua_vat)}  header="Đơn giá chưa VAT" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz field="thue_vat" header="Thuế VAT" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="maintain_price" header="Phí bảo trì" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="service_price" header="Phí dịch vụ" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => Body(GD, e.stage)} header="Giai đoạn" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="loai_dat_cho" header="Loại đặt chỗ" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => formatNumber(e.total)} header="Số tiền yêu cầu" bodyStyle={{ minWidth: '6rem', textAlign: 'center' }} />
                <Columnz field="lock_member" header="Số người lock" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz body={e => Body([ ...carts, { name: "Thu hồi về kho", id: -1 } ], e.cart_id)} header="Rổ hàng" bodyStyle={{ minWidth: '6rem' }} />
                <Columnz field="note" header="Ghi chú" bodyStyle={{ minWidth: '6rem' }} />
            </DataTablez>
        </div>
    )
}

export default LogImportProduct;