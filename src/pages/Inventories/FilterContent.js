import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter, handleProducts, products, stores, handleStores }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/products/`, handleProducts)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/stores/`, handleStores)
        setLoading(false);
    }, []);

    return (
        <>
        {loading ? (
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', paddingLeft: '32px' }}>
                <Loader />
            </Grid>
        ) : (
        <>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='In Stock'
                    name='in_stock'
                    id='in_stock'
                    value={currentFilter.in_stock}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, in_stock: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='On Order'
                    name='on_order'
                    id='on_order'
                    value={currentFilter.on_order}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, on_order: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Reserved'
                    name='reserved'
                    id='reserved'
                    value={currentFilter.reserved}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, reserved: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Minimum In Stock'
                    name='min_stock'
                    id='min_stock'
                    value={currentFilter.min_stock}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, min_stock: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Maximum In Stock'
                    name='max_stock'
                    id='max_stock'
                    value={currentFilter.max_stock}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, max_stock: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={products.map(product => ({
                        value: product.id.toString(),
                        name: formatFilterRecordDropdown(product.name)
                    }))}
                    label='Product'
                    name='product'
                    id='product'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, product_id: e.target.value })}
                    value={currentFilter.product_id}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={stores.map(store => ({
                        value: store.id.toString(),
                        name: formatFilterRecordDropdown(store.name)
                    }))}
                    label='Store'
                    name='store'
                    id='store'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, store_id: e.target.value })}
                    value={currentFilter.store_id}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent