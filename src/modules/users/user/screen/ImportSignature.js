import { Button } from "@/uiCore";
import { Fragment, useState } from "react";
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { listToast } from "@/utils";
import { UploadImages } from "@/components/UploadImages";
import { importSignature } from "../api";

const ImportSignature = ({ setVisibleImport }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    async function fetchDataSubmit() {
        const response = await importSignature({ gallery: images });
        if (response) setLoading(false);
        if (response.data.status) {
            const downloadLink = document.createElement('a');
            downloadLink.target = '_blank';
            downloadLink.href = '/import_failed';
            localStorage.setItem('import_failed', JSON.stringify({ title: 'chữ ký', ...response.data.data }));
            setVisibleImport(false);
            setTimeout(() => downloadLink.click(), [500]);
            dispatch(showToast({ ...listToast[0], detail: `Import chữ ký thành công!` }));
        }
        else dispatch(showToast({ ...listToast[1], detail: "Có lỗi" }));
    };

    const handleSubmit = () => {
        if (images && images[0]) {
            setLoading(true);
            let newImages = []
            images.forEach(i => {
                newImages.push(i.preview)
            })
            fetchDataSubmit();
        } else dispatch(showToast({ ...listToast[1], detail: 'Vui Lòng chọn ảnh!' }));
    };

    return (
        <Fragment>
            <UploadImages images={images} setImages={setImages} title='' />
            <div className="justify-content-center mt-4 flex">
                <Button loading={loading} onClick={handleSubmit} label="Import" className="ml-2 mt-2" severity="info" size="small" raised />
            </div>
        </Fragment>
    )
};

export default ImportSignature;