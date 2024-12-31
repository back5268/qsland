import { Chart } from 'primereact/chart';
import React, { Fragment, useEffect, useState } from 'react';
import { Calendar, DialogFilter, Dropdown } from './DashBoard';
import { SelectButton } from 'primereact/selectbutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useGetPieData } from '../util';
import { databaseDate } from '@/lib/convertDate';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const filters = [
    { name: 'Tất cả', id: '' },
    { name: 'Sale khai thác', id: 2 },
    { name: 'Công ty', id: 1 },
];

const PieChart = ({ role }) => {
    const [scopes, setScopes] = useState({});
    const [options, setOptions] = useState({});
    const [dataChart, setChartData] = useState({});
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState({ create_type: '' });
    const option = ['Biểu đồ', 'Chi tiết'];
    const [value, setValue] = useState(option[0]);
    const [products, setProducts] = useState([]);
    const [params, setParams] = useState({});
    const data = useGetPieData({ ...params });
    const labels = ['KH Mới', 'Đang liên hệ', 'Đang chăm sóc', 'Tiếp cận', 'Tiềm năng', 'Không nhu cầu', 'Giao Dịch', 'Khách hàng thân thiết cấp 1', 'Khách hàng thân thiết cấp 2', 'Khách hàng thân thiết cấp 3'];

    // { name: 'Khách hàng thân thiết cấp 1', id: 8 },
    // { name: 'Khách hàng thân thiết cấp 2', id: 9 },
    // { name: 'Khách hàng thân thiết cấp 3', id: 10 },
    const backgroundColor = ['#E53030', '#E26900', '#A702DF', '#019689', '#03CB03', '#545B5D', '#BE980F', '#BE980F', '#BE980F', '#BE980F'];
    // const documentStyle = getComputedStyle(document.documentElement);
    // const backgroundColor = [
    //     documentStyle.getPropertyValue('--bluegray-500'),
    //     documentStyle.getPropertyValue('--primary-500'),
    //     documentStyle.getPropertyValue('--blue-500'),
    //     documentStyle.getPropertyValue('--green-500'),
    //     documentStyle.getPropertyValue('--orange-500'),
    //     documentStyle.getPropertyValue('--cyan-500'),
    //     documentStyle.getPropertyValue('--red-500'),
    //     documentStyle.getPropertyValue('--teal-500'),
    // ];
    // const hoverBackgroundColor = [
    //     documentStyle.getPropertyValue('--bluegray-400'),
    //     documentStyle.getPropertyValue('--primary-400'),
    //     documentStyle.getPropertyValue('--blue-400'),
    //     documentStyle.getPropertyValue('--green-400'),
    //     documentStyle.getPropertyValue('--orange-400'),
    //     documentStyle.getPropertyValue('--cyan-400'),
    //     documentStyle.getPropertyValue('--red-400'),
    //     documentStyle.getPropertyValue('--teal-400'),
    // ];

    useEffect(() => {
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        setFilter({ ...filter, dates: [firstDay, lastDay] });

        const pieOptions = {
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                    }
                }
            },
        };

        setOptions({ pieOptions });
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
        if (newParams.from && newParams.to) setParams({ ...newParams, ...filter, dates: undefined });
    }, [JSON.stringify(filter)]);

    useEffect(() => {
        const newProducts = [];
        let total = data.reduce((a, b) => {
            return a + b.count;
        }, 0);
        const newData = [0, 0, 0, 0, 0, 0, 0];
        if (data && data[0]) {
            data.forEach(d => {
                if (d.status) {
                    newData[d.status - 1] = d.count;
                    newProducts.push({ status: d.status, count: d.count, ratio: Number((d.count / total * 100).toFixed(2)) + "%" })
                };
            })
        };
        if (newProducts && newProducts[0]) newProducts.push({ status: "Tổng cộng:", count: total, ratio: '100%' });
        setProducts([...newProducts]);

        const pieData = {
            labels: labels,
            datasets: [
                {
                    data: newData,
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: backgroundColor,
                }
            ]
        };
        setChartData({ pieData });
    }, [data]);

    const StatusBody = (e) => {
        if (Number(e.status)) return (
            <div className='flex gap-2 align-items-center'>
                <div style={{ height: '12px', width: '12px', backgroundColor: backgroundColor[e.status - 1], borderRadius: '50%' }}></div>
                <span>{labels[e.status - 1]}</span>
            </div>
        )
        else return <b>{e.status}</b>
    };

    return (
        <div className="col-12 xl:col-6">
            <div className="card flex flex-column align-items-center" style={{ minHeight: "520px" }}>
                <div className='grid align-items-center w-full' style={{ marginTop: '0' }}>
                    <div className='col-12 mb-2 md:col-4 lg:col-4'>
                        <SelectButton value={value} onChange={(e) => setValue(e.value)} options={option} />
                    </div>
                    <div className='col-12 mb-2 md:col-2 lg:col-2 text-center'>
                        {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <Button onClick={() => setVisible(true)} icon="pi pi-filter" label="Filter"
                            size="small" className='w-10' style={{ minHeight: '42px' }} />}
                        <Dialog header="Tổng quan khách hàng" visible={visible} position='right' style={{ width: '500px' }}
                            onHide={() => setVisible(false)} draggable={false} resizable={false}>
                            <DialogFilter filter={filter} setFilter={setFilter} setVisible={setVisible} />
                        </Dialog>
                    </div>
                    <Dropdown value={filter.create_type} onChange={e => setFilter({ ...filter, create_type: e.target.value })}
                        className='col-12 md:col-6 lg:col-3' options={filters} plaholder="Tất cả" />
                    <div className=''></div>
                    <Calendar value={filter.dates} onChange={e => setFilter({ ...filter, dates: e.target.value })}
                        className='col-12 md:col-12 lg:col-3' />
                </div>
                {(value === option[0]) ? <div style={{ width: '400px', height: '300px', position: 'relative' }}>
                    <Chart type="pie" data={dataChart.pieData} options={options.pieOptions}></Chart>
                    {products && !products[0] && <div style={{ height: '275px', width: '275px', backgroundColor: '#6366F1', position: 'absolute', top: '60px', borderRadius: '50%' }}>
                        <span style={{ position: 'absolute', top: '50%', left: '50%', color: 'white', fontWeight: '500', transform: 'translate(-50%, -50%)' }}>Không có dữ liệu</span>
                    </div>}
                </div>
                    : <div className='card w-full mt-4'>
                        <DataTable showGridlines value={products} >
                            <Column body={StatusBody} header="Tình trạng"></Column>
                            <Column body={e => (e.status === "Tổng cộng:") ? <b>{e.count}</b> : <Fragment>{e.count}</Fragment>} header="Số lượng" bodyStyle={{ textAlign: 'center' }}></Column>
                            <Column body={e => (e.status === "Tổng cộng:") ? <b>{e.ratio}</b> : <Fragment>{e.ratio}</Fragment>} header="Tỷ lệ" bodyStyle={{ textAlign: 'center' }}></Column>
                        </DataTable>
                    </div>}
            </div>
        </div>
    );
};

export default PieChart;
