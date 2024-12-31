import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { databaseDate } from "@/lib/convertDate";

import { useListBuildingV2 } from '@/modules/categories/building/util';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { removePropObject } from "@/utils";

import { AddForm, DropdownForm, InputForm, InputNumber, InputSwitchForm } from "@/components/AddForm";
import { Calendarz } from '@/components/ListForm';
import AddTable, { cellEditor } from '@/components/AddTable';
import { Button, Column } from '@/uiCore';
import { Dropdown } from 'primereact/dropdown';
import { from_types, type_bonus, useDetailSalePolicy } from '../util';
import { addSalePolicy, updateSalePolicy } from '../api';
import { formatNumber } from '@/modules/categories/row_table/util';

const InfoRequired = ({ infos, setInfos, id }) => {
    const categories = useListCategoryV2();
    const buildings = useListBuildingV2();

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className="w-full card">
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <DropdownForm disabled={(Number(id) || false)} label='Dự án (*)' value={infos.category_id}
                        onChange={(e) => setInfos({ ...infos, category_id: e.target.value })} options={categories} />
                    <InputForm disabled={(Number(id) || false)} id='title' value={infos.title} onChange={(e) => setInfos({ ...infos, title: e.target.value })} label='Tên chính sách (*)' required />
                </div>
                <div className="col-12 lg:col-6">
                    <DropdownForm disabled={(Number(id) || false)} label='Tòa nhà' value={infos.building_id}
                        onChange={(e) => setInfos({ ...infos, building_id: e.target.value })} options={buildings} />
                    <div className="flex mb-3 ">
                        <label className="block text-900 font-medium w-3 mr-5">Thời gian áp dụng (*)</label>
                        <Calendarz disabled={(Number(id) || false)} value={infos.dates} onChange={(e) => setInfos({ ...infos, dates: e.target.value })} className="w-9" />
                    </div>
                    <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                </div>
            </div>
        </div>
    )
};

const typePaymentBody = (e) => {
    let name = '';
    type_bonus.forEach(t => {
        if (e === t.id) name = t.name;
    })
    return <Fragment>{name}</Fragment>
};

const fromTypeBody = (e) => {
    let name = '';
    e = Number(e);
    from_types.forEach(t => {
        if (e === t.id) name = t.name;
    })
    return <Fragment>{name}</Fragment>
};


const EndowInfo = (props) => {
    const { data, setData, id } = props;

    const handleSetData = (rowIndex, field, value) => {
        let newData = data;
        if (rowIndex) {
            newData.forEach(n => {
                if (n.idz === Number(rowIndex)) {
                    n[field] = value;
                }
            })
        };
        setData([...newData]);
    };

    return (
        <div className="w-full card mt-6">
            <h5 className="mb-4">Chương trình ưu đãi</h5>
            <AddTable data={data} setData={setData} disabled={(Number(id) || false)}>
                <Column field='title' header="Tên tiêu chí" style={{ width: '25%' }}
                    editor={!(Number(id) || false) ? (options) => cellEditor(options, handleSetData, data) : false} />
                <Column field='desc' header="Mô tả" style={{ width: '25%' }}
                    editor={!(Number(id) || false) ? (options) => cellEditor(options, handleSetData, data) : false} />
                <Column field='total' header="Ưu đãi" style={{ width: '25%' }} body={e => formatNumber(e.total)}
                    editor={!(Number(id) || false) ? (options) => cellEditor(options, handleSetData, data) : false} />
                <Column field="type_payment" body={e => typePaymentBody(e.type_payment)} header="Hình thức áp dụng (%/vnđ)" style={{ width: '25%' }}
                    editor={!(Number(id) || false) ? (options) => cellEditor(options, handleSetData, data) : false} />
            </AddTable>
        </div>
    )
};

const PaymentPlan = (props) => {
    const { data, setData, handleDeleteRow, idz, id } = props;

    const handleSetData = (rowIndex, field, value) => {
        let newData = data.payment_progress_details;
        if (rowIndex) {
            newData.forEach(n => {
                if (n.idz === Number(rowIndex)) {
                    n[field] = value;
                }
            })
        };
        setData(newData, idz);
    };

    return (
        <div className='card'>
            <div className="grid formgrid">
                <div className="col-12 lg:col-8">
                    <InputForm disabled={data.disabled} id='titlePayment' value={data.title} onChange={(e) => setData({ title: e.target.value }, idz)} label='Tên phương án (*)' required />
                    <InputForm disabled={data.disabled} id='codePayment' value={data.code} onChange={(e) => setData({ code: e.target.value }, idz)} label='Mã phương án (*)' type='code' required />
                    <div className="flex mb-1 change-disabled">
                        <label htmlFor="bonus" className="block mt-2 text-900 font-medium w-5">Ưu đãi (*)</label>
                        <InputNumber disabled={data.disabled} id="bonus" placeholder="Nhập ưu đãi (*)" className="w-full mr-4" value={data.bonus}
                            handleChange={(e) => setData({ bonus: e }, idz)} />
                        <Dropdown disabled={data.disabled} className="w-9 ml-4" options={type_bonus} optionLabel="name" optionValue="id" style={{ maxHeight: '48px' }}
                            value={data.type_bonus} onChange={e => setData({ type_bonus: e.target.value }, idz)} placeholder='Hình thức áp dụng (%/vnđ)' />
                    </div>
                </div>
                <div className="col-12 lg:col-4">
                    {!data.disabled && <Button type='button' onClick={() => handleDeleteRow(idz)} severity="danger" label='Xóa phương án' size="small" />}
                </div>
            </div>
            <AddTable data={data.payment_progress_details} setData={(e, id) => setData(e, id)} index={idz} >
                <Column header="Đợt thanh toán" body={(data, options) => options.rowIndex + 1} style={{ width: '8%' }} />
                <Column field='expired_time_paid' header="Thời hạn thanh toán (tính theo ngày)" style={{ width: '16%' }}
                    editor={(options) => cellEditor(options, handleSetData, data.payment_progress_details)} />
                <Column field="from_type" body={e => fromTypeBody(e.from_type)} header="Tính từ ngày" style={{ width: '16%' }}
                    editor={(options) => cellEditor(options, handleSetData, data.payment_progress_details)} />
                <Column field='desc' header="Mô tả" style={{ width: '16%' }}
                    editor={(options) => cellEditor(options, handleSetData, data.payment_progress_details)} />
                <Column field='total' header="Thanh toán" style={{ width: '12%' }} body={e => formatNumber(e.total)}
                    editor={(options) => cellEditor(options, handleSetData, data.payment_progress_details)} />
                <Column field="type_payment" body={e => typePaymentBody(e.type_payment)} header="%/vnđ" style={{ width: '12%' }}
                    editor={(options) => cellEditor(options, handleSetData, data.payment_progress_details)} />
                <Column field='note' header="Ghi chú" style={{ width: '16%' }}
                    editor={(options) => cellEditor(options, handleSetData, data.payment_progress_details)} />
            </AddTable>
        </div>
    )
};

const MoreInfo = (props) => {
    const { data, setData, id } = props;
    const handleAddRow = () => {
        let idz = data[0] ? data[data.length - 1].idz + 1 : 1;
        setData([...data, { idz: idz, payment_progress_details: [] }]);
    };

    const handleDeleteRow = (idz) => {
        setData(data.filter(d => d.idz !== idz));
    };

    const handleSetData = (value, idz) => {
        const newData = [];
        if (value && (value[0] || (JSON.stringify(value) === JSON.stringify([])))) {
            value = { payment_progress_details: value };
        };
        data.forEach(d => {
            if (d.idz === idz) {
                newData.push({ ...d, ...value });
            } else {
                newData.push(d);
            }
        })
        setData([...newData]);
    };

    return (
        <div className="w-full card mt-6">
            <h5 className="mb-4">Phương án thanh toán</h5>
            {data.map((d, index) => {
                return <PaymentPlan id={id} key={index} data={d} setData={(data, idz) => handleSetData(data, idz)} handleDeleteRow={handleDeleteRow} idz={d.idz} />;
            })}
            <div className='flex justify-content-center'>
                <Button type='button' onClick={handleAddRow} label='Thêm phương án thanh toán' size="small" />
            </div>
        </div>
    )
};

const UpdateSalesPolicy = () => {
    const { id } = useParams();
    const detailSalePolicy = useDetailSalePolicy(id && ((Number(id)) || Number(id.split('_duplicate')[0])));
    const [dataEndow, setDataEndow] = useState([]);
    const [dataPayment, setDataPayment] = useState([]);
    const [infos, setInfos] = useState({ status: true, code: '', title: '' });

    useEffect(() => {
        if (id && detailSalePolicy.id) {
            setInfos({
                ...detailSalePolicy, status: detailSalePolicy.status === 0 ? false : true,
                dates: databaseDate(detailSalePolicy.from_date) && [new Date(databaseDate(detailSalePolicy.from_date)),
                databaseDate(detailSalePolicy.to_date) && new Date(databaseDate(detailSalePolicy.to_date))]
            });
            let newDataEndow = detailSalePolicy.incentives;
            newDataEndow.forEach(n => {
                if (n.id) n.idz = n.id;
            })
            let newDataPayment = detailSalePolicy.process_payment;
            newDataPayment.forEach(n => {
                if ((Number(id) || false)) n.disabled = true
                if (n.id) n.idz = n.id;
                if (n.payment_progress_details && n.payment_progress_details) {
                    n.payment_progress_details.forEach(d => {
                        if (d.id) d.idz = d.id;
                    })
                }
            })
            setDataEndow(newDataEndow);
            setDataPayment(newDataPayment);
        };
    }, [detailSalePolicy]);

    const handleData = () => {
        let newPayment = dataPayment;
        let newDataEndow = dataEndow;
        if ((Number(id) || false)) {
            if (JSON.stringify(detailSalePolicy.incentives) === JSON.stringify(newDataEndow)) newDataEndow = [];
            else {
                if (id && newDataEndow) {
                    const foundElement = detailSalePolicy.incentives.filter(d => !dataEndow.some(n => n.id === d.id));
                    if (foundElement && foundElement[0]) {
                        foundElement.forEach(f => {
                            newDataEndow.push({ id: f.id, deleted_at: 1 });
                        });
                    };
                    detailSalePolicy.incentives.forEach(d => {
                        newDataEndow.forEach((n, index) => {
                            if (n.id === d.id) {
                                if (JSON.stringify(n) === JSON.stringify(d)) newDataEndow.splice(index, 1);
                                else {
                                    newDataEndow.splice(index, 1);
                                    newDataEndow.push({ ...removePropObject(n, d), id: d.id });
                                }
                            };
                        })
                    })
                };
            }

            if (JSON.stringify(detailSalePolicy.process_payment) === JSON.stringify(newPayment)) newPayment = [];
            else {
                if (id && newPayment) {
                    const foundElement = detailSalePolicy.process_payment.filter(d => !dataPayment.some(n => n.id === d.id));
                    if (foundElement && foundElement[0]) {
                        foundElement.forEach(f => {
                            newPayment.push({ id: f.id, deleted_at: 1 });
                        });
                    };
                    detailSalePolicy.process_payment.forEach(d => {
                        newPayment.forEach((n, index) => {
                            if (n.id === d.id) {
                                if (JSON.stringify(n) === JSON.stringify(d)) newPayment.splice(index, 1);
                                else {
                                    let propUpdate = { ...removePropObject(n, d) };
                                    if (propUpdate.payment_progress_details) {
                                        const foundElement = d.payment_progress_details.filter(d => !propUpdate.payment_progress_details.some(n => n.id === d.id));
                                        if (foundElement && foundElement[0]) {
                                            foundElement.forEach(f => {
                                                propUpdate.payment_progress_details.push({ id: f.id, deleted_at: 1 });
                                            });
                                        };
                                    };

                                    if (propUpdate.payment_progress_details) {
                                        d.payment_progress_details.forEach(pgd => {
                                            propUpdate.payment_progress_details.forEach((pu, index) => {
                                                if (pu.id === pgd.id) {
                                                    if (JSON.stringify(pgd) === JSON.stringify(pu)) propUpdate.payment_progress_details.splice(index, 1);
                                                } else {
                                                    propUpdate.payment_progress_details.splice(index, 1);
                                                    propUpdate.payment_progress_details.push({ ...removePropObject(pu, pgd), id: pgd.id });
                                                };
                                            });
                                        });
                                    }
                                    newPayment.splice(index, 1);
                                    newPayment.push({ ...propUpdate, id: d.id });
                                };
                            };
                        })
                    })
                };
            };
        }

        let info = {
            ...infos, status: infos.status ? 1 : 0, incentives: newDataEndow, from_date: infos.dates && databaseDate(infos.dates[0]),
            to_date: infos.dates && databaseDate(infos.dates[1]), dates: undefined, process_payment: newPayment
        };

        if ((Number(id) || false)) {
            info = {
                ...removePropObject(info, detailSalePolicy), id: (Number(id) || false),
            };
        }
        if (!(Number(id) || false) && !info.from_date) {
            return "Vui lòng chọn thời gian áp dụng chính sách"
        }
        return info
    };

    return (
        <AddForm checkId={(Number(id) || false)} title='chính sách bán hàng'
            handleData={handleData} route={(Number(id) || false) ? '/sale_policy/update' : '/sale_policy/add'}
            actions={{ add: addSalePolicy, update: updateSalePolicy }}
            refreshObjects={[setInfos, setDataEndow, setDataPayment]} >
            <InfoRequired id={id} infos={infos} setInfos={setInfos} />
            <EndowInfo id={id} data={dataEndow} setData={setDataEndow} />
            <MoreInfo id={id} data={dataPayment} setData={setDataPayment} />
        </AddForm>
    )
}

export default UpdateSalesPolicy;