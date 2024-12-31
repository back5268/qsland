import React, { Fragment, useEffect, useState } from 'react';
import { Calendar, DialogFilter } from './DashBoard';
import { useGetSaleData } from '../util';
import { databaseDate } from '@/lib/convertDate';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTablez } from '@/components/DataTable';
import { Column } from 'primereact/column';
import { formatNumber } from '@/modules/categories/row_table/util';

const SaleChart = ({ role }) => {
    const [dataChart, setDataChart] = useState([]);
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({});
    const [totalRecords, setTotalRecords] = useState(null);
    const [total, setTotal] = useState(null);
    const [params, setParams] = useState({ page: 1, limit: 10, first: 0, render: false });
    const data = useGetSaleData({ ...params, first: undefined });

    useEffect(() => {
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        setFilter({ ...filter, dates: [firstDay, lastDay] });
    }, [])

    useEffect(() => {
        const newParams = {};
        if (filter.dates) {
            if (filter.dates[0]) {
                newParams.from = databaseDate(filter.dates[0]);
                if (filter.dates[1]) newParams.to = databaseDate(filter.dates[1]);
            };
        };
        if (newParams.from && !newParams.to) newParams.to = databaseDate(filter.dates[0], true);
        if (newParams.from && newParams.to) setParams({ ...params, ...newParams, ...filter, dates: undefined });
    }, [JSON.stringify(filter)]);

    useEffect(() => {
        if (data) {
            setTotal(data.total)
            setDataChart(data.data)
            setTotalRecords(data.total_record)
        }
    }, [JSON.stringify(data)]);

    return (
        <div className="col-12 xl:col-6">
            <div className="card flex flex-column align-items-center" style={{ minHeight: "600px" }}>
                <div className='grid align-items-center w-full' style={{ marginTop: '0' }}>
                    <div className='col-12 mb-2 md:col-4 lg:col-6'>
                        <h4>Báo cáo doanh thu</h4>
                    </div>
                    <div className='col-12 mb-2 md:col-2 lg:col-2 text-center'>
                        {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <Button onClick={() => setVisible(true)} icon="pi pi-filter" label="Filter"
                            size="small" className='w-10' style={{ minHeight: '42px' }} />}
                        <Dialog header="Báo cáo doanh thu" visible={visible} position='right' style={{ width: '500px' }}
                            onHide={() => setVisible(false)} draggable={false} resizable={false}>
                            <DialogFilter filter={filter} setFilter={setFilter} setVisible={setVisible} filterByCate={true} />
                        </Dialog>
                    </div>
                    <Calendar value={filter.dates} onChange={e => setFilter({ ...filter, dates: e.target.value })} className='lg:col-4' />
                </div>
                <h5 className="w-full text-right" style={{ color: 'red' }}>Tổng số: {totalRecords} sản phẩm, {total / 1000000} triệu doanh thu </h5>
                <div className='card w-full'>
                    <DataTablez value={dataChart} title="giao dịch" totalRecords={totalRecords} rowsPerPageOptions={[10]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" 
                        paramsPaginator={params} setParamsPaginator={setParams} hidden={true} >
                        <Column field="category_name" header="Dự án" />
                        <Column field="product_bds" header="Sản phẩm" bodyStyle={{ textAlign: 'center' }} />
                        <Column body={e => <Fragment>{formatNumber(e.total_sum / 1000000)}</Fragment>} header="Doanh thu (triệu)" bodyStyle={{ textAlign: 'center' }} />
                        <Column field="sale_name" header="Sale" />
                    </DataTablez>
                </div>
            </div>
        </div>
    );
};

export default SaleChart;
