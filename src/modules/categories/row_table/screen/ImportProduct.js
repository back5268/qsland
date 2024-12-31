import { importProduct } from "../api";
import Import from "@/components/Import";

const ImportProduct = () => {
    return <Import title="sản phẩm" action={importProduct} template="https://devapi.qsland.s-tech.info/mau_import_product.xlsx" />;
};

export default ImportProduct;