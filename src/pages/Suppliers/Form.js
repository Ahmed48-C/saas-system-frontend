import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCountries } from 'use-react-countries'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams(); // Get the ID from the URL

    const [suppliersData, setSuppliersData] = useState({});
    const [editLoading, setEditLoading] = useState(false); // Add loading state

    // useEffect(() => {
    //     if (id) {
    //         fetchSupplier();
    //     }
    // }, [id]);

    // const fetchSupplier = () => {
    //     setEditLoading(true); // Set loading to true before fetching data
    //     const url = API_ENDPOINTS.GET_SUPPLIER(id);

    //     axios.get(url)
    //     .then(response => {
    //         setSuppliersData(response.data);
    //         setEditLoading(false); // Set loading to false after data is fetched
    //     })
    //     .catch(error => {
    //         console.error('Error fetching data:', error);
    //         setEditLoading(false); // Set loading to false in case of error
    //     });
    // };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = () => {
        handleFetchRecord(id, API_ENDPOINTS.GET_SUPPLIER, setSuppliersData, setEditLoading);
    };

    const isFormValid = () => {
        return suppliersData.name &&
               suppliersData.phone &&
               suppliersData.email;
    };

    const handleInputChange = (field) => (e) => {
    setSuppliersData({ ...suppliersData, [field]: e.target.value });
    };

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
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
                        label='Name'
                        name='name'
                        id='name'
                        onChange={handleInputChange('name')}
                        value={suppliersData.name ?? ""}
                        key='name'
                        error={isEmpty(suppliersData.name)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Phone'
                        name='phone'
                        id='phone'
                        onChange={handleInputChange('phone')}
                        value={suppliersData.phone ?? ""}
                        key='phone'
                        error={isEmpty(suppliersData.phone)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Email'
                        name='email'
                        id='email'
                        onChange={handleInputChange('email')}
                        value={suppliersData.email ?? ""}
                        key='email'
                        error={isEmpty(suppliersData.email)}
                        maxLength={254}
                        />
                    </Grid>
                    {/* <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Operator ID'
                        name='operator_id'
                        id='operator_id'
                        onChange={handleInputChange('operator_id')}
                        value={suppliersData.operator_id ?? ""}
                        key='operator_id'
                        // error={isEmpty(suppliersData.operator_id)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Location ID'
                        name='location_id'
                        id='location_id'
                        onChange={handleInputChange('location_id')}
                        value={suppliersData.location_id ?? ""}
                        key='location_id'
                        // error={isEmpty(suppliersData.location_id)}
                        />
                    </Grid> */}
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
                                    handleClick(suppliersData);
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