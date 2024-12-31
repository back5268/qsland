import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/uiCore";
import { FormInput, Dropdown, InputSwitch, InputTextarea } from "@/uiCore";
import { classNames } from "primereact/utils";
import { MoreOptions } from "@/modules/categories/manager_cart/screen/UpdateManagerCart";
import { useSelector } from "react-redux";
import { Calendarz } from "./ListForm";
import { formatNumber } from "@/modules/categories/row_table/util";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/features/toast";
import { listToast, refreshObject, scrollToTop } from "@/utils";
import { addGroupSale, updateGroupSale } from "@/modules/users/group_sale/api";

export const CalendarForm = (props) => {
    const { label, ...prop } = props;
    return (
        <div className="flex mb-3 change-disabled">
            <label className="block text-900 font-medium w-3 mr-5">{label}</label>
            <Calendarz {...prop} showIcon className="w-9" showTime hourFormat="24" />
        </div>
    )
}

export const InputTextareaForm = (props) => {
    const { id, label, className, ...inputprop } = props;
    return (
        <div className="flex mb-6">
            <label htmlFor={id} className="block text-900 font-medium w-4 mr-2">{label ? label : 'Mô tả'}</label>
            <InputTextarea autoResize id={id} rows={6} cols={30}
                className={classNames("w-full", className)} {...inputprop} />
        </div>
    )
};

export const InputNumber = (props) => {
    const { value, handleChange, ...prop } = props;
    const onChange = (e) => {
        let v = e.target.value;
        let result = '';
        for (let i = 0; i < v.length; i++) {
            if (!isNaN(v[i])) {
                result += v[i];
            }
        }
        if (v === '') handleChange(result);
        if (Number(result)) handleChange(result);
    };
    return <InputForm value={formatNumber(value) || ''} onChange={onChange} type='text' {...prop} />;
}

export const InputSwitchForm = (props) => {
    const { label, className, ...inputprop } = props;
    return (
        <div className="flex mb-3 change-disabled">
            <label className="block text-900 font-medium w-3 mr-2">{label ? label : 'Trạng thái'}</label>
            <InputSwitch className={classNames("text-left", className)} {...inputprop} />
        </div>
    )
};

export const InputForm = (props) => {
    const { label, id, placeholder, className, ...inputprop } = props;
    return (
        <div className="flex mb-1 change-disabled">
            {label && <label htmlFor={id} className="block mt-2 text-900 font-medium w-4 mr-2">{label}</label>}
            <FormInput id={id} label={label} placeholder={placeholder || (label && `Nhập ${label.toLowerCase()}`)}
                className={classNames("w-full", className)} {...inputprop} />
        </div>
    )
};

export const DropdownForm = (props) => {
    const { label, optionLabel, optionValue, placeholder, className, ...inputprop } = props;
    return (
        <div className="w-full flex align-items-center mb-3 change-disabled">
            <label className="block text-900 font-medium w-4 mr-2">{label}</label>
            <Dropdown filter className={classNames("w-full", className)}
                optionLabel={optionLabel ? optionLabel : 'name'} optionValue={optionValue ? optionValue : 'id'}
                placeholder={placeholder || `Chọn ${label.toLowerCase()}`} {...inputprop} />
        </div>
    )
};

export const AddForm = (props) => {
    const navigate = useNavigate();
    const permissionTool = useSelector(state => state.permission).permissionTool;
    const { checkId, title, handleData, actions, className, moreOptions, route, checkUpdate, refreshObjects, ...prop } = props;
    const location = useLocation();
    const dispatch = useDispatch();
    const [params, setParams] = useState(() => { return location.search })
    const [loading, setLoading] = useState(false);

    async function fetchDataSubmit(info) {
        if (checkId) {
            const check = checkUpdate ? await checkUpdate() : true
            if (!check) {
                setLoading(false);
                return
            }
            const response = await actions.update(info);
            if (response) setLoading(false);
            if (response.data.status) {
                navigate(route.replace('/update', '') + params);
                dispatch(showToast({ ...listToast[0], detail: `Cập nhật ${title} thành công!` }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        } else {
            const response = await actions.add(info);
            if (response) setLoading(false);
            if (response.data.status) {
                scrollToTop();
                if (refreshObjects && refreshObjects[0]) {
                    refreshObjects.forEach(d => {
                        if (typeof d === 'function') {
                            d(e => {
                                const status = e.status
                                const cb_status = e.cb_status
                                if (Array.isArray(e)) return []
                                else return { ...refreshObject(e), status, cb_status }
                            })
                        }
                    })
                }
                dispatch(showToast({ ...listToast[0], detail: `Thêm ${title} thành công!` }));
            } else dispatch(showToast({ ...listToast[1], detail: response.data.mess }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const info = handleData();
        if (typeof info === 'object') {
            fetchDataSubmit(info);
        } else {
            dispatch(showToast({ ...listToast[1], detail: info }))
            setLoading(false);
        }
    }

    return (
        <div className={classNames("card", className)} {...prop}>
            <div className="flex justify-content-between align-items-center mb-4">
                <h4 className="m-0">{checkId ? 'Cập nhật' : 'Thêm mới'} {title}</h4>
                {moreOptions && moreOptions.id && <MoreOptions value={moreOptions} />}
            </div>
            <form onSubmit={handleSubmit}>
                {props.children}
                <div className="w-full justify-content-end flex">
                    <Button type='button' onClick={() => navigate((route.includes('/update') ? route.replace('/update', '') : route.replace('/add', '')) + params)}
                        label="Trở về" className="ml-2" severity="secondary" size="small" outlined />
                    {permissionTool.includes(route) &&
                        <Button type='submit' loading={loading} label={checkId ? "Cập nhật" : "Thêm mới"}
                            className="ml-2" severity="info" size="small" raised />}
                </div>
            </form>
        </div>
    )
}