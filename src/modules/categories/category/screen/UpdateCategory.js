import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UploadImages, UploadImg } from "@/components/UploadImages";
import EditorV2 from "@/components/EditorV2";

import { addCategory, updateCategory } from "../api";
import { GD, LDA, LH, PK, PLDA, useDetailCategory } from "../util";
import { useListCompany } from "@/modules/companys/company/util";
import { useListCity, useListDistrict, useListWard } from "@/utils";
import { removePropObject } from "@/utils";
import { AddForm, DropdownForm, InputForm, InputNumber, InputSwitchForm } from "@/components/AddForm";
import { useListInvestor } from '@/modules/investor/util';

const UpdateCategory = () => {
    const { id } = useParams();
    const categoryInfo = useDetailCategory(id);
    const [avatar, setAvatar] = useState('');
    const [images, setImages] = useState([]);
    const [infos, setInfos] = useState({
        cb_code: '', alias: '', cb_title: '', address: '',
        price_from: '', price_to: '', hidden_cat: true
    });
    const [data, setData] = useState('');

    useEffect(() => {
        if (Number(id)) {
            let newcategoryInfo = {
                ...infos, ...categoryInfo, hidden_cat: categoryInfo.hidden_cat === 0 ? false : true,
                price_from: Number(categoryInfo.price_from), price_to: Number(categoryInfo.price_to),
                keeping_time: (categoryInfo.keeping_time === -1 || !categoryInfo.keeping_time) ? undefined : Number(categoryInfo.keeping_time)
            };
            let newArr = [];
            if (categoryInfo.images) {
                JSON.parse(categoryInfo.images).forEach(c => {
                    newArr.push({ preview: c });
                });
                setImages(newArr);
            };
            setInfos({ ...newcategoryInfo, images: newArr });
            if (categoryInfo.image) setAvatar({ ...avatar, preview: categoryInfo.image });
            if (id && categoryInfo.cb_description) setData(categoryInfo.cb_description);
        }
    }, [categoryInfo]);

    const handleData = () => {
        let info = { ...infos, hidden_cat: infos.hidden_cat ? 1 : 0, cb_description: data, keeping_time: infos.keeping_time ? Number(infos.keeping_time) : -1 };
        if (info.images && info.images[0]) {
            const foundElement = info.images.filter(d => images.some(n => JSON.stringify(n) === JSON.stringify(d)));
            info.images = [];
            if (foundElement && foundElement[0]) {
                foundElement.forEach(f => {
                    info.images.push(f.preview);
                });
            };
        }
        info = {
            ...removePropObject(info, categoryInfo), id: categoryInfo.id,
            gallery: images, avatar: avatar,
        }
        if (!info.avatar) {
            return 'Vui lòng chọn ảnh đại diện dự án'
        }
        return info
    }

    const companys = useListCompany();
    const citys = useListCity();
    const districts = useListDistrict(infos.city_id);
    const wards = useListWard(infos.district_id);
    const investors = useListInvestor();

    return (
        <AddForm checkId={Number(id)} title='dự án'
            handleData={handleData} route={Number(id) ? '/project/update' : '/project/add'}
            actions={{ add: addCategory, update: updateCategory }}
            refreshObjects={[setInfos, setAvatar, setImages]}>
            <div style={{ backgroundColor: '#f8f9fa' }} className='card'>
                <div className="grid formgrid">
                    <div className="col-12 lg:col-6">
                        <div className="mb-3 mb-8 mt-6 w-full flex align-items-center">
                            <UploadImg image={avatar} setImage={setAvatar} title='Ảnh đại diện (*)' />
                        </div>
                        <InputForm id='cb_code' disabled={Number(id)} value={infos.cb_code} label='Mã dự án (*)'
                            onChange={(e) => setInfos({ ...infos, cb_code: e.target.value })} required type='code' />
                        <InputForm id='alias' value={infos.alias} label='Tên nội bộ (*)'
                            onChange={(e) => setInfos({ ...infos, alias: e.target.value })} required />
                        <InputForm id='cb_title' value={infos.cb_title} label='Tên thương mại (*)'
                            onChange={(e) => setInfos({ ...infos, cb_title: e.target.value })} required />
                        <DropdownForm label='Công ty phân phối' value={infos.company_id} options={companys}
                            onChange={(e) => (setInfos({ ...infos, company_id: e.target.value }))} />
                        <DropdownForm label='Chủ đầu tư (*)' value={infos.investor_id} options={investors}
                            onChange={(e) => (setInfos({ ...infos, investor_id: e.target.value }))} />
                        <DropdownForm label='Giai đoạn (*)' value={infos.stage} options={GD}
                            onChange={(e) => (setInfos({ ...infos, stage: e.target.value }))} />
                        <DropdownForm label='Phân khúc (*)' value={infos.segment} options={PK}
                            onChange={(e) => (setInfos({ ...infos, segment: e.target.value }))} />
                        <InputNumber label="Thời gian giữ căn/chỗ (phút) " value={infos.keeping_time} className='w-full'
                            handleChange={(e) => setInfos({ ...infos, keeping_time: e })} />
                        <div className="flex mb-2">
                            <label className="w-5 mt-2 block text-900 font-medium mr-2">Giá (tỷ đồng)</label>
                            <div className="w-full flex gap-4">
                                <InputForm type='number' placeholder='từ' value={infos.price_from} className='w-full'
                                    onChange={(e) => setInfos({ ...infos, price_from: e.target.value })} />
                                <InputForm type='number' placeholder='đến' value={infos.price_to} className='w-full'
                                    onChange={(e) => setInfos({ ...infos, price_to: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 lg:col-6">
                        <div className="mb-6">
                            <UploadImages images={images} setImages={setImages} title='Slide' />
                        </div>
                        <DropdownForm label='Loại hình (*)' value={infos.type_product} options={LH}
                            onChange={(e) => (setInfos({ ...infos, type_product: e.target.value }))} />
                        <DropdownForm label='Tình trạng pháp lý (*)' value={infos.juridical} options={PLDA}
                            onChange={(e) => (setInfos({ ...infos, juridical: e.target.value }))} />
                        <DropdownForm label='Loại dự án (*)' value={infos.type_project} options={LDA}
                            onChange={(e) => (setInfos({ ...infos, type_project: e.target.value }))} />
                        <DropdownForm label='Tỉnh / TP (*)' optionValue="value" value={infos.city_id} options={citys}
                            onChange={(e) => setInfos({ ...infos, city_id: e.target.value })} optionLabel='text' />
                        <DropdownForm label='Quận / Huyện (*)' optionValue="value" value={infos.district_id} options={districts}
                            onChange={(e) => setInfos({ ...infos, district_id: e.target.value })} optionLabel='text' />
                        <DropdownForm label='Phường / Xã (*)' optionValue="value" value={infos.ward_id} options={wards}
                            onChange={(e) => setInfos({ ...infos, ward_id: e.target.value })} optionLabel='text' />
                        <InputForm id='address' value={infos.address} label='Địa chỉ (*)'
                            onChange={(e) => (setInfos({ ...infos, address: e.target.value }))} />
                        <InputSwitchForm checked={infos.hidden_cat} onChange={(e) => setInfos({ ...infos, hidden_cat: e.target.value })} />
                    </div>
                    <label className="w-12 mt-2 block text-900 font-medium mr-2">Mô tả</label>
                    <div className='w-full' style={{}}>
                        <EditorV2 data={data} setData={setData} height="1200px" />
                    </div>
                </div>
            </div>
        </AddForm>
    )
};

export default UpdateCategory;
