import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { countryList } from '../../config/common'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams(); // Get the ID from the URL

    const [locationsData, setLocationsData] = useState({});
    const [editLoading, setEditLoading] = useState(false); // Add loading state

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_LOCATION, setLocationsData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id, fetchData]);

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

    console.log("\n\n\ncountryOptions : ", countryOptions)

    const isFormValid = () => {
        return  locationsData.code &&
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

    const handleNavigatePage = () => {
        history.push('/ui/locations');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <div className="">
                                <div className="app-page-title--heading">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <div className="app-page-title--heading">
                                <Box display="flex" justifyContent="flex-end">
                                    <span style={{ paddingRight: '8px' }}>
                                        <Button
                                        variant="contained"
                                        size="small"
                                        className="btn-info"
                                        onClick={() => setOpenConfirmCancelDialog(true)}
                                        >
                                        <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Cancel</span>
                                        </Button>
                                    </span>
                                    <Tooltip title="Submit">
                                        <span>
                                            <Button
                                            variant="contained"
                                            size="small"
                                            className="btn-success"
                                            onClick={() => {
                                                handleClick(locationsData);
                                            }}
                                            disabled={!isFormValid()} // Disable button if form is not valid
                                            >
                                            <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Save</span>
                                            <span className="btn-wrapper--icon">
                                                <FontAwesomeIcon icon={['fas', icon]} className="opacity-8" />
                                            </span>
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Box>
                            </div>
                        </Box>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="">
                            <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                <h1>DETAILS</h1>
                            </div>
                            <Divider className="my-4" />
                        </div>
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
                        maxLength={50}
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
                        maxLength={80}
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
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="font-size-lg font-weight-bold">ADRESSS</div>
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
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
                        maxLength={200}
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
                        maxLength={200}
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
                        maxLength={200}
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
                        maxLength={50}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelectNoCreate
                        selectItems={countryOptions}
                        label='Country'
                        name='country'
                        id='country'
                        onChange={handleInputChange('country')}
                        value={locationsData.country ?? ""}
                        error={isEmpty(locationsData.country)}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                        <Tooltip title="Submit">
                            <span>
                                <Button
                                variant="contained"
                                size="small"
                                className="btn-success"
                                onClick={() => {
                                    handleClick(locationsData);
                                }}
                                disabled={!isFormValid()} // Disable button if form is not valid
                                >
                                <span className="btn-wrapper--text" style={{ paddingRight: '5px' }}>Save</span>
                                <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon icon={['fas', icon]} className="opacity-8" />
                                </span>
                                </Button>
                            </span>
                        </Tooltip>
                        </Box>
                    </Grid>
                </Grid>
                <ConfirmCancel
                    open={openConfirmCancelDialog}
                    setOpen={setOpenConfirmCancelDialog}
                    handleCancelClick={() => handleNavigatePage()}
                />
            </FormControl>
            )}
        </>
    )
}

export default Form