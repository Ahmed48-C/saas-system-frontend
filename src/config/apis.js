export const BASE_URL = 'http://localhost:8000';
// export const BASE_URL = 'https://azzamting.pythonanywhere.com/';

export const API_ENDPOINTS = {

  DELETE_LOCATION: (id) => `${BASE_URL}/api/delete/location/${id}/`,
  DELETE_LOCATIONS: () => `${BASE_URL}/api/delete/locations/`,
  POST_LOCATION: () => `${BASE_URL}/api/post/location/`,
  PUT_LOCATION: (id) => `${BASE_URL}/api/put/location/${id}/`,
  GET_LOCATIONS: (from, to) => `${BASE_URL}/api/get/locations/?from=${from}&to=${to}`,
  GET_LOCATION: (id) => `${BASE_URL}/api/get/location/${id}/`,

  DELETE_SUPPLIER: (id) => `${BASE_URL}/api/delete/supplier/${id}/`,
  DELETE_SUPPLIERS: () => `${BASE_URL}/api/delete/suppliers/`,
  POST_SUPPLIER: () => `${BASE_URL}/api/post/supplier/`,
  PUT_SUPPLIER: (id) => `${BASE_URL}/api/put/supplier/${id}/`,
  GET_SUPPLIERS: (from, to) => `${BASE_URL}/api/get/suppliers/?from=${from}&to=${to}`,
  GET_SUPPLIER: (id) => `${BASE_URL}/api/get/supplier/${id}/`,

  DELETE_PRODUCT: (id) => `${BASE_URL}/api/delete/product/${id}/`,
  DELETE_PRODUCTS: () => `${BASE_URL}/api/delete/products/`,
  POST_PRODUCT: () => `${BASE_URL}/api/post/product/`,
  PUT_PRODUCT: (id) => `${BASE_URL}/api/put/product/${id}/`,
  GET_PRODUCTS: (from, to) => `${BASE_URL}/api/get/products/?from=${from}&to=${to}`,
  GET_PRODUCT: (id) => `${BASE_URL}/api/get/product/${id}/`,

  DELETE_STORE: (id) => `${BASE_URL}/api/delete/store/${id}/`,
  DELETE_STORES: () => `${BASE_URL}/api/delete/stores/`,
  POST_STORE: () => `${BASE_URL}/api/post/store/`,
  PUT_STORE: (id) => `${BASE_URL}/api/put/store/${id}/`,
  GET_STORES: (from, to) => `${BASE_URL}/api/get/stores/?from=${from}&to=${to}`,
  GET_STORE: (id) => `${BASE_URL}/api/get/store/${id}/`,

  DELETE_INVENTORY: (id) => `${BASE_URL}/api/delete/inventory/${id}/`,
  DELETE_INVENTORIES: () => `${BASE_URL}/api/delete/inventories/`,
  POST_INVENTORY: () => `${BASE_URL}/api/post/inventory/`,
  PUT_INVENTORY: (id) => `${BASE_URL}/api/put/inventory/${id}/`,
  GET_INVENTORIES: (from, to) => `${BASE_URL}/api/get/inventories/?from=${from}&to=${to}`,
  GET_INVENTORY: (id) => `${BASE_URL}/api/get/inventory/${id}/`,

  DELETE_REMINDER: (id) => `${BASE_URL}/api/delete/reminder/${id}/`,
  POST_REMINDER: () => `${BASE_URL}/api/post/reminder/`,
  GET_REMINDERS: () => `${BASE_URL}/api/get/reminders/`,
  GET_REMINDER: (id) => `${BASE_URL}/api/get/reminder/${id}/`,
  PUT_REMINDER: (id) => `${BASE_URL}/api/put/reminder/${id}/`,

  DELETE_CUSTOMER: (id) => `${BASE_URL}/api/delete/customer/${id}/`,
  DELETE_CUSTOMERS: () => `${BASE_URL}/api/delete/customers/`,
  POST_CUSTOMER: () => `${BASE_URL}/api/post/customer/`,
  PUT_CUSTOMER: (id) => `${BASE_URL}/api/put/customer/${id}/`,
  GET_CUSTOMERS: (from, to) => `${BASE_URL}/api/get/customers/?from=${from}&to=${to}`,
  GET_CUSTOMER: (id) => `${BASE_URL}/api/get/customer/${id}/`,

  DELETE_PURCHASE_ORDER: (id) => `${BASE_URL}/api/delete/purchase_order/${id}/`,
  DELETE_PURCHASE_ORDER_STOCK: (id) => `${BASE_URL}/api/delete/purchase_order_stock/${id}/`,
  DELETE_PURCHASE_ORDERS: () => `${BASE_URL}/api/delete/purchase_orders/`,
  POST_PURCHASE_ORDER: () => `${BASE_URL}/api/post/purchase_order/`,
  PUT_PURCHASE_ORDER: (id) => `${BASE_URL}/api/put/purchase_order/${id}/`,
  GET_PURCHASE_ORDERS: (from, to) => `${BASE_URL}/api/get/purchase_orders/?from=${from}&to=${to}`,
  GET_PURCHASE_ORDER: (id) => `${BASE_URL}/api/get/purchase_order/${id}/`,

  DELETE_BALANCE: (id) => `${BASE_URL}/api/delete/balance/${id}/`,
  DELETE_BALANCES: () => `${BASE_URL}/api/delete/balances/`,
  POST_BALANCE: () => `${BASE_URL}/api/post/balance/`,
  PUT_BALANCE: (id) => `${BASE_URL}/api/put/balance/${id}/`,
  GET_BALANCES: (from, to) => `${BASE_URL}/api/get/balances/?from=${from}&to=${to}`,
  GET_BALANCE: (id) => `${BASE_URL}/api/get/balance/${id}/`,

  DELETE_BALANCE_LOG: (id) => `${BASE_URL}/api/delete/balance_log/${id}/`,
  DELETE_BALANCE_LOGS: () => `${BASE_URL}/api/delete/balance_logs/`,
  POST_BALANCE_LOG: () => `${BASE_URL}/api/post/balance_log/`,
  PUT_BALANCE_LOG: (id) => `${BASE_URL}/api/put/balance_log/${id}/`,
  GET_BALANCE_LOGS: (from, to) => `${BASE_URL}/api/get/balance_logs/?from=${from}&to=${to}`,
  GET_BALANCE_LOG: (id) => `${BASE_URL}/api/get/balance_log/${id}/`,

  DELETE_TRANSFER: (id) => `${BASE_URL}/api/delete/transfer/${id}/`,
  DELETE_TRANSFERS: () => `${BASE_URL}/api/delete/transfers/`,
  POST_TRANSFER: () => `${BASE_URL}/api/post/transfer/`,
  PUT_TRANSFER: (id) => `${BASE_URL}/api/put/transfer/${id}/`,
  GET_TRANSFERS: (from, to) => `${BASE_URL}/api/get/transfers/?from=${from}&to=${to}`,
  GET_TRANSFER: (id) => `${BASE_URL}/api/get/transfer/${id}/`,

  DELETE_SALE_ORDER: (id) => `${BASE_URL}/api/delete/sales_order/${id}/`,
  DELETE_SALE_ORDERS: () => `${BASE_URL}/api/delete/sales_orders/`,
  POST_SALE_ORDER: () => `${BASE_URL}/api/post/sales_order/`,
  PUT_SALE_ORDER: (id) => `${BASE_URL}/api/put/sales_order/${id}/`,
  GET_SALE_ORDERS: (from, to) => `${BASE_URL}/api/get/sales_orders/?from=${from}&to=${to}`,
  GET_SALE_ORDER: (id) => `${BASE_URL}/api/get/sales_order/${id}/`,
  GET_COMPLETED_SALE_ORDERS: (from, to) => `${BASE_URL}/api/get/completed_sales_orders/?from=${from}&to=${to}`,
  GET_DELIVERY_SALE_ORDERS: (from, to) => `${BASE_URL}/api/get/delivery_sales_orders/?from=${from}&to=${to}`,
  GET_CANCELLED_SALE_ORDERS: (from, to) => `${BASE_URL}/api/get/cancelled_sales_orders/?from=${from}&to=${to}`,

  DELETE_COURIER: (id) => `${BASE_URL}/api/delete/courier/${id}/`,
  DELETE_COURIERS: () => `${BASE_URL}/api/delete/couriers/`,
  POST_COURIER: () => `${BASE_URL}/api/post/courier/`,
  PUT_COURIER: (id) => `${BASE_URL}/api/put/courier/${id}/`,
  GET_COURIERS: (from, to) => `${BASE_URL}/api/get/couriers/?from=${from}&to=${to}`,
  GET_COURIER: (id) => `${BASE_URL}/api/get/courier/${id}/`,

  DELETE_CLIENT: (id) => `${BASE_URL}/api/delete/client/${id}/`,
  DELETE_CLIENTS: () => `${BASE_URL}/api/delete/clients/`,
  POST_CLIENT: () => `${BASE_URL}/api/post/client/`,
  PUT_CLIENT: (id) => `${BASE_URL}/api/put/client/${id}/`,
  GET_CLIENTS: (from, to) => `${BASE_URL}/api/get/clients/?from=${from}&to=${to}`,
  GET_CLIENT: (id) => `${BASE_URL}/api/get/client/${id}/`,

  DELETE_INVENTORY_LOG: (id) => `${BASE_URL}/api/delete/inventory_log/${id}/`,
  DELETE_INVENTORY_LOGS: () => `${BASE_URL}/api/delete/inventory_logs/`,
  GET_INVENTORY_LOGS: (from, to) => `${BASE_URL}/api/get/inventory_logs/?from=${from}&to=${to}`,

  GET_CLIENT_BALANCES: (from, to) => `${BASE_URL}/api/get/client_balances/?from=${from}&to=${to}`,

  GET_BALANCES_HISTORY: (from, to) => `${BASE_URL}/api/get/balances_history/?from=${from}&to=${to}`,
  DELETE_BALANCE_HISTORY: (id) => `${BASE_URL}/api/delete/balance_history/${id}/`,
  DELETE_BALANCES_HISTORY: () => `${BASE_URL}/api/delete/balances_history/`,

  DELETE_EXPENSE: (id) => `${BASE_URL}/api/delete/expense/${id}/`,
  DELETE_EXPENSES: () => `${BASE_URL}/api/delete/expenses/`,
  POST_EXPENSE: () => `${BASE_URL}/api/post/expense/`,
  PUT_EXPENSE: (id) => `${BASE_URL}/api/put/expense/${id}/`,
  GET_EXPENSES: (from, to) => `${BASE_URL}/api/get/expenses/?from=${from}&to=${to}`,
  GET_EXPENSE: (id) => `${BASE_URL}/api/get/expense/${id}/`,

  DELETE_INCOME: (id) => `${BASE_URL}/api/delete/income/${id}/`,
  DELETE_INCOMES: () => `${BASE_URL}/api/delete/incomes/`,
  POST_INCOME: () => `${BASE_URL}/api/post/income/`,
  PUT_INCOME: (id) => `${BASE_URL}/api/put/income/${id}/`,
  GET_INCOMES: (from, to) => `${BASE_URL}/api/get/incomes/?from=${from}&to=${to}`,
  GET_INCOME: (id) => `${BASE_URL}/api/get/income/${id}/`,

  GET_INCOME_CATEGORIES: () => `${BASE_URL}/api/get/income_categories/`,
  GET_EXPENSE_CATEGORIES: () => `${BASE_URL}/api/get/expense_categories/`,

  POST_INCOME_CATEGORY: () => `${BASE_URL}/api/post/income_category/`,
  POST_EXPENSE_CATEGORY: () => `${BASE_URL}/api/post/expense_category/`,

  DELETE_INVOICE: (id) => `${BASE_URL}/api/delete/invoice/${id}/`,
  DELETE_INVOICES: () => `${BASE_URL}/api/delete/invoices/`,
  POST_INVOICE: () => `${BASE_URL}/api/post/invoice/`,
  PUT_INVOICE: (id) => `${BASE_URL}/api/put/invoice/${id}/`,
  GET_INVOICES: (from, to) => `${BASE_URL}/api/get/invoices/?from=${from}&to=${to}`,
  GET_INVOICE: (id) => `${BASE_URL}/api/get/invoice/${id}/`,

  GET_TASKS: () => `${BASE_URL}/api/get/tasks/`,
  GET_TASK: (id) => `${BASE_URL}/api/get/task/${id}/`,
  POST_TASK: () => `${BASE_URL}/api/post/task/`,
  PUT_TASK: (id) => `${BASE_URL}/api/put/task/${id}/`,
  DELETE_TASK: (id) => `${BASE_URL}/api/delete/task/${id}/`,
  GET_TASK_STATUS: () => `${BASE_URL}/api/get/tasks_status/`,
  GET_TASK_PRIORITY: () => `${BASE_URL}/api/get/tasks_priority/`,

  GET_INCOME_30_DAYS: () => `${BASE_URL}/api/get/incomes/last-30-days/`,
  GET_EXPENSE_30_DAYS: () => `${BASE_URL}/api/get/expenses/last-30-days/`,

  GET_INCOME_CURRENT_MONTH: () => `${BASE_URL}/api/get/incomes/current-month/`,
  GET_EXPENSE_CURRENT_MONTH: () => `${BASE_URL}/api/get/expenses/current-month/`,

  GET_SALES_30_DAYS: () => `${BASE_URL}/api/get/sales_orders/last-30-days/`,
  GET_SALES_CURRENT_MONTH: () => `${BASE_URL}/api/get/sales_orders/current-month/`,

  GET_TOTAL_STOCK: () => `${BASE_URL}/api/get/total-stock/`,
  GET_TOTAL_BALANCE: () => `${BASE_URL}/api/get/total-balance/`,

  GET_PURCHASE_30_DAYS: () => `${BASE_URL}/api/get/purchase_orders/last-30-days/`,
  GET_PURCHASE_CURRENT_MONTH: () => `${BASE_URL}/api/get/purchase_orders/current-month/`,
};
