import React, { Fragment, useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {ActionBody, Columnz, DataTablez, useGetParams} from "@/components/DataTable";
import { useListCustomerHaveBill, useCountCustomerHaveBill } from "../util";
import { useListCity, useListDistrict, useListWard } from '@/utils';
import { genders, useListUserV2 } from '@/modules/users/user/util';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });
    const users = useListUserV2()
    const cities = useListCity();
    const districts = useListDistrict(filter.city_id);
    const wards = useListWard(filter.district_id);

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-6">
            <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })}
                placeholder="Tìm kiếm khách hàng theo tên, số điện thoại, email" />
            <Dropdownz value={filter.city_id} options={cities} placeholder="Tỉnh / TP" optionLabel="text" optionValue="value"
                onChange={(e) => setFilter({ ...filter, city_id: e.target.value })} />
            <Dropdownz value={filter.district_id} options={districts} placeholder="Quận / Huyện" optionLabel="text" optionValue="value"
                onChange={(e) => setFilter({ ...filter, district_id: e.target.value })} />
            <Dropdownz value={filter.ward_id} options={wards} placeholder="Phường / Xã" optionLabel="text" optionValue="value"
                onChange={(e) => setFilter({ ...filter, ward_id: e.target.value })} />
            <Dropdownz value={filter.user_sale_id} options={users} placeholder="Nhân viên"
                onChange={(e) => setFilter({ ...filter, user_sale_id: e.target.value })} />
            <Dropdownz value={filter.sex} options={genders} placeholder="Giới tính"
                onChange={(e) => setFilter({ ...filter, sex: e.target.value })} />
        </GridForm>
    )
};

const TransactionCustomer = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListCustomerHaveBill({ first: undefined, ...paramsPaginator });
    const totalRecords = useCountCustomerHaveBill({ first: undefined, ...paramsPaginator });

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} title="Khách hàng giao dịch" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="id" header="Mã khách hàng" />
                <Columnz field="full_name" header="Tên khách hàng" />
                <Columnz field="phone" header="Số điện thoại" />
                <Columnz field="email" header="Email" />
                <Columnz field="cmt_number" header="CMND / CCCD" />
                <Columnz body={e => <Fragment>{(e.sex === 1) ? 'Nam' : 'Nữ'}</Fragment>} header="Giới tính" />
                <Columnz field="address" header="Địa chỉ" />
                <Columnz field="city_name" header="Tỉnh / TP" />
                <Columnz field="district_name" header="Quận / Huyện" />
                <Columnz field="ward_name" header="Phường / Xã" />
                <Columnz header="Actions" body={e => ActionBody(e, '/customer/detail')} bodyStyle={{ textAlign: 'center', }} />
            </DataTablez>
        </div>
    )
}

export default TransactionCustomer;