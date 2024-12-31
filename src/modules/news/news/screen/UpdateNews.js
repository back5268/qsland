import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addNews, updateNews } from '../api';

import { removePropObject, useDetailPermission } from "@/utils";
import { InputForm, AddForm, InputSwitchForm, DropdownForm } from "@/components/AddForm";
import { newLevel, newType, useDetailNews, voteType } from '../util';
import { useListCompany } from '@/modules/companys/company/util';
import { useListExchange } from '@/modules/companys/exchange/util';
import { UploadImg } from '@/components/UploadImages';
import { RadioButton } from '@/components/RadioButton';
import { useListCategoryV2 } from '@/modules/categories/category/util';
import MultiSelectList from '@/components/MultiSelectList';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { databaseDate } from '@/lib/convertDate';
import EditorV2 from '@/components/EditorV2';

const InfoRequired = (props) => {
    const { infos, setInfos, avatar, setAvatar, data, setData } = props;

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className='card'>
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <UploadImg image={avatar} setImage={setAvatar} title='Ảnh đại diện' />
                    <div className='mt-4'></div>
                    <InputForm value={infos.hashtag} onChange={(e) => setInfos({ ...infos, hashtag: e.target.value })}
                        id='hashtag' label='Hashtag' />
                    <div className="flex align-items-center mb-3">
                        <label className="block text-900 font-medium w-3 mr-2">Mức độ ưu tiên </label>
                        <RadioButton data={newLevel} value={infos.priority_level}
                            onChange={e => setInfos({ ...infos, priority_level: e })} />
                    </div>
                    <div className="flex align-items-center mb-3">
                        <label className="block text-900 font-medium w-3 mr-2">Loại bình chọn </label>
                        <RadioButton data={voteType} value={infos.comment_type}
                            onChange={e => setInfos({ ...infos, comment_type: e })} />
                    </div>
                    {infos.comment_type === 2 && <div className='flex mb-1' >
                        <label className="block mt-2 text-900 font-medium w-4 mr-2"></label>
                        <Votes data={data} setData={setData} infos={infos} setInfos={setInfos} />
                    </div>}
                    <InputSwitchForm label="Hiển thị" checked={infos.status} onChange={(e) => setInfos({ ...infos, status: e.target.value })} />
                </div>
                <div className="col-12 lg:col-6">
                    <DropdownForm value={infos.type} onChange={(e) => setInfos({ ...infos, type: e.target.value })}
                        label='Loại tin đăng (*)' options={newType} />
                    <InputForm value={infos.title} onChange={(e) => setInfos({ ...infos, title: e.target.value })}
                        id='title' label='Tiêu đề bài viết (*)' required />
                    <MoreInfo infos={infos} setInfos={setInfos} />
                </div>
            </div>
        </div>
    )
};

const Calendarz = (props) => {
    const { label, className, value1, onChange1, value2, onChange2, ...prop } = props;

    return (
        <div className="flex mb-3">
            <label className="block text-900 font-medium w-4 ">{label}</label>
            <div className='w-full grid formgrid'>
                <div className={classNames("col-12 lg:col-6", className)}>
                    <InputForm type="datetime-local" placeholder='Thời gian bắt đầu' value={value1} onChange={e => onChange1(e.target.value)}
                        className='w-full' {...prop} />
                </div>
                <div className={classNames("col-12 lg:col-6", className)}>
                    <InputForm type="datetime-local" placeholder='Thời gian kết thúc' value={value2} onChange={e => onChange2(e.target.value)}
                        className='w-full' {...prop} />
                </div>
            </div>
        </div>
    )
};

