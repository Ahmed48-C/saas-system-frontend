import React from 'react'
import { InputSelect, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { useCountries } from 'use-react-countries';

const FilterContent = ({ currentFilter, setCurrentFilter }) => {

    return (
        <>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Code'
                    name='code'
                    id='code'
                    value={currentFilter.code}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, code: e.target.value })}
                    maxLength={80}
                />
            </Grid>
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
        </>
    )
}

export default FilterContent