import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect } from 'primereact/treeselect';
import { Chip } from "primereact/chip";

import { useDetailCampaign } from "../util";
import { addCampaign, updateCampaign } from "../api";
import { useListCompany } from "@/modules/companys/company/util";
import { useListExchange } from "@/modules/companys/exchange/util";
import { useListGroupSaleV2, useListSale } from "@/modules/users/group_sale/util";
import { useListCategoryV2 } from "@/modules/categories/category/util";
import { useListSource } from "../../source_customer/util";

import { formatTreeData, formatTreeSelect, getArrIdFromTreeSelect, getUsersFromUserIds, removePropObject } from "@/utils";
import { getSale } from "@/utils";
import { AddForm, DropdownForm, InputForm } from "@/components/AddForm";
import { convertArrIdToArrObj } from '@/modules/categories/manager_cart/screen/UpdateManagerCart';
import SortableList from '@/components/SortableList';

const renderTreeData = (arrays, arrays1, arrays2) => {
    let result = [];
    let idArrays = {};
    arrays1.forEach((object) => {
        const { exchange_id } = object;
        if (!idArrays[exchange_id]) {
            idArrays[exchange_id] = [];
            result.push(idArrays[exchange_id]);
        }
        idArrays[exchange_id].push(object);
    });

    result.forEach(items => {
        items.forEach(item => {
            item.children = [];
            arrays2.forEach(i => {
                const { group_sale_id } = i;
                if (item.id === group_sale_id) {
                    item.children.push(i);
                }
            })
        })
    })

    arrays.forEach(a => {
        a.children = [];
        result.forEach(r => {
            if (a.id === r[0].exchange_id) {
                r.forEach(rs => {
                    a.children.push(rs);
                })
            }
        })
    })
    return arrays;
};

export const ListSaleByTree = (props) => {
    const { selectedNodeKeys, setSelectedNodeKeys, company_id, title, sort } = props;
    const exchanges = useListExchange({ company_id })
    const groupsales = useListGroupSaleV2({ company_id })
    const users = getSale(useListSale({ company_id }))
    const [saleTrees, setSaleTrees] = useState([])
    const [saleData, setSaleData] = useState([])

    useEffect(() => {
        setSaleTrees(formatTreeData(renderTreeData(exchanges, groupsales, users)))
    }, [JSON.stringify(exchanges), JSON.stringify(groupsales), JSON.stringify(users)])

    useEffect(() => {
        setSaleData([ ...getUsersFromUserIds(users, getArrIdFromTreeSelect(selectedNodeKeys)) ])
    }, [JSON.stringify(users), JSON.stringify(selectedNodeKeys)])

    const onChangeRemove = (s) => {
        let arr = getArrIdFromTreeSelect(selectedNodeKeys);
        arr = arr.filter(u => u !== s.user_id);
        setSelectedNodeKeys(formatTreeSelect(arr));
    };

    return (
        <Fragment>
            <div className="flex justify-content-center mb-3">
                <label className="block text-900 font-medium w-3 mr-2">{title}</label>
                <TreeSelect value={selectedNodeKeys} filter onChange={(e) => setSelectedNodeKeys(e.value)} options={company_id ? saleTrees : []}
                    metaKeySelection={false} className="w-9" selectionMode="checkbox"
                    display="chip" placeholder={"Chọn " + title.toLowerCase()} style={{ minHeight: '3rem' }} />
            </div>
            <div className="flex justify-content-center mb-3">
                <label className="block text-900 font-medium w-4 mr-2"></label>
                <div className="card flex flex-wrap gap-2 w-full" style={{ minHeight: '10rem' }}>
                    {sort ? <SortableList items={saleData} onChangeRemove={onChangeRemove} onChange={e => setSelectedNodeKeys(formatTreeSelect(e))} />
                        : saleData.map(s => {
                            return <Chip key={s.id} label={s.full_name} removable onRemove={(e) => onChangeRemove(s)} style={{ maxHeight: '2.5rem' }} />
                        })}
                </div>
            </div>
        </Fragment>
    )
};

