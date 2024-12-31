import React, { Fragment, useState } from 'react';
import { Inputz, GridForm, Dropdownz, Calendarz } from '@/components/ListForm';
import {RenderHeader, Columnz, DataTablez, TimeBody, useGetParams} from "@/components/DataTable";
import { useListRequired, useCountRequired } from '../utils';
import { databaseDate } from '@/lib/convertDate';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListBuildingV2 } from '@/modules/categories/building/util';
import { useListExchange } from '@/modules/companys/exchange/util';
import { useListGroupSaleV2 } from '@/modules/users/group_sale/util';
import { useListUser } from '@/modules/users/user/util';
import { statusTransasion } from '../utils';
import { getSale } from '@/utils';
import { formatNumber } from '@/modules/categories/row_table/util';
import Tag from '@/components/Tag';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });
    const categories = useListCategoryV2();
    const buildings = useListBuildingV2({ parent_id: filter.category_id });
    const exchanges = useListExchange();
    const groupSales = useListGroupSaleV2({ exchange_id: filter.exchange_id });
    const users = useListUser({ exchange_id: filter.exchange_id, group_sale_id: filter.group_sale_id });

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
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-12">
            <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })}
                placeholder="Nhập mã sản phẩm, BĐS thực tế" />
            <Dropdownz value={filter.category_id} options={categories}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })}
                placeholder="Chọn dự án" />
            <Dropdownz value={filter.building_id} options={buildings} placeholder="Chọn tòa"
                onChange={(e) => setFilter({ ...filter, building_id: e.target.value })}/>
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
            <Dropdownz value={filter.exchange_id} options={exchanges} placeholder="Chọn phòng ban"
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value, group_sale_id: undefined, user_sale_id: undefined })} />
            <Dropdownz value={filter.group_sale_id} options={groupSales} placeholder="Chọn nhóm sale"
                onChange={(e) => setFilter({ ...filter, group_sale_id: e.target.value, user_sale_id: undefined })} />
            <Dropdownz value={filter.user_sale_id} options={getSale(users)}
                onChange={(e) => setFilter({ ...filter, user_sale_id: e.target.value })}
                optionLabel="full_name" placeholder="Chọn nhân viên" />
            <Dropdownz value={filter.status} options={statusTransasion}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} placeholder="Trạng thái" />
        </GridForm>
    )
};

const Request = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListRequired({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountRequired({ ...paramsPaginator, first: undefined });

    const StatusBody = (e) => {
        let status = {};
        statusTransasion.forEach(s => {
            if (e.status === s.id) status = s;
        });
        return <Tag value={status.name} severity={status.color}></Tag>
    };

    const SaleBody = (e) => {
        return <Fragment><span>{e.sale_name}</span> <br/><span>Sàn: {e.exchange_name}</span> </Fragment>
    };

    const DiaryBody = (e) => {
        const log_data = e.log_data;
        if (log_data && log_data[0]) {
            return <span>
                {log_data.map((l, index) => {
                    let value = ''
                    let status = ''
                    statusTransasion.forEach(s => {
                        if (l.status === s.id) {
                            value = s.value;
                            status = s.name
                        }
                    })
                    return <span key={index}> <b>{l.sale_name}</b> {status + ' - Thời gian: ' + l.created_at  + ' - Giá trị: ' + value}<br/></span>
                })}
            </span>
        }
    };

    const header = RenderHeader({ title: 'Danh sách yêu cầu' });
    return (
        <div className="card">
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={header} title="yêu cầu" totalRecords={totalRecords}
                paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz body={SaleBody} header="Nhân viên" bodyStyle={{ minWidth: '10rem' }} />
                <Columnz field="product_code" header="Sản phẩm" bodyStyle={{ textAlign: 'center', minWidth: '10rem' }} />
                <Columnz field="product_bds" header="BĐS thực tế" bodyStyle={{ textAlign: 'center', minWidth: '10rem' }} />
                <Columnz body={e => formatNumber(e.total)} header="Số tiền yêu cầu" bodyStyle={{ textAlign: 'center', minWidth: '10rem' }} />
                <Columnz body={DiaryBody} header="Nhật ký" bodyStyle={{ minWidth: '20rem' }} />
                <Columnz body={e => TimeBody(e.created_at)} header="Thời gian tạo" bodyStyle={{ textAlign: 'center', minWidth: '9rem' }} />
                <Columnz body={e => TimeBody(e.updated_at)} header="Thời gian cập nhật" bodyStyle={{ textAlign: 'center', minWidth: '9rem' }} />
                <Columnz body={StatusBody} header="Trạng thái" bodyStyle={{ textAlign: 'center', minWidth: '10rem' }} />
            </DataTablez>
        </div>
    )
}

export default Request;