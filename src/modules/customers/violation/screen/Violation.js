import { Button } from "@/uiCore";
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/redux/features/toast";
import { getSale, listToast } from "@/utils";
import { databaseDate } from "@/lib/convertDate";
import { confirmDialog } from "primereact/confirmdialog";

import { Inputz, Dropdownz, Calendarz, GridForm } from "@/components/ListForm";
import {TimeBody, Columnz, Body, useGetParams} from "@/components/DataTable";

import { cancelExplanation } from "../api";
import { useListViolation, useCountViolation, getSeverity } from "../util";
import { status } from "../../customer/util";

import { useListSource } from "../../source_customer/util";
import { useListCampaign } from "../../campaign/util";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListGroupSaleV2 } from "@/modules/users/group_sale/util";
import { useListUserV2 } from "@/modules/users/user/util";
import { forgiveViolation } from "../api";
import { DataTable } from "primereact/datatable";
import Tag from "@/components/Tag";

const Header = ({ setParamsPaginator, paramsPaginator }) => {
    const [filter, setFilter] = useState({ key_search: '' });
    const campaigns = useListCampaign();
    const categories = useListCategoryV2();
    const sources = useListSource();
    const exchanges = useListExchange();
    const groupSales = useListGroupSaleV2({ exchange_id: filter.exchange_id });
    const users = useListUserV2({ exchange_id: filter.exchange_id, group_sale_id: filter.group_sale_id });

    const handleFilter = (filter) => {
        const filters = {
            ...filter, from: filter.dates && databaseDate(filter.dates[0]),
            to: filter.dates && filter.dates[1] ? databaseDate(filter.dates[1], true)
                : filter.dates && databaseDate(filter.dates[0], true), dates: undefined,
        };
        return filters;
    };

    return (
        <GridForm paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator}
            filter={filter} setFilter={setFilter} handleFilter={handleFilter} className='lg:col-9'>
            <Dropdownz value={filter.exchange_id} options={exchanges} placeholder="Chọn phòng ban"
                onChange={(e) => setFilter({ ...filter, exchange_id: e.target.value, group_sale_id: undefined, user_id_sale: undefined })} />
            <Dropdownz value={filter.group_sale_id} options={groupSales} placeholder="Chọn nhóm sale"
                onChange={(e) => setFilter({ ...filter, group_sale_id: e.target.value, user_id_sale: undefined })} />
            <Dropdownz value={filter.user_id_sale} options={users}
                onChange={(e) => setFilter({ ...filter, user_id_sale: e.target.value })}
                placeholder="Chọn sale vi phạm" />
            <Dropdownz value={filter.category_id} options={categories}
                onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}
                placeholder="Chọn dự án" />
            <Dropdownz value={filter.source_id} options={sources} placeholder="Chọn nguồn"
                onChange={(e) => setFilter({ ...filter, source_id: e.target.value })} />
            <Calendarz value={filter.dates} onChange={(e) => setFilter({ ...filter, dates: e.target.value })} />
            <Dropdownz value={filter.campaign_id} options={campaigns} placeholder="Chọn chiến dịch"
                onChange={(e) => setFilter({ ...filter, campaign_id: e.target.value })} />
            <Dropdownz value={filter.status} options={status} placeholder="Chọn trạng thái"
                onChange={(e) => setFilter({ ...filter, status: e.target.value })} />
            <Inputz value={filter.key_search} onChange={e => setFilter({ ...filter, key_search: e.target.value })} />
        </GridForm>
    )
};