const UpdateCampaign = () => {
    const { id } = useParams();
    const campaignInfo = useDetailCampaign(id);
    const [infos, setInfos] = useState({ name: '', rule_time: '', penalty: '' });
    const [selectedNodeKeys, setSelectedNodeKeys] = useState({});
    const [campaign, setCampaign] = useState({});

    const companys = useListCompany();
    const categorys = useListCategoryV2({});
    const sources = useListSource({ company_id: infos.company_id });
    const users = getSale(useListSale({ company_id: infos.company_id }));

    useEffect(() => {
        if (Number(id)) {
            let newCampaign = {
                ...infos, ...campaignInfo, user_id_manager: campaignInfo && campaignInfo.user_id_manager ? JSON.parse(campaignInfo.user_id_manager) : [],
            };
            setInfos(newCampaign);
            setCampaign(newCampaign);
            if (campaignInfo && campaignInfo.user_sale_ids) {
                let newSaleId = [];
                if (campaignInfo.user_sale_ids && campaignInfo.user_sale_ids[0]) {
                    campaignInfo.user_sale_ids.sort((a, b) => a.sort - b.sort);
                    campaignInfo.user_sale_ids.forEach(u => {
                        if (u.user_id) newSaleId.push(u.user_id);
                    });
                };
                setSelectedNodeKeys(formatTreeSelect(newSaleId));
            };
        };
    }, [campaignInfo]);

    const handleData = () => {
        if (!infos.category_id) {
            return "Vui lòng chọn dự án"
        }
        if (!infos.source_id) {
            return "Vui lòng chọn nguồn"
        }
        if (!(infos.user_id_manager && infos.user_id_manager[0])) {
            return "Vui lòng chọn người quản lý chiến dịch"
        }
        let newSaleId = convertArrIdToArrObj(getArrIdFromTreeSelect(selectedNodeKeys));
        newSaleId.forEach((n, index) => {
            n.sort = index
        });
        if (Number(id)) {
            if (JSON.stringify(newSaleId) === JSON.stringify(campaignInfo.user_sale_ids)) newSaleId = [];
            else {
                if (campaignInfo.user_sale_ids && campaignInfo.user_sale_ids[0]) {
                    const foundElement = campaignInfo.user_sale_ids.filter(d => !newSaleId.some(n => n.user_id === d.user_id));
                    if (foundElement && foundElement[0]) {
                        foundElement.forEach(f => {
                            newSaleId.push({ id: f.id, deleted_at: 1 });
                        });
                    };
                    campaignInfo.user_sale_ids.forEach((d, index) => {
                        newSaleId.forEach((n, index) => {
                            if (n.user_id === d.user_id) {
                                n.id = d.id;
                            };
                        })
                    })
                }
            };
        };
        let info = { ...removePropObject({ ...infos, user_sale_ids: newSaleId }, campaign), id: campaignInfo.id };
        return info
    }

    return (
        <AddForm className="w-8" style={{ margin: '0 auto' }} checkId={Number(id)} title='chiến dịch' handleData={handleData}
            route={Number(id) ? '/campaign/update' : '/campaign/add'}
            actions={{ add: addCampaign, update: updateCampaign }}
            refreshObjects={[setInfos, setSelectedNodeKeys]} >
            <div style={{ backgroundColor: '#f8f9fa' }} className="card">
                <div className="grid formgrid">
                    <div className="col-12 lg:col-12">
                        <InputForm id='name' value={infos.name} onChange={(e) => setInfos({ ...infos, name: e.target.value })} label='Tên chiến dịch' required />
                        <DropdownForm label='Công ty' filter optionValue="id" optionLabel="name" value={infos.company_id}
                            onChange={(e) => setInfos({ ...infos, company_id: e.target.value })}
                            options={companys} disabled={infos.round} />
                        <DropdownForm label='Dự án' filter optionValue="id" disabled={infos.round} value={infos.category_id}
                            onChange={(e) => setInfos({ ...infos, category_id: e.target.value })}
                            options={infos.company_id ? categorys : []} />
                        <DropdownForm label='Nguồn' filter optionValue="id" value={infos.source_id} disabled={infos.round}
                            onChange={(e) => setInfos({ ...infos, source_id: e.target.value })}
                            options={infos.company_id ? sources : []} />
                        <ListSaleByTree sort={true} selectedNodeKeys={selectedNodeKeys} setSelectedNodeKeys={setSelectedNodeKeys}
                            company_id={infos.company_id} title="Nhân sự chạy chiến dịch" />
                        <div className="flex align-items-center mb-3">
                            <label className="block text-900 font-medium w-3 mr-2">Người quản lý chiến dịch</label>
                            {(users && users[0]) ? <MultiSelect value={infos.user_id_manager} filter options={users}
                                onChange={(e) => setInfos({ ...infos, user_id_manager: e.target.value })}
                                optionLabel="full_name" optionValue="user_id"
                                placeholder="Chọn người quản lý chiến dịch" display="chip" className={classNames('w-9')} /> :
                                <MultiSelect options={[]} placeholder="Chọn người quản lý chiến dịch" className={classNames('w-9')} />}
                        </div>
                        <InputForm id='rule_time' value={infos.rule_time} type='number' label='Thời gian chăm sóc quy định (phút)'
                            onChange={(e) => setInfos({ ...infos, rule_time: e.target.value })} required />
                        <InputForm id='penalty' value={infos.penalty} type='number' label='Quy định phạt (tour)'
                            onChange={(e) => setInfos({ ...infos, penalty: e.target.value })} required />
                    </div>
                </div>
            </div>
        </AddForm>
    )
}

export default UpdateCampaign;