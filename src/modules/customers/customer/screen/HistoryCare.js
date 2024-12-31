import { useHistoryCare, useListTransactionHistory } from "../util";
import AddCustomer from "./UpdateCustomer";
import React, { Fragment } from 'react';
import { Timeline } from 'primereact/timeline';
import { TabView, TabPanel } from 'primereact/tabview';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tag } from "@/uiCore";
import { useDetailCustomer, approachForm } from "../util";
import { useListUserV2 } from "@/modules/users/user/util";
import { Button } from "@/uiCore";
import { deleteProgressBill } from "@/modules/sales_manager/payment_progress/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ActionBody } from "@/components/DataTable";
import { formatNumber } from "@/modules/categories/row_table/util";
import { statusBill } from "@/modules/transaction_management/contract/utils";
import { Accordion, AccordionTab } from "primereact/accordion";

const getByDay = (arr) => {
    let result = [];
    let idArrays = {};
    arr.forEach(a => {
        const { created_at } = a;
        const day = created_at ? created_at.split(' ')[0] : '';
        if (!idArrays[day]) {
            idArrays[day] = [];
            result.push(idArrays[day]);
        }
        idArrays[day].push(a);
    });
    return result;
};

const HistoryCare = () => {
    const { id } = useParams();
    const customerInfo = useDetailCustomer(id);
    const [data, setData] = useState([]);
    const [loadMore, setLoadMore] = useState(true);
    const [params, setParams] = useState({
        customer_id: id,
        page: 1,
        limit: 20
    });
    const users = useListUserV2();
    const historyCare = useHistoryCare(params);

    useEffect(() => {
        setData([customerInfo, ...data])
    }, [customerInfo]);

    useEffect(() => {
        setData([...data, ...historyCare]);
    }, [historyCare]);

    const getTag = (e) => {
        let value = {
            value: '',
            severity: 'danger',
        };
        switch (e) {
            case 1:
                value = { value: 'Khách hàng mới', severity: 'info' };
                break;
            case 2:
                value = { value: 'Đang liên hệ', severity: 'info' };
                break;
            case 3:
                value = { value: 'Đang chăm sóc', severity: 'primary' };
                break;
            case 4:
                value = { value: 'Tiếp cận', severity: 'warning' };
                break;
            case 5:
                value = { value: 'Tiềm năng', severity: 'success' };
                break;
            case 6:
                value = { value: 'Không nhu cầu', severity: 'danger' };
                break;
            case 7:
                value = { value: 'Giao dịch', severity: 'success' };
                break;
            case 8:
                value = { value: 'Khách hàng thân thiết cấp 1', severity: 'success' };
                break;
            case 9:
                value = { value: 'Khách hàng thân thiết cấp 1', severity: 'success' };
                break;
            case 10:
                value = { value: 'Khách hàng thân thiết cấp 1', severity: 'success' };
                break;
            default:
                return '';
        };
        return <Tag value={value.value} severity={value.severity}></Tag>;
    };

    const getTitle = (e, userId, createBy, note) => {
        userId = createBy || userId;
        let name = '';
        users.forEach(u => {
            if (u.id === userId) name = u.name;
        });
        switch (e) {
            case 'cham_soc':
                return <span><b style={{ color: '#3B82F6' }}>{name}</b> phản hồi chăm sóc</span>
            case 'phan_bo':
                return <span><b style={{ color: '#3B82F6' }}>{name}</b> nhận được phân bổ{note === 'importDauKy' ? '' : ' tự dộng'}</span>
            case 'thu_hoi':
                return <span><b style={{ color: '#3B82F6' }}>{name}</b> thu hồi khách hàng</span>
            case 'dieu_chuyen':
                return <span><b style={{ color: '#3B82F6' }}>{name}</b> nhận được khách hàng từ admin điều chuyển</span>
            default:
                return <span><b style={{ color: '#3B82F6' }}>{name}</b> thêm mới khách hàng</span>
        };
    };

    const interactiveForm = (interactive_form) => {
        if (interactive_form) return <span>Hình thức tương tác: <b>{approachForm[interactive_form - 1]}</b></span>
    };

    const note = (note) => {
        if (note) return <span>Mô tả chi tiết: {note} </span>
    };

    const getIcon = (e) => {
        let icon = '';
        switch (e.action) {
            case 'cham_soc':
                icon = 'pi pi-send'; break;
            case 'dieu_chuyen':
            case 'phan_bo':
                icon = 'pi pi-user'; break;
            case 'thu_hoi':
                icon = 'pi pi-refresh'; break;
            default:
                icon = 'pi pi-plus'; break;
        };
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
                style={{ backgroundColor: '#9C27B0' }}>
                <i className={icon}></i>
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Fragment>
                <div className="grid formgrid mb-2">
                    <div className="col-12 lg:col-5">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{getTitle(item.action, item.user_id_sale, item.create_by, item.note)}</small>
                    </div>
                    <div className="col-12 lg:col-4">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{item.created_at}</small>
                    </div>
                    <div className="col-12 lg:col-3">
                        {item.interactive_status === 0 ? '' : item.interactive_status &&
                            <small className="text-color-secondary" >{getTag(item.interactive_status)}</small>}
                    </div>
                </div>
                <div className="grid formgrid mb-2">
                    <div className="col-12 lg:col-8">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{interactiveForm(item.interactive_form)}</small>
                    </div>
                </div>
                <div className="grid formgrid mb-4">
                    <div className="col-12 lg:col-8">
                        <small className="text-color-secondary" style={{ fontSize: '16px' }}>{note(item.note)}</small>
                    </div>
                </div>
            </Fragment>
        );
    };

    const showMore = () => {
        setParams({ ...params, page: params.page + 1 });
        if (historyCare.length < params.limit) setLoadMore(false);
    }

    useEffect(() => {
        if (historyCare.length < params.limit) setLoadMore(false);
    }, [])

    return (
        <div className="card w-10" style={{ margin: '0 auto' }}>
            {data[0] && getByDay(data).map((h, index) => {
                return <div key={index}>
                    <Tag className='ml-6' style={{ fontSize: '16px', padding: '0.5rem 1rem' }} value={h[0] && h[0].created_at && h[0].created_at.split(' ')[0]} severity='info'></Tag>
                    <hr />
                    <Timeline value={h} className="w-full mb-4" align="left" opposite={null}
                        marker={getIcon} content={customizedContent} />
                </div>
            })}
            {loadMore ? <div className="w-full flex justify-content-center">
                <Button onClick={showMore} label="Xem thêm" severity="info" size="small" raised />
            </div> : ''}
        </div>
    )
};