const Violation = () => {
    const dispatch = useDispatch()
    const initParams = useGetParams()
    const [paramsPaginator, setParamsPaginator] = useState(initParams)
    const permissionTool = useSelector(state => state.permission).permissionTool;
    const user_id = JSON.parse(localStorage.getItem('userInfo')).user_id;
    const [selectedProducts, setSelectedProducts] = useState([]);
    const customers = useListViolation({ ...paramsPaginator, first: undefined });
    const totalRecords = useCountViolation({ ...paramsPaginator, first: undefined });

    const onPage = (event) => {
        setParamsPaginator({
            ...paramsPaginator,
            first: event.first,
            limit: event.rows,
            page: event.page !== 0 ? event.page + 1 : 1,
        });
    };

    const StatusBody = (e) => {
        return <Tag value={e.status && status[e.status - 1] && status[e.status - 1].name} severity={getSeverity(e.status)}></Tag>
    };

    const ActionBody = (e) => {
        const accept = () => {
            dispatch(showToast({ ...listToast[0], detail: 'Xóa giải trình thành công!' }));
            cancelExplanation({ id: e.id });
            setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
        };

        const confirm = () => {
            confirmDialog({
                message: 'Bạn có muốn tiếp tục xóa giải trình?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            });
        };

        return (
            <div>
                {user_id === e.user_id_sale && e.status === 2 && <Button type='button' onClick={confirm} icon="pi pi-trash" rounded outlined severity="danger" />}
                {user_id === e.user_id_sale && e.status === 1 && <Link to={'/violate/add/' + e.id}>
                    <Button icon="pi pi-pencil" rounded outlined />
                </Link>}
                {[2, 3, 4].includes(e.status) && <Link to={'/violate/detail/' + e.id}>
                    <Button icon="pi pi-eye" rounded outlined />
                </Link>}
            </div>
        )
    };

    const RenderHeader = (props) => {
        const { title } = props;
        async function accept() {
            let newSlect = [];
            selectedProducts.forEach(s => {
                if (s.id && [1, 2].includes(s.status)) newSlect.push(s.id);
            })
            if (newSlect && newSlect[0]) {
                const res = await forgiveViolation({ ids: newSlect });
                if (res.data.status) {
                    dispatch(showToast({ ...listToast[0], detail: 'Tha sale vi phạm thành công!' }));
                    setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
                }
            } else {
                dispatch(showToast({ ...listToast[2], detail: 'Vi phạm đã bị phạt hoặc đã được tha!' }));
            }
        }

        const confirm = () => {
            confirmDialog({
                message: 'Bạn có chắc chắn muốn tha sale vi phạm không?',
                header: 'BO quản trị dự án',
                icon: 'pi pi-info-circle',
                accept,
            });
        };

        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">{title}</h4>
                <div className="mt-2 lg:mt-0">
                    {permissionTool.includes('/violate/tha') && <Button label="Tha" onClick={confirm}
                        disabled={selectedProducts && !selectedProducts[0]}
                        className="ml-3" severity="warning" size="small" raised style={{ minWidth: '96px' }} />}
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <Header setParamsPaginator={setParamsPaginator} paramsPaginator={paramsPaginator} />
            <DataTable value={customers} header={RenderHeader({ title: 'Danh sách vi phạm' })} title="khách hàng" totalRecords={totalRecords} lazy selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginator first={paramsPaginator.first} rows={paramsPaginator.limit} onPage={onPage} showGridlines
                rowsPerPageOptions={[20, 50, 100]} dataKey="id"
                emptyMessage={"Không tìm thấy vi phạm"} currentPageReportTemplate="Tổng số: {totalRecords} bản ghi" >
                <Columnz selectionMode="multiple" rowSelectable={false} headerStyle={{ width: '3rem' }} bodyStyle={{ textAlign: 'center' }} />
                <Columnz field="full_name" header="Khách hàng" />
                <Columnz field="phone" header="Số điện thoại" bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Nguồn" field="source_name" style={{ minWidth: '2rem' }} />
                <Columnz field="campaign_name" header="Chiến dịch" />
                <Columnz header="Dự án" field="category_name" />
                <Columnz header="Thời gian phân bổ" body={e => TimeBody(e.allotment_time)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian thu hồi" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Thời gian cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Sale" field="sale_name" />
                <Columnz header="Trạng thái" body={StatusBody} bodyStyle={{ textAlign: 'center' }} />
                <Columnz header="Actions" body={ActionBody} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    )
}

export default Violation;