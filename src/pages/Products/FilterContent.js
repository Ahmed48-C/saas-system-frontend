import React, { useEffect, useState } from 'react'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { Grid } from '@material-ui/core'
import axios from 'axios';

const FilterContent = ({ currentFilter, setCurrentFilter }) => {
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);

    const formatName = (name) => {
        return name.length > 20 ? `${name.slice(0, 20)}...` : name;
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        axios.get(`http://127.0.0.1:8000/api/get/suppliers/`)
        .then(response => {
            setLoading(false);
            if (Array.isArray(response.data.data)) {
                setSuppliers(response.data.data);
            } else {
                console.error('Invalid data format:', response.data);
            }
        })
        .catch(error => {
            setLoading(false);
            console.error('Error fetching data:', error);
        });
    }

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
                    label='Description'
                    name='description'
                    id='description'
                    value={currentFilter.description}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, description: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <InputSelect
                    selectItems={suppliers.map(supplier => ({
                        value: supplier.id.toString(),
                        name: formatName(supplier.name)
                    }))}
                    label='Supplier'
                    name='supplier'
                    id='supplier'
                    onChange={(e) => setCurrentFilter({ ...currentFilter, supplier_id: e.target.value })}
                    value={currentFilter.supplier_id}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Brand'
                    name='brand'
                    id='brand'
                    value={currentFilter.brand}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, brand: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Measure Unit'
                    name='measure_unit'
                    id='measure_unit'
                    value={currentFilter.measure_unit}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, measure_unit: e.target.value })}
                    maxLength={180}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Weight'
                    name='weight'
                    id='weight'
                    value={currentFilter.weight}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, weight: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Length'
                    name='length'
                    id='length'
                    value={currentFilter.length}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, length: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Width'
                    name='width'
                    id='width'
                    value={currentFilter.width}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, width: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Height'
                    name='height'
                    id='height'
                    value={currentFilter.height}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, height: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Color'
                    name='color'
                    id='color'
                    value={currentFilter.color}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, color: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            <Grid item xs={12}>
                <Textarea
                    style={{ margin: 0 }}
                    rows={1}
                    rowsMax={2}
                    label='Size'
                    name='size'
                    id='size'
                    value={currentFilter.size}
                    onChange={(e) => setCurrentFilter({ ...currentFilter, size: e.target.value })}
                    maxLength={80}
                />
            </Grid>
            </>
            )}
        </>
    )
}

export default FilterContent