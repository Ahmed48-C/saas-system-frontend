import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import { formatFilterRecordDropdown } from '../../functions/pages/formatFilterRecordDropdown';
import { filterFetchDropdownRecords } from '../../functions/pages/filterFetchDropdownRecords';
import { BASE_URL } from '../../config/apis';
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate';

const FilterContent = ({ currentFilter, setCurrentFilter }) => {
    const [loading, setLoading] = useState(true);
    const [vehiclesTypes, setVehiclesTypes] = useState([]);
    const [isAvailable, setIsAvailable] = useState(['true', 'false']);

    useEffect(() => {
        filterFetchDropdownRecords(`${BASE_URL}/api/get/vehicle_types/`, setVehiclesTypes)
        setLoading(false);
    }, []);

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'default_delivery_cost') {
            // Allow only whole numbers (no decimals)
            if (value === '' || /^[0-9]*$/.test(value)) {
                const updatedFilter = { ...currentFilter, [field]: value };
                setCurrentFilter(updatedFilter);
            }
        } else {
            setCurrentFilter({ ...currentFilter, [field]: value });
        }
    };


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
                    label='Name'
                    name='name'
                    id='name'
                    value={currentFilter.name}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, name: e.target.value })}
                    maxLength={100}
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
                    maxLength={15}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={vehiclesTypes.map(vehicle => ({
                        value: vehicle,
                        name: formatFilterRecordDropdown(vehicle)
                    }))}
                    label='Vehicle Type'
                    name='vehicle_type'
                    id='vehicle_type'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, vehicle_type: e.target.value })}
                    value={currentFilter.vehicle_type}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelectNoCreate
                    selectItems={isAvailable.map(available => ({
                        value: available,
                        name: formatFilterRecordDropdown(available.toString())
                    }))}
                    label='Is Available'
                    name='is_available'
                    id='is_available'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, is_available: e.target.value })}
                    value={currentFilter.is_available}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Default Delivery Cost'
                    name='default_delivery_cost'
                    id='default_delivery_cost'
                    value={currentFilter.default_delivery_cost}
                    onChange={handleInputChange('default_delivery_cost')}
                    maxLength={15}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent