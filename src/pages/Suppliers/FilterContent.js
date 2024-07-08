import React from 'react'
import { Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'

const FilterContent = ({ currentFilter, setCurrentFilter }) => {

    return (
        <>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Name'
                    name='name'
                    id='name'
                    value={currentFilter.name}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, name: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Phone'
                    name='phone'
                    id='phone'
                    value={currentFilter.phone}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, phone: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Email'
                    name='email'
                    id='email'
                    value={currentFilter.email}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, email: e.target.value })}
                />
            </Grid>
        </>
    )
}

export default FilterContent