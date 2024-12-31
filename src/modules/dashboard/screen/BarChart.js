import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Calendar, DialogFilter } from './DashBoard';
import { databaseDate } from '@/lib/convertDate';
import { useGetBarData } from '../util';
import { useListUserV2 } from '@/modules/users/user/util';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useListExchange } from '@/modules/companys/exchange/util';
import { useListGroupSaleV2 } from '@/modules/users/group_sale/util';
import { Dropdown } from './DashBoard';

const BarChart = ({ role }) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState({});
    const [dataChart, setChartData] = useState({});
    const [params, setParams] = useState({});
    const [filter, setFilter] = useState({ create_type: '' });
    const data = useGetBarData({ ...params });
    const users = useListUserV2();
    const exchanges = useListExchange();
    const groupSales = useListGroupSaleV2();
    const [scopes, setScopes] = useState({});
    const filters = [
        { name: 'Tất cả', id: '' },
        { name: 'Sale khai thác', id: 2 },
        { name: 'Công ty', id: 1 },
    ];

    useEffect(() => {
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        setFilter({ ...filter, dates: [firstDay, lastDay] });

        const barOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },

                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setOptions({ barOptions });
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
        const labels = ['', '', '', '', '', ''];
        const newData = [];
        const newDataPotential = [];
        if (data && data[0]) {
            data.forEach((d, index) => {
                if ((filter.group_sale_id || filter.user_id_sale) && d && d.user_id_sale) {
                    const user = users.find(u => u.id === d.user_id_sale);
                    if (user && user.name) labels[index] = (user.name);
                } else if (d && d.group_sale_id) {
                    const groupSale = groupSales.find(u => u.id === d.group_sale_id);
                    if (groupSale && groupSale.name) labels[index] = (groupSale.name);
                } else {
                    const exchange = exchanges.find(u => u.id === d.exchange_id);
                    if (exchange && exchange.name) labels[index] = (exchange.name);
                };
                newData.push(d.total);
                newDataPotential.push(d.total_potential);
            });
        };

        const barData = {
            labels: labels,
            datasets: [
                {
                    label: 'Khách hàng phát sinh',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: newData,
                },
                {
                    label: 'Khách hàng tiềm năng',
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    data: newDataPotential,
                }
            ]
        };

        setChartData({ barData });
    }, [data]);

    return (
        <div className="col-12 xl:col-12">
            <div className="card">
                <div className='grid align-items-center mb-4'>
                    <div className='col-12 mb-2 md:col-4 lg:col-5'>
                        <h4>Tổng quan khách hàng</h4>
                    </div>
                    <div className='col-12 mb-2 md:col-2 lg:col-1 text-center'>
                        {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <Button onClick={() => setVisible(true)} icon="pi pi-filter" label="Filter"
                            size="small" className='w-10' style={{ minHeight: '42px' }} />}
                        <Dialog header="Tổng quan khách hàng" visible={visible} position='right' style={{ width: '500px' }}
                            onHide={() => setVisible(false)} draggable={false} resizable={false}>
                            <DialogFilter filter={filter} setFilter={setFilter} setVisible={setVisible} />
                        </Dialog>
                    </div>
                    <Dropdown value={filter.create_type} onChange={e => setFilter({ ...filter, create_type: e.target.value })}
                        className='col-12 md:col-6 lg:col-3' options={filters} plaholder="Tất cả" />
                    <Calendar value={filter.dates} onChange={e => setFilter({ ...filter, dates: e.target.value })}
                        className='col-12 md:col-12 lg:col-3' />
                </div>
                <Chart type="bar" data={dataChart.barData} options={options.barOptions}></Chart>
            </div>
        </div>
    );
};

export default BarChart;
