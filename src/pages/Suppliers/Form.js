import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import { emailValidator } from '../../functions/pages/emailValidator'

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams();

    const [suppliersData, setSuppliersData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_SUPPLIER, suppliersData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/locations/`, setLocations);
    }, [id, fetchData]);

    const isFormValid = () => {
        return  suppliersData.name &&
                suppliersData.phone &&
                suppliersData.email &&
                suppliersData.location_id&&
                emailValidator(suppliersData.email);
    };

    const handleInputChange = (field) => (e) => {
        setSuppliersData({ ...suppliersData, [field]: e.target.value });
    };

    return (
        <>
            {editLoading ? (
                <Loader />
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={3} className="my-4" style={{ width: '100%' }}>
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
                        error={isEmpty(suppliersData.email) || !emailValidator(suppliersData.email)}
                        helperText={isEmpty(suppliersData.email) || !emailValidator(suppliersData.email) ? 'Enter a valid email address.' : ''}
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
                    */}
                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={locations.map(location => ({
                            value: location.id,
                            name: formatFormRecordDropdown(location.name)
                        }))}
                        label='Location'
                        name='location_id'
                        id='location_id'
                        onChange={handleInputChange('location_id')}
                        value={suppliersData.location_id ?? ""}
                        error={isEmpty(suppliersData.location_id)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="font-size-lg font-weight-bold">Contact Person</div>
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Contact Name'
                        name='contact_name'
                        id='contact_name'
                        onChange={handleInputChange('contact_name')}
                        value={suppliersData.contact_name ?? ""}
                        key='contact_name'
                        // error={isEmpty(suppliersData.contact_name)}
                        maxLength={80}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Contact Phone'
                        name='contact_phone'
                        id='contact_phone'
                        onChange={handleInputChange('contact_phone')}
                        value={suppliersData.contact_phone ?? ""}
                        key='contact_phone'
                        // error={isEmpty(suppliersData.contact_phone)}
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
                                    handleClick(suppliersData);
                                    // setSuppliersData({});
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