const HistoryTransaction = (prop) => {
    const { data, params, setParams } = prop
    const PaymentBody = (e) => {
        return <span>{formatNumber(e.payment) + ((e.type_payment === 2) ? ' %' : ' VNĐ')}</span>
    }

    return (
        <Accordion multiple activeIndex={[0]} className="mb-8">
            {data.map((d, index) => {
                return (
                    <AccordionTab header={"Hợp đồng: " + d.code}>
                        <div style={{ padding: '0 16px' }}>
                            <div className="grid formgrid mb-2 aligin-items-center">
                                <div className="col-12 mb-2 md:col-6 lg:col-3">
                                    Ngày: {d.created_at}
                                </div>
                                <div className="col-12 mb-2 md:col-6 lg:col-3">
                                    Sản phẩm: {d.product_code}
                                </div>
                                <div className="col-12 mb-2 md:col-6 lg:col-3">
                                    Dự án: {d.category_name}
                                </div>
                                <div className="col-12 mb-2 md:col-6 lg:col-3">
                                    Trạng thái: {d.status && statusBill.find(s => s.id === d.status).name}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <DataTable value={d.progress || []} dataKey="id" showGridlines emptyMessage={"Không tìm thấy lịch sử"}>
                                <Column field="payment_stage" header="Đợt thanh toán" bodyStyle={{ textAlign: 'center' }} />
                                <Column field="expired_date" header="Ngày tới hạn" bodyStyle={{ textAlign: 'center' }} />
                                <Column body={PaymentBody} header="Thanh toán" bodyStyle={{ textAlign: 'center' }} />
                                <Column body={e => formatNumber(e.total_payment)} header="Tiền thanh toán (không VAT)" bodyStyle={{ textAlign: 'center' }} />
                                <Column field="desc" header="Mô tả" />
                                <Column field="note" header="Ghi chú" />
                                <Column header="Actions" body={e => ActionBody(e, '/payment_progress/detail', { route: '/payment_progress/delete', action: deleteProgressBill },
                                    params, setParams)} bodyStyle={{ textAlign: 'center' }} />
                            </DataTable>
                        </div>
                    </AccordionTab>
                )
            })}
        </Accordion>
    )
}

const ActionCustomer = () => {
    const { id } = useParams();
    const [params, setParams] = useState({ render: false });
    const data = useListTransactionHistory({ ...params });

    useEffect(() => {
        if (Number(id)) {
            setParams({ ...params, customer_id: id });
        }
    }, [id]);

    return (
        <div className="card">
            <TabView>
                <TabPanel header="Thông tin khách hàng">
                    <AddCustomer />
                </TabPanel>
                <TabPanel header="Lịch sử chăm sóc">
                    <HistoryCare />
                </TabPanel>
                <TabPanel disabled={!(data && data[0])} header="Giao dịch">
                    <HistoryTransaction params={params} setParams={setParams} data={data} />
                </TabPanel>
            </TabView>
        </div>
    )
};

export default ActionCustomer;