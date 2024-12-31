import React, { useState } from 'react';
import { Inputz, GridForm, Dropdownz } from '@/components/ListForm';
import {RenderHeader, ActionBody, Columnz, DataTablez, StatusBody, Body, useGetParams} from "@/components/DataTable";

import { deleteCategory, updateCategory } from '../api';
import { useListCategory, useCountCategory, GD, LDA, LH } from "../util";
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { listToast } from '@/utils';
import { useListCampaign } from '@/modules/customers/campaign/util';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ cb_title: '' });

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter}>
            <Inputz value={filter.cb_title} onChange={e => setFilter({ ...filter, cb_title: e.target.value })}
                placeholder="Tìm kiếm theo tên, mã dự án" />
            <Dropdownz value={filter.stage} options={GD} placeholder="Giai đoạn"
                onChange={(e) => setFilter({ ...filter, stage: e.target.value })} />
            <Dropdownz value={filter.type_project} options={LDA} placeholder="Loại dự án"
                onChange={(e) => setFilter({ ...filter, type_project: e.target.value })} />
        </GridForm>
    )
};

const Categorys = () => {
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const customers = useListCategory({ cb_status: undefined, ...paramsPaginator, first: undefined });
    const totalRecords = useCountCategory({ cb_status: undefined, ...paramsPaginator, first: undefined });
    const [categoryDelete, setCategoryDelete] = useState(null);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const campains = useListCampaign({ category_id: categoryDelete, status: undefined });

    async function accept() {
        const res = await deleteCategory({ id: categoryDelete });
        if (res.data.status) {
            dispatch(showToast({ ...listToast[0], detail: 'Xóa dự án thành công!' }));
            setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
            setVisible(false)
        } else {
            dispatch(showToast({ ...listToast[1], detail: res.data.mess }));
        }
    };

    return (
        <div className="card">
            <Dialog header="Xóa dự án" visible={visible} position='top' style={{ width: '500px' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <div className='text-center mt-2'>
                    {(campains && campains[0]) ? <b style={{ color: 'red', fontSize: '18px' }}>Dự án này đang có trong một số chiến dịch, bạn có chắc chắc muốn xóa?</b>
                        : <span style={{ fontSize: '18px' }}>Bạn có chắc chắn muốn xóa dự án này?</span>}
                </div>
                <div className='flex mt-6 justify-content-center'>
                    <Button onClick={() => setVisible(false)} label="Bỏ qua" size="small" severity="secondary" />
                    <Button onClick={accept} label="Xác nhận" size="small" className='ml-2' />
                </div>
            </Dialog>
            <Header paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách dự án', add: '/project/add' })}
                title="dự án" totalRecords={totalRecords} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Columnz field="cb_id" header="Id" />
                <Columnz field="cb_code" header="Mã dự án" />
                <Columnz field="cb_title" header="Tên dự án" />
                <Columnz body={e => Body(LDA, e.type_project)} header="Loại dự án" />
                <Columnz body={e => Body(LH, e.type_product)} header="Loại hình" />
                <Columnz body={e => Body(GD, e.stage)} header="Giai đoạn" />
                <Columnz field="investor_name" header="Chủ đầu tư" />
                <Columnz header="Trạng thái" body={e => StatusBody(e,
                    { route: '/project/update', action: updateCategory })} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={(e) => ActionBody(e, '/project/detail',
                    { route: '/project/delete', options: () => { setVisible(true); setCategoryDelete(e.id) } })}
                    bodyStyle={{ textAlign: 'center', minWidth: '8rem' }} />
            </DataTablez>
        </div>
    )
}

export default Categorys;