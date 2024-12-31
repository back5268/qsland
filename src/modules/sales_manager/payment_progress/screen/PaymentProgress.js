import React, { Fragment, useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {RenderHeader, Columnz, DataTablez, ActionBody, Body, useGetParams} from "@/components/DataTable";
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { from_types, useListSalePolicyV2 } from '../../sales_policy/util';
import { useCountProgressBill, useListProgressBill } from '../util';
import { deleteProgressBill } from '../api';
import { formatNumber } from '@/modules/categories/row_table/util';
import { databaseDate } from '@/lib/convertDate';


const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ bill_code: '' });
    const categories = useListCategoryV2();
    const salePolicies = useListSalePolicyV2();

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} >
            <Inputz value={filter.bill_code} onChange={e => setFilter({ ...filter, bill_code: e.target.value })} placeholder="Tìm kiếm theo mã hợp đồng" />
            <Dropdownz value={filter.category_id} options={categories} placeholder="Chọn dự án"
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })} />
            <Dropdownz value={filter.sale_policy_id} options={salePolicies} placeholder="Chọn CSBH" optionLabel="cb_title"
                onChange={(e) => setFilter({ ...filter, sale_policy_id: e.target.value })} />
        </GridForm>
    )
};

const PaymentProgress = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListProgressBill({ ...paramsPaginator, first: undefined  });
    const totalRecords = useCountProgressBill({ ...paramsPaginator, first: undefined  });

    const BilDataBody = (e) => {
        const bill_data = JSON.parse(e);
        return <Fragment>
            <b style={{ lineHeight: '28px' }}>Ngày cọc: {databaseDate(bill_data.deposit_date, false, 'date')}</b> <br/>
            <b style={{ lineHeight: '28px' }}>Ký HĐMB: {databaseDate(bill_data.contract_signing_date, false, 'date')}</b>
        </Fragment>
    }
    
    const PaymentBody = (e) => {
        return <span>{formatNumber(e.payment) + ((e.type_payment === 2) ? ' %' : ' VNĐ')}</span>
    }

    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách tiến độ thanh toán' })}
                title="tiến độ thanh toán" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="bill_code" header="Hợp đồng" />
                <Columnz body={e => BilDataBody(e.bill_data)} field="name" header="Ngày cọc / Ký HĐMB" bodyStyle={{ minWidth: '12rem' }} />
                <Columnz field="sale_policy_name" header="CSBH" />
                <Columnz field="payment_progress_name" header="" />
                <Columnz field="payment_stage" header="Đợt thanh toán" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={e => Body(from_types, e.from_type)} header="Tính từ ngày"/>
                <Columnz body={e => <b>{(databaseDate(e.expired_date, false, 'date'))}</b>} header="Ngày tới hạn" bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
                <Columnz body={PaymentBody} header="Thanh toán" bodyStyle={{ textAlign: 'center' }} />
                <Columnz body={e => formatNumber(e.total_payment)} header="Tiền thanh toán (không VAT)" bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="desc" header="Mô tả" />
                <Columnz field="note" header="Ghi chú" />
                <Columnz header="Actions" body={e => ActionBody(e, '/payment_progress/detail', { route: '/payment_progress/delete', action: deleteProgressBill },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center', minWidth: '7rem' }} />
            </DataTablez>
        </div>
    )
}

export default PaymentProgress;