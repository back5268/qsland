import { importCustomer } from "../api";
import Import from "@/components/Import";

const ImportCustomer = () => {
    return <Import title="người dùng" action={importCustomer} template="https://devapi.qsland.s-tech.info/mau_import_customer.xlsx" />;
};

export default ImportCustomer;