const MoreInfo = (props) => {
    const { infos, setInfos } = props;
    const exchanges = useListExchange({ company_id: infos.company_id });
    const categories = useListCategoryV2({ company_id: infos.company_id });

    return (
        <Fragment>
            {(infos.type === 2) && <Fragment>
                <DropdownForm value={infos.honor_exchange_id} onChange={(e) => setInfos({ ...infos, honor_exchange_id: e.target.value })}
                    label='Phòng ban / sàn (*)' options={exchanges} />
                <InputForm value={infos.honor_spending} onChange={(e) => setInfos({ ...infos, honor_spending: e.target.value })}
                    id='honor_spending' label='Chỉ tiêu vinh danh' />
            </Fragment>}
            {([4, 6].includes(infos.type)) && <Fragment>
                <DropdownForm value={infos.category_ids} onChange={(e) => setInfos({ ...infos, category_ids: e.target.value })}
                    label='Dự án (*)' options={categories} />
            </Fragment>}
            {[3, 4].includes(infos.type) && <Fragment>
                <InputSwitchForm label="Cho phép đăng ký" checked={infos.allow_register} onChange={(e) => setInfos({ ...infos, allow_register: e.target.value })} />
                <InputForm value={infos.allow_member} onChange={(e) => setInfos({ ...infos, allow_member: e.target.value })}
                    id='allow_member' label='Số lượng người đăng ký' type="number" />
                <Calendarz value1={infos.register_time_start} value2={infos.register_time_end}
                    onChange1={(e) => setInfos({ ...infos, register_time_start: e })}
                    onChange2={(e) => setInfos({ ...infos, register_time_end: e })}
                    label='Thời gian đăng ký' />
                <Calendarz value1={infos.checkin_time_start} value2={infos.checkin_time_end}
                    onChange1={(e) => setInfos({ ...infos, checkin_time_start: e })}
                    onChange2={(e) => setInfos({ ...infos, checkin_time_end: e })}
                    label='Thời gian Checkin' />
                <Calendarz value1={infos.event_time_start} value2={infos.event_time_end}
                    onChange1={(e) => setInfos({ ...infos, event_time_start: e })}
                    onChange2={(e) => setInfos({ ...infos, event_time_end: e })}
                    label='Thời gian sự kiện' />
                <InputForm value={infos.address} onChange={(e) => setInfos({ ...infos, address: e.target.value })}
                    id='address' label='Địa điểm' />
                <DropdownForm value={infos.units} onChange={(e) => setInfos({ ...infos, units: e.target.value })}
                    id='units' options={exchanges} label='Đơn vị tổ chức' />
            </Fragment>}
        </Fragment>
    )
};

const Vote = (props) => {
    const { index, handleDelete, idz, handleSetData, value } = props;

    return (
        <div className='flex gap-2 mb-2'>
            <div className='w-11'>
                <InputText value={value} onChange={e => handleSetData(e.target.value, index)} className="w-10" required placeholder="Bình chọn" />
            </div>
            <Button type='button' icon="pi pi-trash" className='mt-2' onClick={() => handleDelete(idz)} rounded outlined severity="danger" />
        </div>
    )
};

const Votes = (props) => {
    const { data, setData } = props;

    const handAdd = () => {
        const idz = (data && data[0]) ? (data[data.length - 1].idz + 1) : 1;
        setData([...data, { idz, content: '' }]);
    };

    const handleDelete = (idz) => {
        if (data && data[1]) {
            setData([...data.filter(d => d.idz !== idz)]);
        };
    };

    const handleSetData = (value, index) => {
        let newData = data;
        if (value && index && newData[index - 1]) newData[index - 1].content = value;
        setData([...newData]);
    };

    return (
        <Fragment>
            <div className='card mt-2 w-full mb-4'>
                {data.map((d, index) => {
                    return <Vote index={index + 1} idz={d.idz} value={d.content} handleSetData={handleSetData} key={index} handleDelete={handleDelete} />
                })}
                <Button onClick={handAdd} type="button" label="Thêm bình chọn" className='mt-2' size="small" />
            </div>
        </Fragment>
    )
};

const Scopes = (props) => {
    const { infos, setInfos } = props;
    const [companies, setCompanies] = useState([]);
    const companiesData = useListCompany();
    const exchanges = useListExchange({ company_id: infos.company_ids });
    const permissions = useDetailPermission();

    useEffect(() => {
        const newPermission = [];
        if ((infos.type !== 4 && infos.type !== 6)) {
            if (permissions && permissions[0]) {
                permissions.forEach(p => {
                    if (p.staff_object_id && p.scope_id) {
                        newPermission.push(p.scope_id);
                    }
                })
            }
            setCompanies([...companiesData.filter(c => newPermission.includes(c.id))]);
        } else {
            setCompanies([...companiesData]);
        }
    }, [permissions, infos.type, companiesData])

    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className='card'>
            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    {(companies && companies[0]) ? <MultiSelectList title="Công ty xem tin" value={infos.company_ids} data={companies}
                        setValue={e => setInfos({ ...infos, company_ids: e })} /> : <MultiSelectList title="Công ty xem tin" data={[]} />}
                </div>
                <div className="col-12 lg:col-6">
                    {(exchanges && exchanges[0]) ? <MultiSelectList title="Phòng ban xem tin" value={infos.exchange_ids} data={(infos.company_ids && infos.company_ids[0]) ? exchanges : []}
                        setValue={e => setInfos({ ...infos, exchange_ids: e })} /> : <MultiSelectList title="Phòng ban xem tin" data={[]} />}
                </div>
            </div>
        </div>

    )
};

const DescNews = (props) => {
    const { infos, setInfos } = props;
    return (
        <div style={{ backgroundColor: '#f8f9fa' }} className='card'>
            <label className="block text-900 font-medium w-4 mb-2 mr-2">Mô tả ngắn</label>
            <InputTextarea value={infos.desc_short} onChange={e => setInfos({ ...infos, desc_short: e.target.value })}
                autoResize rows={6} cols={30} className='w-full mb-6' />
            <label className="block text-900 font-medium w-4 mb-2 mr-2">Nội dung chi tiết (*)</label>
            <EditorV2 data={infos.desc_detail} setData={e => setInfos({ ...infos, desc_detail: e })} height="1200px" />
        </div>
    )
}

const UpdateNews = () => {
    const { id } = useParams();
    const newsInfo = useDetailNews(id);
    const [news, setNews] = useState({});
    const [avatar, setAvatar] = useState('');
    const [data, setData] = useState([{ idz: 1, content: '' }]);
    const [infos, setInfos] = useState({ comment_type: 1, priority_level: 3, hashtag: '', title: '', honor_units: '', honor_spending: '', allow_member: '', status: true });

    useEffect(() => {
        if (Number(id)) {
            let news = {
                ...infos, ...newsInfo, status: newsInfo.status === 0 ? false : true,
                company_ids: newsInfo.company_ids ? JSON.parse(newsInfo.company_ids) : [],
                exchange_ids: newsInfo.exchange_ids ? JSON.parse(newsInfo.exchange_ids) : [],
                options: newsInfo.vote_option ? JSON.parse(newsInfo.vote_option).title : '',
            };
            if (newsInfo) {
                if (news.register_time_start) news.register_time_start = databaseDate(news.register_time_start);
                if (news.register_time_end) news.register_time_end = databaseDate(news.register_time_end);
                if (news.checkin_time_start) news.checkin_time_start = databaseDate(news.checkin_time_start);
                if (news.checkin_time_end) news.checkin_time_end = databaseDate(news.checkin_time_end);
                if (news.event_time_start) news.event_time_start = databaseDate(news.event_time_start);
                if (news.event_time_end) news.event_time_end = databaseDate(news.event_time_end);
                news.allow_register = newsInfo.allow_register === 0 ? false : true;
            };
            setInfos({ ...news })
            setNews({ ...news })
            if (newsInfo.vote_option && JSON.parse(newsInfo.vote_option)) {
                let newData = [];
                JSON.parse(newsInfo.vote_option).forEach((o, index) => {
                    newData.push({ idz: index, content: o });
                });
                setData([...newData])
            };
            if (newsInfo.avatar) setAvatar({ preview: newsInfo.avatar });
        };
    }, [newsInfo]);

    const handleData = () => {
        if (((new Date(infos.checkin_time_start)).getTime() > (new Date(infos.event_time_start)).getTime())) {
            return "Bạn đang để thời gian bắt đầu checkin lớn hơn thời gian diễn ra sự kiện, vui lòng chọn lại!"
        }
        if ((new Date(infos.register_time_start)).getTime() > (new Date(infos.event_time_start)).getTime()) {
            return "Bạn đang để thời gian bắt đầu đăng ký lớn hơn thời gian diễn ra sự kiện, vui lòng chọn lại!"
        }
        let newData = [];
        if (data && data[0] && data[0].content) {
            data.forEach(d => {
                if (d.content) newData.push(d.content);
            });
        };
        if (!avatar) {
            return "Vui lòng chọn ảnh đại diện"
        }
        let info = {
            ...infos, status: infos.status ? 1 : 0, avatar: avatar, vote_option: newData, allow_register: infos.allow_register ? 1 : 0,
            allow_member: infos.allow_member ? Number(infos.allow_member) : undefined,
        };
        if (Number(id) && news.allow_member && !infos.allow_member) info.allow_member = 'none'
        if (Number(id)) {
            info = { ...removePropObject(info, news), id: id }
            info.avatar = newsInfo.avatar ? (avatar ? (String(avatar.preview) === newsInfo.avatar ? undefined : avatar) : 'none') : (avatar ? avatar : undefined);
        }
        info = {
            ...info, register_time_start: infos.register_time_start ? databaseDate(infos.register_time_start) : undefined,
            register_time_end: infos.register_time_end ? databaseDate(infos.register_time_end) : undefined,
            checkin_time_start: infos.checkin_time_start ? databaseDate(infos.checkin_time_start) : undefined,
            checkin_time_end: infos.checkin_time_end ? databaseDate(infos.checkin_time_end) : undefined,
            event_time_start: infos.event_time_start ? databaseDate(infos.event_time_start) : undefined,
            event_time_end: infos.event_time_end ? databaseDate(infos.event_time_end) : undefined,
        };
        return info;
    };

    return (
        <AddForm checkId={Number(id)} title='tin tức' handleData={handleData}
            route={Number(id) ? '/news/update' : '/news/add'}
            actions={{ add: addNews, update: updateNews }}
            refreshObjects={[setInfos]}>
            <InfoRequired infos={infos} setInfos={setInfos} data={data} setData={setData} avatar={avatar} setAvatar={setAvatar} />
            <Scopes infos={infos} setInfos={setInfos} />
            <DescNews infos={infos} setInfos={setInfos} />
        </AddForm>
    )
};

export default UpdateNews;
