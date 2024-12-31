import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { databaseDate } from "@/lib/convertDate";

import { useDetailSaleCampaign } from "../util";
import { updateSaleCampaign, addSaleCampaign } from "../api";

import { DropdownForm, InputForm, InputSwitchForm, AddForm, InputTextareaForm, InputNumber } from "@/components/AddForm";
import { removePropObject } from "@/utils";
import { useListCategoryV2 } from '@/modules/categories/category/util';
import { useListBuildingV2 } from '@/modules/categories/building/util';

const UpdateSaleCampaign = () => {
    const { id } = useParams();
    const SaleCampaignInfo = useDetailSaleCampaign(id);
    const [infos, setInfos] = useState({
        title: '', max: null, time_start: '', time_end: '', total: '', status: true
    });

    const categories = useListCategoryV2();
    const buildings = useListBuildingV2({ parent_id: infos.category_id });

    useEffect(() => {
        if (Number(id)) {
            let newSaleCampaignInfo = { ...infos, ...SaleCampaignInfo };
            newSaleCampaignInfo = {
                ...newSaleCampaignInfo, time_start: databaseDate(newSaleCampaignInfo.time_start, false, 'date'),
                time_end: databaseDate(newSaleCampaignInfo.time_end, false, 'date'),
                status: SaleCampaignInfo.status === 0 ? false : true,
            };
            setInfos(newSaleCampaignInfo);
        }
    }, [SaleCampaignInfo]);

    const handleData = () => {
        if (!infos.category_id) {
            return "Vui lòng chọn dự án"
        };
        let info = {
            ...infos, status: infos.status ? 1 : 0, max: infos.max ? Number(infos.max) : undefined, total: infos.total ? Number(infos.total) : undefined
        };
        if (Number(id)) {
            info = {
                ...removePropObject(info, SaleCampaignInfo), id: Number(id),
            };
        }
        info = { ...info, time_start: databaseDate(info.time_start), time_end: databaseDate(info.time_end) }
        return info
    }

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='chiến dịch bán hàng'
            handleData={handleData} route={Number(id) ? '/sale_campaign/update' : '/sale_campaign/add'}
            actions={{ add: addSaleCampaign, update: updateSaleCampaign }}
            refreshObjects={[setInfos]} >
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <InputForm id='title' value={infos.title} onChange={(e) => setInfos({ ...infos, title: e.target.value })} label='Tên chiến dịch (*)' required />
                <InputNumber id='total' value={infos.total} required
                    handleChange={(e) => setInfos({ ...infos, total: e })} label='Số tiền quy định (*)' />
                <DropdownForm label='Dự án (*)' value={infos.category_id}
                    onChange={(e) => setInfos({ ...infos, category_id: e.target.value })} options={categories} />
                <DropdownForm label='Tòa nhà / Phân khu' value={infos.building_id}
                    onChange={(e) => (setInfos({ ...infos, building_id: e.target.value }))} options={buildings} />
                <InputForm id='max' value={infos.max} onChange={(e) => setInfos({ ...infos, max: e.target.value })} label='Số chỗ tối đa cho phép' type='number' />
                <InputForm id='time_start' value={infos.time_start}
                    onChange={(e) => (setInfos({ ...infos, time_start: e.target.value }))} label='Thời gian bắt đầu' type='date' />
                <InputForm id='time_end' value={infos.time_end}
                    onChange={(e) => (setInfos({ ...infos, time_end: e.target.value }))} label='Thời gian kết thúc' type='date' />
                <InputTextareaForm id='desc' value={infos.desc} label='Mô tả'
                    onChange={(e) => setInfos({ ...infos, desc: e.target.value })} />
                <InputSwitchForm checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
            </div>
        </AddForm>
    )
}

export default UpdateSaleCampaign;
