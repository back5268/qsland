import { Button, FormInput, InputTextarea } from "@/uiCore";
import { UploadImages } from "@/components/UploadImages";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendExplanation } from "../api";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/features/toast";
import { useParams } from "react-router-dom";
import { listToast } from "@/utils";

const SendExplanation = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [infos, setInfos] = useState({ reason: '', desc: '' });
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    async function fetchDataSubmit(info) {
        const response = await sendExplanation(info);
        if (response) setLoading(false);
        if (response.data.status) {
            navigate('/violate');
            dispatch(showToast({ ...listToast[0], detail: 'Gửi giải trình thành công!' }));
        } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        let info = { ...infos, image: images, id: id }
        fetchDataSubmit(info);
    };

    return (
        <form onSubmit={handleSubmit} className="card w-8" style={{ margin: '0 auto' }}>
            <h5 style={{ textAlign: 'center' }}>GIẢI TRÌNH VI PHẠM</h5>
            <label htmlFor='reason' className="block mt-2 mb-2 text-900 font-medium w-5 mr-2">Lý do (*)</label>
            <FormInput id='reason' placeholder='Nhập lý do' className='w-full' value={infos.reason} onChange={e => setInfos({...infos, reason: e.target.value})} required />
            <label htmlFor='desc' className="block mt-2 mb-2 text-900 font-medium w-5 mr-2">Nội dung giải trình chi tiết (*)</label>
            <InputTextarea id='desc' placeholder='Nhập nội dung' value={infos.desc} onChange={e => setInfos({...infos, desc: e.target.value})} autoResize rows={6} cols={40} className='w-full' required />
            <UploadImages images={images} setImages={setImages} title='Hình ảnh xác minh (*)' />

            <div className="w-full justify-content-end flex mb-4">
                <Link to='/violate'>
                    <Button type='button' label='Trở về' className="ml-2 mt-2" severity="secondary" size="small" raised />
                </Link>
                <Button loading={loading} type='submit' label='Gửi giải trình' className="ml-2 mt-2" severity="info" size="small" raised />
            </div>
        </form>
    )
};

export default SendExplanation;