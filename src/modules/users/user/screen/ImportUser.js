import { importUser } from "../api";
import Import from "@/components/Import";

const ImportUser = () => {
    return <Import title="người dùng" action={importUser} template="https://devapi.qsland.s-tech.info/mau_import_user.xlsx" />;
};

export default ImportUser;