import { Button } from "@/uiCore";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/features/toast';
import { listToast } from "@/utils";

const Import = (props) => {
    const { title, action, template } = props;

    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectFile, setSelectFile] = useState('');

    const handleImport = (e) => {
        const file = e.target.files[0];
        setFile({ ...file, file: file });
        setSelectFile((file && file.name));
    };

    async function fetchDataSubmit() {
        const response = await action(file);
        if (response) setLoading(false);
        if (response.data.status) {
            const downloadLink = document.createElement('a');
            downloadLink.target = '_blank';
            downloadLink.href = '/import_failed';
            localStorage.setItem('import_failed', JSON.stringify({ title: title, ...response.data.data }));
            setTimeout(() => downloadLink.click(), [500]);
            dispatch(showToast({ ...listToast[0], detail: `Import ${title} thành công!` }));
        }
        else dispatch(showToast({ ...listToast[1], detail: "Có lỗi" }));
    };

    const handleSubmit = () => {
        if (file && file.file) {
            setLoading(true);
            fetchDataSubmit();
        } else dispatch(showToast({ ...listToast[1], detail: 'Vui Lòng chọn file!' }));
    };

    return (
        <div className="card">
            <div className="justify-content-center flex">
                <label className="p-button p-fileupload-choose p-component">
                    <span className="p-button-text p-clickable">Choose a file</span>
                    <input type="file" onChange={handleImport} className="p-inputtext p-component" />
                </label>
            </div>
            <div className="justify-content-center flex mt-2">
                {selectFile && <div>Select file: {selectFile}</div>}
            </div>

            <div className="justify-content-center mt-4 flex">
                <Button label="Bỏ chọn file" onClick={() => { setSelectFile(''); setFile(null) }}
                    className="ml-2 mt-2" severity="secondary" size="small" outlined />
                <Button loading={loading} onClick={handleSubmit} label="Import" className="ml-2 mt-2" severity="info" size="small" raised />
                <Link to={template}>
                    <Button label="Tải file mẫu" className="ml-2 mt-2" severity="info" size="small" raised />
                </Link>
            </div>
        </div>
    )
};

export default Import;