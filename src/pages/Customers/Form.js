import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import { emailValidator } from '../../functions/pages/emailValidator'
import { BASE_URL } from '../../config/apis';
import { phoneNumberValidator } from '../../functions/pages/phoneNumberValidator'
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'
import PopupCreateNew from '../../pages-components/PopupCreateNew'
import { handleSubmitRecord } from '../../functions/pages/handleSubmitRecord'
import { toast } from 'react-toastify'
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate'
import { countryList } from '../../config/common'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errorLocations, setErrorLocations] = useState('');

    const [countryOptions, setCountryOptions] = useState([]);

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_CUSTOMER, setData, setEditLoading);
    }, [id]);

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

        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingLocations(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, setLocations, setLoadingLocations);
                // setLoadingLocations(false);
            } catch (error) {
                setErrorLocations('Error fetching locations');
                setLoadingLocations(false);
            }

        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/locations/`, setLocations);
    }, [id, fetchData]);

    const isFormValid = () => {
        return  data.code &&
                data.name &&
                // data.phone &&
                // phoneNumberValidator(data.phone) &&
                // data.email &&
                data.location_id&&
                (isEmpty(data.phone) || phoneNumberValidator(data.phone))
                (isEmpty(data.email) || emailValidator(data.email))
                // emailValidator(data.email);
    };

    const handleInputChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };

    const handleNavigatePage = () => {
        history.push('/ui/customers');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

    const [openLocationPopupCreateNew, setOpenLocationPopupCreateNew] = useState(false);
    const [locationPopupData, setLocationPopupData] = useState({});

    const onCreateNewLocation = () => {
        setLoadingLocations(true);

        const postData = {
            code: locationPopupData.code,
            name: locationPopupData.name,
            street: locationPopupData.street,
            city: locationPopupData.city,
            state: locationPopupData.state,
            postcode: locationPopupData.postcode,
            country: locationPopupData.country,
        };

        const fetchDropdownData = async () => {

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, setLocations, setLoadingLocations);
            } catch (error) {
                setErrorLocations('Error fetching locations');
                setLoadingLocations(false);
            }

        };

        const successCallback = (data) => {
            toast.success('Added Location Successfully');
            fetchDropdownData();
        };

        const errorCallback = (error) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                if (error.response.data && typeof error.response.data === 'object' && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.status === 500) {
                    // For server errors
                    errorMessage = 'An error occurred on the server. Please try again later.';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error('Error: ' + errorMessage);
        };

        handleSubmitRecord(postData, API_ENDPOINTS.POST_LOCATION, successCallback, errorCallback);
        console.log('Created new Location')
    };

    const isLocationPopupFormValid = () => {
        return  locationPopupData.code &&
                locationPopupData.name &&
                locationPopupData.street &&
                locationPopupData.city &&
                locationPopupData.state &&
                locationPopupData.postcode &&
                locationPopupData.country;
    };

    const handlePopupInputChange = (setState) => (field) => (e) => {
        const value = e?.target?.value || ''; // Safeguard against null/undefined target
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleLocationPopupInputChange = handlePopupInputChange(setLocationPopupData);

    return (
        <>
            {editLoading ? (
                <Loader />
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        {/* <div>
                            <div className="">
                                <div className="app-page-title--heading" style={{ textAlign: 'left', paddingRight: 0 }}>
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <Divider className="my-4" />
                        </div> */}
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
                                                handleClick(data);
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
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Phone'
                        name='phone'
                        id='phone'
                        onChange={handleInputChange('phone')}
                        value={data.phone ?? ""}
                        key='phone'
                        // error={isEmpty(data.phone)}
                        error={!isEmpty(data.phone) && !phoneNumberValidator(data.phone)}
                        helperText={!isEmpty(data.phone) && !phoneNumberValidator(data.phone) ? 'Enter a valid phone number.' : ''}
                        maxLength={15}
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
                        value={data.email ?? ""}
                        key='email'
                        error={!isEmpty(data.email) && !emailValidator(data.email)}
                        helperText={!isEmpty(data.email) && !emailValidator(data.email) ? 'Enter a valid email address.' : ''}
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
                        value={data.location_id ?? ""}
                        error={isEmpty(data.location_id)}
                        loading={loadingLocations}
                        errorMessage={errorLocations}
                        onCreateNew={() => setOpenLocationPopupCreateNew(true)}
                        titleCreateNew='Location'
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
                                    handleClick(data);
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
                <PopupCreateNew
                    open={openLocationPopupCreateNew}
                    setOpen={setOpenLocationPopupCreateNew}
                    handleSubmit={() => onCreateNewLocation()}
                    title='Location'
                    form={
                        <FormControl fullWidth>
                            <Grid container spacing={4} className="my-4" style={{ width: '100%' }}>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Code'
                                        name='code'
                                        id='code'
                                        onChange={handleLocationPopupInputChange('code')}
                                        value={locationPopupData.code ?? ""}
                                        key='code'
                                        error={isEmpty(locationPopupData.code)}
                                        maxLength={50}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Name'
                                        name='name'
                                        id='name'
                                        onChange={handleLocationPopupInputChange('name')}
                                        value={locationPopupData.name ?? ""}
                                        key='name'
                                        error={isEmpty(locationPopupData.name)}
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
                                        onChange={handleLocationPopupInputChange('note')}
                                        value={locationPopupData.note ?? ""}
                                        key='note'
                                        error={isEmpty(locationPopupData.note)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Street'
                                        name='street'
                                        id='street'
                                        onChange={handleLocationPopupInputChange('street')}
                                        value={locationPopupData.street ?? ""}
                                        key='street'
                                        error={isEmpty(locationPopupData.street)}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='City'
                                        name='city'
                                        id='city'
                                        onChange={handleLocationPopupInputChange('city')}
                                        value={locationPopupData.city ?? ""}
                                        key='city'
                                        error={isEmpty(locationPopupData.city)}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='State'
                                        name='state'
                                        id='state'
                                        onChange={handleLocationPopupInputChange('state')}
                                        value={locationPopupData.state ?? ""}
                                        key='state'
                                        error={isEmpty(locationPopupData.state)}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Textarea
                                        rows={1}
                                        rowsMax={2}
                                        label='Postcode'
                                        name='postcode'
                                        id='postcode'
                                        onChange={handleLocationPopupInputChange('postcode')}
                                        value={locationPopupData.postcode ?? ""}
                                        key='postcode'
                                        error={isEmpty(locationPopupData.postcode)}
                                        maxLength={50}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputSelectNoCreate
                                        selectItems={countryOptions}
                                        label='Country'
                                        name='country'
                                        id='country'
                                        onChange={handleLocationPopupInputChange('country')}
                                        value={locationPopupData.country ?? ""}
                                        error={isEmpty(locationPopupData.country)}
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    }
                    isPopupFormValid={isLocationPopupFormValid}
                />
            </FormControl>
            )}
        </>
    )
}

export default Form