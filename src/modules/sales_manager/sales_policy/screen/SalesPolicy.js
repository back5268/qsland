import React, { useState } from 'react';
import { Dropdownz, Inputz, Calendarz, GridForm } from '@/components/ListForm';
import {
    StatusBody,
    ActionBody,
    RenderHeader,
    Columnz,
    DataTablez,
    TimeBody,
    useGetParams
} from "@/components/DataTable";
import { useListSalePolicy, useCountSalePolicy } from '../util';
import { updateSalePolicy } from '../api';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListBuildingV2 } from '@/modules/categories/building/util';
import { databaseDate } from '@/lib/convertDate';
import { Dialog } from 'primereact/dialog';
import DeleteSalePolicy from './DeleteSalePolicy';
import { isActives } from '@/modules/users/user/util';
import { useNavigate } from 'react-router-dom';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });
    const categories = useListCategoryV2();
    const buildings = useListBuildingV2({ parent_id: filter.category_id });

    const handleFilter = (filter) => {
        const filters = {
            ...filter, from: filter.dates && databaseDate(filter.dates[0]),
            to: filter.dates && filter.dates[1] ? databaseDate(filter.dates[1], true)
                : filter.dates && databaseDate(filter.dates[0], true), dates: [],
        };
        return filters;
    };

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className="lg:col-9" >
            <Inputz value={filter.key_search} placeholder="Nhập tên chính sách ..."
                onChange={e => setFilter({ ...filter, key_search: e.target.value })} />
            <Dropdownz value={filter.category_id} options={categories} placeholder="Chọn dự án"
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value, building_id: undefined })} />
            <Dropdownz value={filter.building_id} options={buildings} placeholder="Chọn tòa"
                onChange={(e) => setFilter({ ...filter, building_id: e.target.value })} />
            <Dropdownz value={filter.exchange_id} options={isActives} placeholder="Trạng thái"
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value })} />
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
        </GridForm>
    )
};

const SalesPolicy = () => {
    const navigate = useNavigate();
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const [visible, setVisible] = useState(false);
    const [salePolicy, setSalePolicy] = useState(false);
    const data = useListSalePolicy({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountSalePolicy({ ...paramsPaginator, first: undefined });

    const HandleDuplicated = (e) => {
        navigate(`/sale_policy/detail/${e + '_duplicate'}`);
    };

    return (
        <div className="card">
            <Dialog header="Xóa chính sách bán hàng" visible={visible} position='top' style={{ width: '60vw' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <DeleteSalePolicy setVisible={setVisible} salePolicy={salePolicy}
                    paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            </Dialog>
            <Header setParamsPaginator={setParamsPaginator} paramsPaginator={paramsPaginator} />
            <DataTablez value={data} header={RenderHeader({ title: 'Danh sách chính sách', add: '/sale_policy/add' })}
                title="chính sách" paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} totalRecords={totalRecords}>
                <Columnz field="title" header="Chính sách" />
                <Columnz field="code" header="Mã CSBH" />
                <Columnz header="Tòa" field="building_name" />
                <Columnz header="Dự án" field="category_name" />
                <Columnz header="Ngày áp dụng" body={e => TimeBody(e.from_date)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="sale_name" header="Người tạo" />
                <Columnz header="Trạng thái" body={(e) => StatusBody(e,
                    { route: '/sale_policy/update', action: updateSalePolicy })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={e => ActionBody(e, '/sale_policy/detail',
                    { route: '/sale_policy/delete', options: () => { setVisible(true); setSalePolicy(e.id) } },
                    paramsPaginator, setParamsPaginator, (e) => HandleDuplicated(e))}
                    style={{ minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
};

export default SalesPolicy;