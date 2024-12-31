import Editor from "@/components/Editor";
import { Fragment, useEffect, useState } from "react";
import { DropdownForm, InputForm } from "@/components/AddForm";
import { GD, LH, useListCategoryV2 } from "@/modules/categories/category/util";
import { initForms, templateLevels, templateTypes, titles } from "../util";
import { useNavigate, useParams } from "react-router-dom";
import { addTemplate, updateTemplate } from "../api";
import { useDetailTemplate } from "../util";
import { showToast } from "@/redux/features/toast";
import { listToast, refreshObject, removePropObject, scrollToTop } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";

const UpdateTemplate = () => {
    const [data, setData] = useState(['']);
    const [title, setTitle] = useState(['Nội dung']);
    const [infos, setInfos] = useState({ code: '', title: '' });
    const [loading, setLoading] = useState(false);
    const categories = useListCategoryV2();
    const { id } = useParams();
    const templateDetail = useDetailTemplate(id);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const permissionTool = useSelector(state => state.permission).permissionTool;

    useEffect(() => {
        if (!Number(id)) {
            if (infos.type) {
                let newData = initForms[initForms.findIndex(i => i.id === infos.type)].data;
                setTitle([...titles[infos.type - 1]]);
                setData([...newData]);
            };
        }
    }, [infos.type]);

    useEffect(() => {
        if (Number(id)) {
            setInfos({ ...templateDetail });
            let newData = [];
            if (templateDetail.data) {
                newData.push(templateDetail.data);
            };
            if (templateDetail.email_term) {
                newData.push(templateDetail.email_term);
            };
            setData([...newData]);
        }
    }, [templateDetail]);

    const handleSetdata = (value, index) => {
        let newData = data;
        newData[index] = value;
        setData([...newData]);
    };

    async function fetchDataSubmit(info) {
        if (Number(id)) {
            const response = await updateTemplate(info);
            if (response) setLoading(false);
            if (response.data.status) {
                navigate('/template');
                dispatch(showToast({ ...listToast[0], detail: 'Cập nhật template thành công!' }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        } else {
            const response = await addTemplate(info);
            if (response) setLoading(false);
            if (response.data.status) {
                scrollToTop();
                setInfos({ ...refreshObject(infos) });
                setData(['']);
                dispatch(showToast({ ...listToast[0], detail: 'Thêm template thành công!' }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let info = { ...infos };
        if (data && data[0]) {
            info.data = data[0];
            info.email_term = data[1] ? data[1] : undefined;
        };
        if (Number(id)) {
            info = { ...removePropObject(info, templateDetail), id: id };
        };
        setLoading(true);
        fetchDataSubmit(info)
    };

    return (
        <form onSubmit={handleSubmit} className="card w-8" style={{ margin: '0 auto' }}>
            <h5 className="mb-4" style={{ textAlign: 'center' }}>Thêm template mặc định: </h5>
            <div className="card">
                <div className="w-9">
                    <DropdownForm showClear={false} value={infos.type} onChange={e => setInfos({ ...infos, type: e.target.value })}
                        label="Loại template (*)" options={templateTypes} />
                    <DropdownForm showClear={false} value={infos.type_pattern} onChange={e => setInfos({ ...infos, type_pattern: e.target.value })}
                        label="Kiểu template (*)" options={templateLevels} />
                    {infos.type_pattern === 1 && <DropdownForm showClear={false} value={infos.type_product} onChange={e => setInfos({ ...infos, type_product: e.target.value })}
                        label="Loại hình sản phẩm (*)" options={LH} />}
                    {infos.type_pattern === 2 && <DropdownForm showClear={false} value={infos.category_id} onChange={e => setInfos({ ...infos, category_id: e.target.value })}
                        label="Dự án (*)" options={categories} />}
                    <DropdownForm showClear={false} value={infos.stage} onChange={e => setInfos({ ...infos, stage: e.target.value })}
                        label="Giai đoạn (*)" options={GD} />
                    <InputForm id="code" label="Mã template (*)" value={infos.code} required type="code"
                        onChange={e => setInfos({ ...infos, code: e.target.value })} />
                    <InputForm id="title" label="Tiêu đề (*)" value={infos.title} required
                        onChange={e => setInfos({ ...infos, title: e.target.value })} />
                </div>
            </div>
            {data.map((d, index) => {
                return (
                    <Fragment key={index}>
                        <h6 className="mb-2" style={{ textAlign: 'center' }}>{title[index]}</h6>
                        <div key={index} className="card mb-4">
                            <Editor index={index} data={d} setData={value => handleSetdata(value, index)} height='1600' />
                        </div>
                    </Fragment>
                )
            })}
            <div className="w-full justify-content-end flex">
                <Button type='button' onClick={() => navigate(-1)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />
                {permissionTool.includes('/template/update') && <Button type='submit' loading={loading} label={Number(id) ? "Cập nhật" : "Thêm mới"}
                    className="ml-2" severity="info" size="small" raised />}
            </div>
        </form>
    )
};

export default UpdateTemplate;