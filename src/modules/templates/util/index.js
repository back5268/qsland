import { useState, useEffect } from 'react';
import { listTemplate, countTemplate, detailTemplate } from '../api';

export const useListTemplate = (params) => {
    const [data, setData] = useState([]);
    async function fetchData() {
        const response = await listTemplate({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useCountTemplate = (params) => {
    const [data, setData] = useState(null);
    async function fetchData() {
        const response = await countTemplate({ ...params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [JSON.stringify(params)]);
    return data;
};

export const useDetailTemplate = (params) => {
    const [data, setData] = useState({});
    async function fetchData() {
        const response = await detailTemplate({ id: params });
        if (response.data.status) setData(response.data.data);
    };
    useEffect(() => { fetchData() }, [params]);
    return data;
};

export const templateTypes = [
    { name: "Hợp đồng", id: 2 },
    { name: "Báo giá", id: 1 },
];

export const templateLevels = [
    { name: "Mặc định", id: 1 },
    { name: "Khác", id: 2 },
];

export const titles = [
    ['Nội dung'],
    ['Nội dung email', 'Nội dung file PDF']
];

export const initForms = [
    {
        id: 1,
        data: [
            `<p>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        
        </p>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        </style>
        
        <style>
            .template {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-size: 16px;
                font-family: 'Roboto', sans-serif;
                color: #333;
            }
            
            .header {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }
            
            .header .center {
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
            }
            
            .header .left {
                width: 240px;
                text-align: center;
            }
            
            .header .right {
                text-align: center;
            }
            
            .header .right .date {
                display: flex;
                justify-content: center;
            }
            
            .header .date .dateTitle {
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                padding: 0 16px;
                margin: 0 2px;
            }
            
            .header span {
                line-height: 2;
            }
            
            span {
                line-height: 1.5;
            }
            
            table {
                width: 100%;
                border: 1px solid gray;
            }
            
            tr,
            td,
            th {
                height: 48px;
                border: 1px solid gray;
                align-items: center;
                text-align: center;
            }
            
            th {
                background-color: #999;
            }
        </style>
        
        
        
        <div id="template">
            <div class="header">
                <div class="left">
                    <span>Phân khu</span>
                    <div style="height: 32px; width: 240px; background-color: #0093E9; background-image: linear-gradient(90deg, #0093E9 0%, #80D0C7 100%);">
                        <span style="color: white;"><strong style="color: rgb(255, 255, 255);">SUN HARBOR3</strong></span>
                    </div>
                    <span>Dự án</span> <br>
                    <span style="font-weight: 900;">AQUA CITY</span>
                </div>
                <div class="center">
                    <span>CÔNG TY CỔ PHẦN NOVAREAL</span>
                    <span>BẢNG BÁO GIÁ VÀ LỊCH THANH TOÁN</span>
                    <h2 style="text-decoration: underline; margin-top: 16px; color: red; font-size: 28px;">PHƯƠNG ÁN 4</h2>
                </div>
                <div class="right">
                    <span>CTBH cập nhật ngày</span>
                    <div class="date">
                        <div class="dateTitle" style=" margin: 0 5px; background-image: linear-gradient(90deg, #0093E9 0%, #80D0C7 100%); color: white;">
                            13</div>
                        <div class="dateTitle" style="margin: 0 5px; background-color: #0093E9; background-image: linear-gradient(90deg, #0093E9 0%, #80D0C7 100%); color: white;">
                            05</div>
                        <div class="dateTitle" style="margin: 0 5px; background-color: #0093E9; background-image: linear-gradient(90deg, #0093E9 0%, #80D0C7 100%); color: white;">
                            2022</div>
                    </div>
                    <span>Ngày báo giá</span>
                    <div class="date">
                        <div class="dateTitle" style=" border: 2px solid red; color: red;">13</div>
                        <div class="dateTitle" style=" border: 2px solid red; color: red;">05</div>
                        <div class="dateTitle" style=" border: 2px solid red; color: red;">2022</div>
                    </div>
                </div>
            </div> <br>
            <div class="body">
                <span style="font-weight: 700;">Kính gửi: Quý khách hàng</span> <br>
                <span>CÔNG TY CỔ PHẦN NOVAREAL hân hạnh được đón tiếp và cảm ơn Ông/Bà đã quan tâm đến sản phẩm tại Phân khu
                    SUN HABOR 3 – Dự án QUA CITY. Theo yêu cầu của Ông/Bà, chúng tôi trân trọng giới thiệu thông tin sản
                    phẩm và gửi bảng giới thiệu giá tham khảo như sau:</span> <br> <br>
                <table>
                    <tbody>
                        <tr>
                            <th style="background-image: linear-gradient(90deg, rgb(0, 147, 233) 0%, rgb(128, 208, 199) 100%); color: white; border-color: rgb(0, 240, 240);">Mã sản
                                phẩm BĐS</th>
                            <th style="background-color: rgb(239, 239, 239);">Kích thước (m)</th>
                            <th style="background-color: rgb(239, 239, 239);">Loại sản phẩm</th>
                            <th style="background-color: rgb(239, 239, 239);">Diện tích đất (m)</th>
                            <th style="background-color: rgb(239, 239, 239);">Diện tích sàn (m<sup style="font-size: 12px;">2</sup>)</th>
                            <th style="background-color: rgb(239, 239, 239);">Hướng nhà</th>
                            <th style="background-color: rgb(239, 239, 239);">Xây dựng</th>
                        </tr>
                        <tr>
                            <td style="font-weight: 900; border-color: rgb(0, 240, 240); font-size: 24px;"><span style="color: rgb(0, 240, 240); font-size: 24px;">PIKACHU</span></td>
                            <td>Kích tdước (m)</td>
                            <td>Loại sản phẩm</td>
                            <td>Diện tích đất (m)</td>
                            <td>Diện tích sàn (m<sup style="font-size: 12px;">2</sup>)</td>
                            <td>Hướng nhà</td>
                            <td>Xây dựng</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <th style="background-color: rgb(239, 239, 239);">Tiêu chuẩn bàn giao</th>
                            <th style="background-color: rgb(239, 239, 239);">Ghi chú</th>
                            <th style="background-color: rgb(239, 239, 239);">Mã thiết kế</th>
                            <th style="background-color: rgb(239, 239, 239);">Ngân hàng</th>
                            <th style="background-image: linear-gradient(90deg, rgb(246, 211, 101) 0%, rgb(253, 160, 133) 100%); color: white; border-color: rgb(255, 153, 0);">Tổng giá trị (GIÁ DỰ KIẾN không bao gồm VAT)</th>
                        </tr>
                        <tr>
                            <td>Tiêu chuẩn bàn giao</td>
                            <td>Ghi chú</td>
                            <td>Mã thiết kế</td>
                            <td>Ngân hàng</td>
                            <td style="font-weight: 900; color: red; border-color: rgb(255, 153, 0); font-size: 24px;">99,999,999,999 <u style="font-weight: 900; color: red; font-size: 24px;">đ</u></td>
                        </tr>
                    </tbody>
                </table> <br>
            </div>
        </div>`
        ]
    },
    {
        id: 2,
        data: [ '', '']
    }
]