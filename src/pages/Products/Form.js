import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import axios from "axios";
import AdornmentTextarea from '../../pages-components/AdornmentTextArea'

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        fetchSuppliers();
    }, [id]);

    useEffect(() => {
        console.log(suppliers); // Log suppliers whenever it changes
    }, [suppliers]);

    const fetchData = () => {
        handleFetchRecord(id, API_ENDPOINTS.GET_PRODUCT, setData, setEditLoading);
    };

    const fetchSuppliers = () => {
        axios.get(`http://127.0.0.1:8000/api/get/suppliers/`)
        .then(response => {
            if (Array.isArray(response.data.data)) {
                setSuppliers(response.data.data);
            } else {
                console.error('Invalid data format:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const isFormValid = () => {
        return  data.code &&
                data.name;
    };

    const handleInputChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };

    const formatName = (name) => {
        return name.length > 20 ? `${name.slice(0, 20)}...` : name;
    };

    const [value, setValue] = useState('');
    const [unit, setUnit] = useState('cm');
    const units = ['cm', 'inches', 'mm'];

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    };

    return (
        <>
            {editLoading ? (
                <Loader />
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={3} className="my-4">
                    <Grid item xs={12}>
                        <div>
                            <div className="app-page-title--first">
                                <div className="app-page-title--heading">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <Divider className="my-4" />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="font-size-lg font-weight-bold">DETAILS</div>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Code'
                        name='code'
                        id='code'
                        onChange={handleInputChange('code')}
                        value={data.code ?? ""}
                        key='code'
                        error={isEmpty(data.code)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Name'
                        name='name'
                        id='name'
                        onChange={handleInputChange('name')}
                        value={data.name ?? ""}
                        key='name'
                        error={isEmpty(data.name)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Description'
                        name='description'
                        id='description'
                        onChange={handleInputChange('description')}
                        value={data.description ?? ""}
                        key='description'
                        maxLength={254}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <InputSelect
                        selectItems={suppliers.map(supplier => ({
                            value: supplier.id,
                            name: formatName(supplier.name)
                        }))}
                        label='Supplier'
                        name='supplier_id'
                        id='supplier_id'
                        onChange={handleInputChange('supplier_id')}
                        value={data.supplier_id ?? ""}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Brand'
                        name='brand'
                        id='brand'
                        onChange={handleInputChange('brand')}
                        value={data.brand ?? ""}
                        key='brand'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Measure Unit'
                        name='measure_unit'
                        id='measure_unit'
                        onChange={handleInputChange('measure_unit')}
                        value={data.measure_unit ?? ""}
                        key='measure_unit'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="font-size-lg font-weight-bold">Additional Info</div>
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Weight'
                        name='weight'
                        id='weight'
                        onChange={handleInputChange('weight')}
                        value={data.weight ?? ""}
                        key='weight'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                            rows={1}
                            rowsMax={2}
                            label='Length'
                            name='length'
                            id='length'
                            onChange={handleInputChange('length')}
                            value={data.length ?? ""}
                            key='length'
                            maxLength={80}
                        />
                        {/* <AdornmentTextarea
                            rows={1}
                            rowsMax={2}
                            label='Length'
                            name='length'
                            id='length'
                            onChange={handleInputChange('length')}
                            value={data.length ?? ""}
                            key='length'
                            maxLength={80}
                            unit={unit}
                            onUnitChange={handleUnitChange}
                            units={units}
                        /> */}
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Width'
                        name='width'
                        id='width'
                        onChange={handleInputChange('width')}
                        value={data.width ?? ""}
                        key='width'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Height'
                        name='height'
                        id='height'
                        onChange={handleInputChange('height')}
                        value={data.height ?? ""}
                        key='height'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Color'
                        name='color'
                        id='color'
                        onChange={handleInputChange('color')}
                        value={data.color ?? ""}
                        key='color'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Size'
                        name='size'
                        id='size'
                        onChange={handleInputChange('size')}
                        value={data.size ?? ""}
                        key='size'
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                        <Tooltip title="Submit">
                            <span>
                                <Button
                                variant="contained"
                                size="small"
                                className="d-40 btn-success"
                                onClick={() => {
                                    handleClick(data);
                                    setData({});
                                }}
                                disabled={!isFormValid()} // Disable button if form is not valid
                                >
                                <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon icon={['fas', icon]} className="opacity-8" />
                                </span>
                                </Button>
                            </span>
                        </Tooltip>
                        </Box>
                    </Grid>
                </Grid>
            </FormControl>
            )}
        </>
    )
}

export default Form