import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { addCategory, updateCategory } from "../api";
import { CPL, KBH, MR, useDetailCategory } from "../util";

import { useListCategoryV2 } from '../../category/util';
import { removePropObject } from "@/utils";
import { AddForm, DropdownForm, InputForm, InputSwitchForm, InputTextareaForm } from "@/components/AddForm";
import { RadioButton } from '@/components/RadioButton';
import { classNames } from 'primereact/utils';
import { databaseDate } from '@/lib/convertDate';

const UpdateBuilding = () => {
    const { id } = useParams();
    const categoryInfo = useDetailCategory(id);
    const [infos, setInfos] = useState({
        cb_code: '', cb_title: '', cb_status: true
    });

    useEffect(() => {
        if (categoryInfo.id) setInfos({
            ...categoryInfo, cb_status: categoryInfo.cb_status === -1 ? false : true,
            publication_time: databaseDate(categoryInfo.publication_time)
        });
    }, [categoryInfo]);

    const handleData = () => {
        if (!infos.parent_id) {
            return "Vui lòng chọn dự án"
        };
        if (!infos.row_table_style) {
            return "Vui lòng chọn kiểu bảng hàng"
        }
        if (!infos.lock) {
            return "Vui lòng chọn tình trạng lock"
        }
        if (!infos.assemble) {
            return "Vui lòng chọn tình trạng ráp"
        }
        let info = { ...infos, cb_status: infos.cb_status ? 1 : -1 };
        info = {
            ...removePropObject(info, categoryInfo), id: categoryInfo.id,
            publication_time: databaseDate(infos.publication_time)
        }
        return info
    };

    const categories = useListCategoryV2();

    return (
        <AddForm checkId={Number(id)} title='tòa nhà'
            handleData={handleData} route={Number(id) ? '/building/update' : '/building/add'}
            actions={{ add: addCategory, update: updateCategory }}
            refreshObjects={[setInfos]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <div className="grid formgrid">
                    <div className="col-12 lg:col-6">
                        <InputForm id='cb_code' value={infos.cb_code} label='Mã tòa / Phân khu (*)'
                            onChange={(e) => setInfos({ ...infos, cb_code: e.target.value })} required type='code' />
                        <InputForm id='cb_title' value={infos.cb_title} label='Tên tòa / phân khu (*)'
                            onChange={(e) => setInfos({ ...infos, cb_title: e.target.value })} required />
                        <DropdownForm label='Thuộc dự án (*)' value={infos.parent_id} options={categories}
                            onChange={(e) => setInfos({ ...infos, parent_id: e.target.value })} />
                        <div className="flex align-items-center mb-3">
                            <label className="block text-900 font-medium w-3 mr-2">Kiểu bảng hàng (*)</label>
                            <RadioButton className="flex-column" data={KBH} value={infos.row_table_style}
                                onChange={e => setInfos({ ...infos, row_table_style: e })} />
                        </div>
                        <div className="flex align-items-center mb-3">
                            <label className="block text-900 font-medium w-3 mr-2">Mở lock (*)</label>
                            <RadioButton className="flex-column" data={CPL} value={infos.lock}
                                onChange={e => setInfos({ ...infos, lock: e })} />
                        </div>
                        <div className="flex align-items-center mb-3">
                            <label className="block text-900 font-medium w-3 mr-2">Mở ráp (*)</label>
                            <RadioButton className="flex-column" data={MR} value={infos.assemble}
                                onChange={e => setInfos({ ...infos, assemble: e })} />
                        </div>
                    </div>
                    <div className="col-12 lg:col-6">
                        <InputTextareaForm id='handover_documents' value={infos.handover_documents} label='Tài liệu bàn giao'
                            onChange={(e) => setInfos({ ...infos, handover_documents: e.target.value })} />
                        <InputForm id='publication_time' value={infos.publication_time} label='Thời gian công bố giá'
                            onChange={(e) => setInfos({ ...infos, publication_time: e.target.value })} type='datetime-local' />
                        <InputSwitchForm checked={infos.cb_status} onChange={(e) => setInfos({ ...infos, cb_status: e.target.value })} />
                    </div>
                </div>
            </div>
        </AddForm>
    )
};

export default UpdateBuilding;
