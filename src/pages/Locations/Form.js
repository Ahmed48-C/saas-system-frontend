import React, { useEffect, useState } from 'react'
import SuccessMessage from '../../pages-components/SuccesMessage'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Form = ({ showSuccess, handleCloseSuccess,  handleClick, countryOptions, isEmpty, successMessage, icon, data }) => {
    const [locationsData, setLocationsData] = useState(data || {});

    const isFormValid = () => {
        return locationsData.code &&
               locationsData.name &&
               locationsData.street &&
               locationsData.city &&
               locationsData.state &&
               locationsData.postcode &&
               locationsData.country;
      };
    
    const handleInputChange = (field) => (e) => {
    setLocationsData({ ...locationsData, [field]: e.target.value });
    };

    return (
        <>
            <SuccessMessage
            open={showSuccess}
            message={successMessage}
            vertical='bottom'
            horizontal='center'
            toastrStyle='toastr-success'
            onClose={() => handleCloseSuccess()}
            />
            <FormControl fullWidth>
                <Grid container spacing={3} className="my-4">
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
                        value={locationsData.code ?? ""}
                        key='code'
                        error={isEmpty(locationsData.code)}
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
                        value={locationsData.name ?? ""}
                        key='name'
                        error={isEmpty(locationsData.name)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Note'
                        name='note'
                        id='note'
                        onChange={handleInputChange('note')}
                        value={locationsData.note ?? ""}
                        key='note'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <div className="font-size-lg font-weight-bold">ADRESSS</div>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Street'
                        name='street'
                        id='street'
                        onChange={handleInputChange('street')}
                        value={locationsData.street ?? ""}
                        key='street'
                        error={isEmpty(locationsData.street)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='City'
                        name='city'
                        id='city'
                        onChange={handleInputChange('city')}
                        value={locationsData.city ?? ""}
                        key='city'
                        error={isEmpty(locationsData.city)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='State'
                        name='state'
                        id='state'
                        onChange={handleInputChange('state')}
                        value={locationsData.state ?? ""}
                        key='state'
                        error={isEmpty(locationsData.state)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Postcode'
                        name='postcode'
                        id='postcode'
                        onChange={handleInputChange('postcode')}
                        value={locationsData.postcode ?? ""}
                        key='postcode'
                        error={isEmpty(locationsData.postcode)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={countryOptions}
                        label='Country'
                        name='country'
                        id='country'
                        onChange={handleInputChange('country')}
                        value={locationsData.country ?? ""}
                        error={isEmpty(locationsData.country)}
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
                                    handleClick(locationsData);
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
        </>
    )
}

export default Form