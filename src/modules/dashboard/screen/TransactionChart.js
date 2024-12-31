import React, { useEffect, useState } from 'react';
import { Calendar, DialogFilter } from './DashBoard';
import { useGetTransactionData } from '../util';
import { databaseDate } from '@/lib/convertDate';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTablez } from '@/components/DataTable';
import { Column } from 'primereact/column';

const ProgressBar = ({ color, ratio }) => {
    return <div style={{ width: ratio *100 + '%', backgroundColor: color, height: '12px', borderRadius: '8px' }}></div>
}

const TransactionChart = ({ role }) => {
    const [dataChart, setDataChart] = useState([]);
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({});
    const [totalRecords, setTotalRecords] = useState(null);
    const [params, setParams] = useState({ page: 1, limit: 10, first: 0, render: false });
    const data = useGetTransactionData({ ...params, first: undefined });

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
        if (data.data && data.data[0]) {
            const newData = [];
            const datas = data.data
            datas.sort((a, b) => b.total_bill - a.total_bill)
            const maxValueBill = data.maxValueBill || 1
            const maxValue = data.maxValue || 1
            datas.forEach(d => {
                newData.push({ ...d, total_bill: Number(d.total_bill), total_sum: Number(d.total_sum) / 1000000000, 
                    progress_bill: (Number(d.total_bill) / maxValueBill), progress_sum: (Number(d.total_sum) / maxValue) });
            })
            setDataChart([ ...newData ])
            setTotalRecords(data.count)
        }
    }, [JSON.stringify(data)]);

    const TransactionBody = (total, progress, color) => {
        return <div style={{ textAlign: 'center' }}>
            <span>{total}</span>
            <ProgressBar ratio={progress} color={color} />
        </div>
    }

    return (
        <div className="col-12 xl:col-6">
            <div className="card flex flex-column align-items-center" style={{ minHeight: "600px" }}>
                <div className='grid align-items-center w-full' style={{ marginTop: '0' }}>
                    <div className='col-12 mb-2 md:col-4 lg:col-6'>
                        <h4>Báo cáo giao dịch</h4>
                    </div>
                    <div className='col-12 mb-2 md:col-2 lg:col-2 text-center'>
                        {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <Button onClick={() => setVisible(true)} icon="pi pi-filter" label="Filter"
                            size="small" className='w-10' style={{ minHeight: '42px' }} />}
                        <Dialog header="Báo cáo giao dịch" visible={visible} position='right' style={{ width: '500px' }}
                            onHide={() => setVisible(false)} draggable={false} resizable={false}>
                            <DialogFilter filter={filter} setFilter={setFilter} setVisible={setVisible} />
                        </Dialog>
                    </div>
                    <Calendar value={filter.dates} onChange={e => setFilter({ ...filter, dates: e.target.value })} className='lg:col-4' />
                </div>
                <div className='card w-full'>
                    <DataTablez value={dataChart} title="giao dịch" totalRecords={totalRecords} rowsPerPageOptions={[10]}
                    dataKey={(dataChart[0] && dataChart[0].exchange_id) ? "exchange_id" : ((dataChart[0] && dataChart[0].group_sale_id) ? "group_sale_id" : "user_sale_id")}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        paramsPaginator={params} setParamsPaginator={setParams} hidden={true} >
                        <Column field="name" header="Đơn vị" />
                        <Column body={e => TransactionBody(e.total_bill, e.progress_bill, '#6366F1')} header="Số giao dịch" bodyStyle={{ minWidth: "8rem" }} />
                        <Column body={e => TransactionBody(e.total_sum, e.progress_sum, '#EF4444')} header="Doanh thu (tỷ)" bodyStyle={{ minWidth: "8rem" }} />
                    </DataTablez>
                </div>
            </div>
        </div>
    );
};

export default TransactionChart;
