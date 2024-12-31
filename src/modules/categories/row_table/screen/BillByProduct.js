import Tag from "@/components/Tag";
import { databaseDate } from "@/lib/convertDate";
import { statusBill } from "@/modules/transaction_management/contract/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const { Accordion, AccordionTab } = require("primereact/accordion");
const { useState, useEffect, Fragment } = require("react");

const BillByProduct = ({ list_bill }) => {
    const [data, setData] = useState([])
    useEffect(() => {
        if (list_bill && list_bill[0]) {
            const list = []
            for (const bill of list_bill) {
                const groupKey = bill.customer_id;
                const existingGroup = list.find(l => l.customer_id === groupKey);
                if (existingGroup) {
                    existingGroup.children.push(bill);
                } else {
                    list.push({ customer_id: groupKey, customer_info: (bill.info_customer && JSON.parse(bill.info_customer)), children: [bill] });
                };
            };
            setData([...list])
        }
    }, [JSON.stringify(list_bill)]);

    const BillBody = (bill) => {
        const user = JSON.parse(bill.info_sale);
        return <Fragment>
            <b style={{ color: '#6366F1' }}>{bill.code}</b> <br/>
            <span>Sale: {user.full_name}</span> <br/>
            <span>Sàn: {user.exchange_name}</span>
        </Fragment>
    }

    const StatusBody = (e) => {
        const status = statusBill.find(s => e.status === s.id)
        if (status) return <Tag value={status.name} severity={status.color}></Tag>
    };

    return (
        <Accordion multiple activeIndex={[0]} className="mb-8">
            {data.map((d, index) => {
                return (
                    <AccordionTab key={d.customer_id} header={"Khách hàng giao dịch: " + d.customer_id}>
                        <div style={{ padding: '0 16px' }}>
                            <div className="grid formgrid">
                                <div className="ml-1 col-12 md:col-5">
                                    <p>Họ và tên: </p>
                                </div>
                                <div className="col-12 md:col-6" style={{ color: '#6366F1' }}>
                                    <p><b>{d.customer_info ? d.customer_info.full_name : ''}</b></p>
                                </div>
                            </div>
                            <div className="grid formgrid mt-4">
                                <div className="ml-1 col-12 md:col-5">
                                    <p>CMND / CCCD: </p>
                                </div>
                                <div className="col-12 md:col-6" style={{ color: '#6366F1' }}>
                                    <p><b>{d.customer_info ? d.customer_info.cmt_number : ''}</b></p>
                                </div>
                            </div>
                            <div className="grid formgrid mt-4">
                                <div className="ml-1 col-12 md:col-5">
                                    <p>Địa chỉ thường chú: </p>
                                </div>
                                <div className="col-12 md:col-6" style={{ color: '#6366F1' }}>
                                    <p><b>{d.customer_info ? d.customer_info.address : ''}</b></p>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-4">
                            <DataTable value={d.children || []} dataKey="id" showGridlines emptyMessage={"Không tìm thấy hợp đồng"}>
                                <Column body={e => databaseDate(e.created_at, false, "date")} header="Ngày tạo" bodyStyle={{ textAlign: 'center' }} />
                                <Column body={BillBody} header="Hợp đồng" />
                                <Column body={StatusBody} header="Tình trạng" bodyStyle={{ textAlign: 'center' }} />
                            </DataTable>
                        </div>
                    </AccordionTab>
                )
            })}
        </Accordion>
    )
}

export default BillByProduct