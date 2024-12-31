import { Chart } from 'primereact/chart';
import React, { useEffect, useState } from 'react';
import { Calendar, DialogFilter } from './DashBoard';
import { useGetLineData } from '../util';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const getWeeks = (today) => {
    function getWeeksInMonth(year, month) {
        // Lấy ngày cuối cùng của tháng
        var lastDayOfMonth = new Date(year, month + 1, 0);

        // Lấy ngày đầu tiên của tháng
        var firstDayOfMonth = new Date(year, month, 1);

        // Tính toán số tuần từ ngày đầu tiên đến ngày cuối cùng
        var numOfWeeks = Math.ceil((lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + firstDayOfMonth.getDay() + 1) / 7);

        return numOfWeeks;
    }

    // Sử dụng hàm để lấy số tuần trong tháng hiện tại
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    var numOfWeeksInCurrentMonth = getWeeksInMonth(currentYear, currentMonth);
    return numOfWeeksInCurrentMonth
}

const LinearChart = ({ role }) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const [options, setOptions] = useState({});
    const [dataChart, setChartData] = useState({});
    const [filter, setFilter] = useState({ date: new Date() });
    const [params, setParams] = useState(null);
    const data = useGetLineData({ ...params });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let year = filter.date.getFullYear();
        let month = filter.date.getMonth() + 1;
        setParams({ ...params, year: year, month: month, ...filter, date: undefined });
    }, [JSON.stringify(filter)]);

    useEffect(() => {
        let newData = [];
        if (filter.date > new Date()) {
            newData = [];
        } else {
            if (data && data.data && data.data[0]) {
                data.data.forEach(d => {
                    newData.push(d.count);
                });
            };
        };

        const weeks = getWeeks(filter.date);
        const labels = [];
        for (let i = 0; i < weeks; i++) {
            labels.push(`Tuần ${i + 1}`);
        };

        const lineData = {
            labels: labels,
            datasets: [
                {
                    label: 'Khách hàng phát sinh',
                    data: newData,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: 0.4
                },
                // {
                //     label: 'Second Dataset',
                //     data: [28, 48, 40, 19, 86, 27, 90],
                //     fill: false,
                //     backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                //     borderColor: documentStyle.getPropertyValue('--primary-200'),
                //     tension: 0.4
                // }
            ]
        };

        setChartData({ ...lineData });
    }, [JSON.stringify(data), JSON.stringify(params)]);

    useEffect(() => {
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const lineOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
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
                    },
                    beginAtZero: true
                }
            }
        };

        setOptions({ lineOptions });
    }, []);

    return (
        <div className="col-12 xl:col-6">
            <div className="card" style={{ minHeight: "520px" }}>
                <div className='grid align-items-center mb-4'>
                    <div className='col-12 mb-2 md:col-4 lg:col-6'>
                        <h5>Tổng quan khách hàng</h5>
                        <span style={{ color: '', fontSize: '14px', fontWeight: '600' }}>Tháng {filter.date.getMonth() + 1} năm {filter.date.getFullYear()} </span>
                    </div>
                    <div className='col-12 mb-2 md:col-2 lg:col-2 text-center'>
                        {role && (role.includes("giamdocsan") || role.includes("truongnhom") || role.includes("truongphong")) && <Button onClick={() => setVisible(true)} icon="pi pi-filter" label="Filter"
                            size="small" className='w-10' style={{ minHeight: '42px' }} />}
                        <Dialog header="Tổng quan khách hàng" visible={visible} position='right' style={{ width: '500px' }}
                            onHide={() => setVisible(false)} draggable={false} resizable={false}>
                            <DialogFilter filter={filter} setFilter={setFilter} setVisible={setVisible} />
                        </Dialog>
                    </div>
                    <Calendar value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })}
                        view="month" dateFormat="mm/yy" className="lg:col-4" selectionMode="single" showButtonBar={false} />
                </div>
                <Chart type="line" data={dataChart} options={options.lineOptions}></Chart>
            </div>
        </div>
    )
};

export default LinearChart;