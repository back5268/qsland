import { Login, Loading, SetPassword, ChangePassword, ForgotPassword, VerifyAccount, ImportFailed } from "@/modules/auth";
import DashBoard from "@/modules/dashboard/screen/DashBoard";

import { ErrorPage, AccessDeniedPage} from "@/modules/auth/screen/DefaultPage";
import { User, UpdateUser, GroupSale, UpdateGroupSale } from "@/modules/users";
import {
    Customer, UpdateCustomer, HistoryCare, SourceCustomer, 
    UpdateSourceCustomer, GroupCustomer, UpdateGroupCustomer,
    Campaign, UpdateCampaign, Violation, ApprovalOfExplanation, 
    SendExplanation, MoreCustomer, 
} from "@/modules/customers";
import { Company, UpdateCompany, Exchange, UpdateExchange } from "@/modules/companys";
import { Category, UpdateCategory, Building, UpdateBuilding, ManagerCart, UpdateManagerCart, RowTable, UpdateRowTable, LogImportProduct } from "@/modules/categories";
import { Permission, UpdatePermission } from "@/modules/permissions";
import { SalesPolicy, UpdateSalesPolicy, PaymentProgress, UpdatePaymentProgress, SaleCampaign, UpdateSaleCampaign, TransactionCustomer } from "@/modules/sales_manager";
import { Investor, UpdateInvestor } from "@/modules/investor";
import { Bank, UpdateBank, RevenueCode, UpdateRevenueCode, PaymentPending, UpdatePaymentPending, Payment, UpdatePayment } from "@/modules/bank";
import { Template, UpdateTemplate } from "@/modules/templates";
import { Contract, Request, XemNhatKy } from "@/modules/transaction_management";
import { News, UpdateNews, RegisterNews } from "@/modules/news";

const publicRoutes = [
    { path: "/", component: DashBoard },
    { path: "/auth/login", component: Login, layout: null, public: true },
    { path: "/auth/loading", component: Loading, layout: null, public: true },
    { path: "/auth/forgotpassword", component: ForgotPassword, layout: null, public: true },
    { path: "/auth/verifyaccount", component: VerifyAccount, layout: null, public: true },
    { path: "/auth/changepassword", component: ChangePassword, layout: null },
    { path: "/auth/setpassword", component: SetPassword, layout: null, public: true },
    { path: "/import_failed", component: ImportFailed, layout: null },

    { path: "/user", component: User },
    { path: "/user/add", component: UpdateUser },
    { path: "/user/detail/:id", component: UpdateUser },

    { path: "/group_sale", component: GroupSale },
    { path: "/group_sale/add", component: UpdateGroupSale },
    { path: "/group_sale/detail/:id", component: UpdateGroupSale },

    { path: "/exchange", component: Exchange },
    { path: "/exchange/add", component: UpdateExchange },
    { path: "/exchange/detail/:id", component: UpdateExchange },

    { path: "/company", component: Company },
    { path: "/company/add", component: UpdateCompany },
    { path: "/company/detail/:id", component: UpdateCompany },

    { path: "/customer", component: Customer },
    { path: "/customer/add", component: UpdateCustomer },
    { path: "/customer/detail/:id", component: HistoryCare },

    { path: "/source_customer", component: SourceCustomer },
    { path: "/source_customer/add", component: UpdateSourceCustomer },
    { path: "/source_customer/detail/:id", component: UpdateSourceCustomer },

    { path: "/group_customer", component: GroupCustomer },
    { path: "/group_customer/add", component: UpdateGroupCustomer },
    { path: "/group_customer/detail/:id", component: UpdateGroupCustomer },

    { path: "/customer_recall", component: MoreCustomer },

    { path: "/campaign", component: Campaign },
    { path: "/campaign/add", component: UpdateCampaign },
    { path: "/campaign/detail/:id", component: UpdateCampaign },

    { path: "/violate", component: Violation },
    { path: "/violate/detail/:id", component: ApprovalOfExplanation },
    { path: "/violate/add/:id", component: SendExplanation },

    { path: "/project", component: Category },
    { path: "/project/add", component: UpdateCategory },
    { path: "/project/detail/:id", component: UpdateCategory },

    { path: "/building", component: Building },
    { path: "/building/add", component: UpdateBuilding },
    { path: "/building/detail/:id", component: UpdateBuilding },

    { path: "/row_table", component: RowTable },
    { path: "/row_table/detail/:id", component: UpdateRowTable },

    { path: "/manager_cart", component: ManagerCart },
    { path: "/manager_cart/add", component: UpdateManagerCart },
    { path: "/manager_cart/detail/:id", component: UpdateManagerCart },

    { path: "/log_import_product", component: LogImportProduct },

    { path: "/permission", component: Permission },
    { path: "/permission/add", component: UpdatePermission },
    { path: "/permission/detail/:id", component: UpdatePermission },

    { path: "/sale_policy", component: SalesPolicy },
    { path: "/sale_policy/add", component: UpdateSalesPolicy },
    { path: "/sale_policy/detail/:id", component: UpdateSalesPolicy },

    { path: "/sale_campaign", component: SaleCampaign },
    { path: "/sale_campaign/add", component: UpdateSaleCampaign },
    { path: "/sale_campaign/detail/:id", component: UpdateSaleCampaign },

    { path: "/payment_progress", component: PaymentProgress },
    { path: "/payment_progress/detail/:id", component: UpdatePaymentProgress },
    
    { path: "/transaction_customer", component: TransactionCustomer },

    { path: "/payment_info", component: Bank },
    { path: "/payment_info/detail/:id", component: UpdateBank },
    { path: "/payment_info/add", component: UpdateBank },

    { path: "/revenue_code", component: RevenueCode },
    { path: "/revenue_code/detail/:id", component: UpdateRevenueCode },
    { path: "/revenue_code/add", component: UpdateRevenueCode },

    { path: "/payment_pending", component: PaymentPending },
    { path: "/payment_pending/detail/:id", component: UpdatePaymentPending },
    { path: "/payment_pending/add", component: UpdatePaymentPending },

    { path: "/payment", component: Payment },
    { path: "/payment/detail/:id", component: UpdatePayment },
    { path: "/payment/add", component: UpdatePayment },

    { path: "/investor", component: Investor },
    { path: "/investor/detail/:id", component: UpdateInvestor },
    { path: "/investor/add", component: UpdateInvestor },

    { path: "/template", component: Template },
    { path: "/template/add", component: UpdateTemplate },
    { path: "/template/detail/:id", component: UpdateTemplate },

    { path: "/contract", component: Contract },
    { path: "/request", component: Request },
    { path: "/contract/detail/:id", component: XemNhatKy },

    { path: "/news", component: News },
    { path: "/news/add", component: UpdateNews },
    { path: "/news/detail/:id", component: UpdateNews },
    { path: "/register_news", component: RegisterNews },
];

const errorPage = { path: "*", component: ErrorPage, layout: null, public: true };
const accessDeniedPage = { path: "*", component: AccessDeniedPage, layout: null, public: true };
const loadingPage = { path: "*", component: Loading, layout: null, public: true };

export {
    publicRoutes,
    accessDeniedPage,
    errorPage,
    loadingPage
}