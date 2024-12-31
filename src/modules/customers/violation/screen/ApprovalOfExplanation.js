import { UploadImages } from "@/components/UploadImages";
import { Fragment, useEffect, useState } from "react";
import { Button, Tag } from "@/uiCore";
import { useNavigate, useParams } from "react-router-dom";

import { getSeverity, useDetailExplanation } from "../util";
import { browseExplanation } from "../api";
import { status } from "../../customer/util";
import { useDetailCampaign } from "../../campaign/util";

import { showToast } from "@/redux/features/toast";
import { useDispatch } from "react-redux";
import { listToast } from "@/utils";

const ApprovalOfExplanation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const explanationInfo = useDetailExplanation(id);
    const campaign = useDetailCampaign(explanationInfo.campaign_id);
    const userInfo = localStorage.getItem('userInfo');

    useEffect(() => {
        if (explanationInfo.images) {
            let newArr = [];
            JSON.parse(explanationInfo.images).forEach(c => {
                let newObject = {};
                newObject.preview = c;
                newArr.push(newObject);
            });
            setImages(newArr);
        }
    }, [explanationInfo]);

    async function fetchDataSubmit(info) {
        const response = await browseExplanation(info);
        if (response.data.status) {
            navigate('/violate');
            dispatch(showToast({ ...listToast[0], detail: 'Duyệt giải trình thành công!' }));
        } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
    };

    const handleSubmit = (e) => {
        fetchDataSubmit({ id: explanationInfo.id, status: e });
    };

    return (
        <div className="card w-8" style={{ margin: '0 auto' }}>
            <h5 style={{ textAlign: 'center' }}>Chi tiết giải trình</h5>
            <div className="card">
                <div className="grid formgrid mt-2">
                    <div className="ml-4 col-12 lg:col-3">
                        <p>Khách hàng: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{explanationInfo.full_name}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-2">
                    <div className="ml-4 col-12 lg:col-3">
                        <p>Nhân viên: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{explanationInfo.name_sale}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-2">
                    <div className="ml-4 col-12 lg:col-3">
                        <p>Thu hồi: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{explanationInfo.created_at}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-2">
                    <div className="ml-4 col-12 lg:col-3">
                        <p>Giải trình: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{explanationInfo.updated_at}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-2">
                    <div className="ml-4 col-12 lg:col-3">
                        <p>Chiến dịch: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{campaign.name}</b></p>
                    </div>
                </div>
                <div className="grid formgrid mt-2">
                    <div className="ml-4 col-12 lg:col-3">
                        <p>Dự án: </p>
                    </div>
                    <div className="col-12 lg:col-6" style={{ color: '#6366F1' }}>
                        <p><b>{explanationInfo.name_category}</b></p>
                    </div>
                </div>
            </div>
            <h5 style={{ textAlign: 'center' }}>Thông tin giải trình</h5>
            <div style={{ textAlign: 'center' }}>
                <i >Đây là thông tin nhân viên vi phạm gửi giải trình cho </i> <br />
                <i>việc không chăm sóc khách hàng đúng thời gian quy định</i>
            </div>
            <div className="card mt-6">
                <h5 style={{ textAlign: 'center' }}><Tag value={explanationInfo.status && status[explanationInfo.status - 1].name} severity={getSeverity(explanationInfo.status)} style={{ padding: '0.5rem 1rem', fontSize: '16px' }}></Tag></h5>
                <b>Lý do:</b> <p style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>{explanationInfo.reason}</p> <hr />
                <b>Nội dung giải trình chi tiết: </b>
                <p style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>{explanationInfo.desc}</p> <hr />
                <div className="w-full">
                    <UploadImages images={images} setImages={setImages} view={true} title='Ảnh xác minh: ' />
                </div>
            </div>
            <div className="w-full justify-content-center flex mb-4">
                <Button type='button' onClick={e => navigate('/violate')} label='Trở lại' className="ml-2 mt-2" severity="secondary" size="small" raised />
                {![3, 4].includes(explanationInfo.status) && campaign.user_id_manager && campaign.user_id_manager.includes(JSON.parse(userInfo).user_id) && <Fragment >
                    <Button type='button' onClick={() => handleSubmit(4)} label='Từ chối' className="ml-2 mt-2" severity="danger" size="small" raised />
                    <Button type='button' onClick={() => handleSubmit(3)} label='Xác nhận' className="ml-2 mt-2" severity="info" size="small" raised />
                </Fragment>}
            </div>
        </div>
    )
};

export default ApprovalOfExplanation;