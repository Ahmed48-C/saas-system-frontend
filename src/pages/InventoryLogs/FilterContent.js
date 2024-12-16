import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter, handleStores, stores, handleProducts, products }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {;
        filterFetchDropdownRecords(`${BASE_URL}/api/get/stores/`, handleStores)
        filterFetchDropdownRecords(`${BASE_URL}/api/get/products/`, handleProducts)
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
                    label='User Profile'
                    name='userprofile'
                    id='userprofile'
                    value={currentFilter.userprofile}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, userprofile: e.target.value })}
                    maxLength={100}
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
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Action'
                    name='action'
                    id='action'
                    value={currentFilter.action}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, action: e.target.value })}
                    maxLength={100}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Action Date'
                    name='action_date'
                    id='action_date'
                    value={currentFilter.action_date}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, action_date: e.target.value })}
                    maxLength={100}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Auto Generated Note'
                    name='auto_generated_note'
                    id='auto_generated_note'
                    value={currentFilter.auto_generated_note}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, auto_generated_note: e.target.value })}
                    maxLength={400}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Stock'
                    name='stock'
                    id='stock'
                    value={currentFilter.stock}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, stock: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Stock Before Action'
                    name='stock_before_action'
                    id='stock_before_action'
                    value={currentFilter.stock_before_action}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, stock_before_action: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Stock After Action'
                    name='stock_after_action'
                    id='stock_after_action'
                    value={currentFilter.stock_after_action}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, stock_after_action: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent