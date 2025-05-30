import React, { createContext, useState, useContext } from 'react';

const SelectedIdsContext = createContext();

export const SelectedIDsProvider = ({ children }) => {
    const [ids, setIds] = useState({
        inventories: [],
        stores: [],
        locations: [],
        products: [],
        suppliers: [],
        customers: [],
        purchase_orders: [],
        balances: [],
        balance_logs: [],
        transfers: [],
        sale_orders: [],
        couriers: [],
        clients: [],
        inventory_logs: [],
        client_balances: [],
        balances_history: [],
        expenses: [],
        incomes: [],
        invoices: [],
    });

    return (
        <SelectedIdsContext.Provider value={{ ids, setIds }}>
        {children}
        </SelectedIdsContext.Provider>
    );
};

export const UseIDs = () => useContext(SelectedIdsContext);
