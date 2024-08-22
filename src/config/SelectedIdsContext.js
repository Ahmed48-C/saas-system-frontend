// IDContext.js
import React, { createContext, useState, useContext } from 'react';

const SelectedIdsContext = createContext();

export const SelectedIDsProvider = ({ children }) => {
    const [ids, setIds] = useState({
        inventories: [],
        stores: [],
        locations: [],
        products: [],
        suppliers: [],
    });

    return (
        <SelectedIdsContext.Provider value={{ ids, setIds }}>
        {children}
        </SelectedIdsContext.Provider>
    );
};

export const UseIDs = () => useContext(SelectedIdsContext);
