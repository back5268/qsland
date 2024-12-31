import React, { Fragment, useEffect, useState } from 'react';
import { Timeline } from 'primereact/timeline';
import { useParams } from "react-router-dom";
import { billTypes, statusBill, type_by, useListDiary } from '../utils';
import { Tag } from '@/uiCore';


const XemNhatKy = () => {
    const { id } = useParams();
    const [data, setData] = useState([])
    const diary = useListDiary(id);

    useEffect(() => {
        if (diary && diary[0]) {
            diary.forEach((d, index) => {
                d.index = index + 1
            })
            setData([...diary]);
        }
    }, [diary])

    const getTag = (e) => {
        let title = billTypes.find(s => s.id === e) || {}
        return <Tag value={title.name} severity={title.color}></Tag>;
    };

    const getTitle = (e) => {
        let title = statusBill.find(s => s.id === e) || {}
        return <b style={{ color: '#3B82F6' }}>{title.name || ''}</b>
    };

    const getIcon = (e) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style={{ backgroundColor: '#9C27B0' }}>
                <span>{e}</span>
            </span>
        );
    };

    const getName = (e) => {
        let by = type_by.find(t => t.id === e.type_by) || {}
        return <Fragment>{by.name + ' ' + e.by_name}</Fragment>
    };

    const customizedContent = (item) => {
        return (
            <Fragment>
                <div className="grid formgrid mb-2">
                    <div className="col-12 lg:col-5">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{getTitle(item.status)}</small>
                    </div>
                    <div className="col-12 lg:col-5">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{item.created_at}</small>
                    </div>
                    <div className="col-12 lg:col-2">
                        <small className="text-color-secondary" >{getTag(item.type_bill)}</small>
                    </div>
                </div>
                <div className="grid formgrid mb-2">
                    <div className="col-12 lg:col-8">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{getName(item)}</small>
                    </div>
                </div>
                <div className="grid formgrid mb-2">
                    <div className="col-12 lg:col-8">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>Giá trị: {item.status}</small>
                    </div>
                </div> <hr/>
            </Fragment>
        );
    };

    return (
        <div className="card w-8" style={{ margin: '0 auto', padding: '0 64px' }}>
            <h3 style={{ marginTop: '32px', textAlign: 'center', fontWeight: '700' }}>Nhật ký hợp đồng</h3>
            <h3 style={{ textAlign: 'center', fontWeight: '700' }}><span style={{ color: 'rgb(59, 130, 246)' }}>{id}</span></h3>
            <div style={{ padding: '64px' }}>
                <Timeline value={data} className="w-full mb-4" align="left" opposite={null} marker={e => getIcon(e.index)} content={customizedContent} />
            </div>
        </div>
    )
};

export default XemNhatKy;