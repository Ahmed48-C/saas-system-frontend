import React, { useEffect, useState } from 'react'
import { InputSelect, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { countryList } from '../../config/common'
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter }) => {

    // State to hold the list of countries
    const [countryOptions, setCountryOptions] = useState([]);

    useEffect(() => {
        // Map through country list and sort them alphabetically
        const sortedCountries = countryList
            .map(country => ({
                name: country,
                value: country // Setting value to country name
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        // Set the sorted countries in the state
        setCountryOptions(sortedCountries);
    }, []);

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
                    maxLength={50}
                />
            </Grid>
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
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Note'
                    name='note'
                    id='note'
                    value={currentFilter.note}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, note: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Street'
                    name='street'
                    id='street'
                    value={currentFilter.street}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, street: e.target.value })}
                    maxLength={200}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='City'
                    name='city'
                    id='city'
                    value={currentFilter.city}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, city: e.target.value })}
                    maxLength={200}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='State'
                    name='state'
                    id='state'
                    value={currentFilter.state}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, state: e.target.value })}
                    maxLength={200}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Postcode'
                    name='postcode'
                    id='postcode'
                    value={currentFilter.postcode}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, postcode: e.target.value })}
                    maxLength={50}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={countryOptions}
                    label='Country'
                    name='country'
                    id='country'
                    value={currentFilter.country}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, country: e.target.value })}
                />
            </Grid>
        </>
    )
}

export default FilterContent