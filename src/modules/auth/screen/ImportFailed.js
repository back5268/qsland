import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Fragment, useEffect, useState } from "react";

const ImportFailed = () => {
    const import_failed = JSON.parse(localStorage.getItem('import_failed'));
    const [data, setData] = useState([])
    const totalRecords = data.length;

    useEffect(() => {
        if (import_failed) {
            setData([...import_failed.listError]);
        };
    }, [import_failed.title])


    return (
        <div className="card w-8 mt-8" style={{ margin: '0 auto' }}>
            <h4>Kết quả import {import_failed.title} </h4>
            <div className="flex flex-column mb-4">
                <label className="block mt-2 text-900 font-medium w-6 mr-2">Thành công: {import_failed && import_failed.success} </label>
                <label className="block mt-2 text-900 font-medium w-6 mr-2">Thất bại: {import_failed && import_failed.fail} </label>
            </div>

            <DataTable value={data}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginator rows='100' totalRecords={totalRecords} selectionMode="checkbox" showGridlines
                dataKey="id" currentPageReportTemplate="Tổng số: {totalRecords} bản ghi">
                <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ width: '1rem' }} bodyStyle={{ textAlign: 'center' }} />
                <Column header="Nội dung" body={e => <Fragment>{e}</Fragment>} style={{ width: '50rem' }} />
            </DataTable>
        </div>
    )
};

export default ImportFailed;