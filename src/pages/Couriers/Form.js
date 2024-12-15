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
import { BASE_URL } from '../../config/apis';
import { phoneNumberValidator } from '../../functions/pages/phoneNumberValidator'
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'
import InputSelectNoCreate from '../../pages-components/InputSelectNoCreate'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [isAvailable, setIsAvailable] = useState(['true', 'false']);

    const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false);
    const [errorVehicleTypes, setErrorVehicleTypes] = useState('');

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_COURIER, setData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingVehicleTypes(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/vehicle_types/`, setVehicleTypes, setLoadingVehicleTypes);
                // setLoadingVehicleTypes(false);
            } catch (error) {
                setErrorVehicleTypes('Error fetching suppliers');
                setLoadingVehicleTypes(false);
            }

        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/couriers/`, setLocations);
    }, [id, fetchData]);

    const isFormValid = () => {
        return  data.name &&
                // data.phone &&
                phoneNumberValidator(data.phone) &&
                data.vehicle_type &&
                data.is_available?.toString() &&
                data.default_delivery_cost;
    };

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;   

        if (field === 'default_delivery_cost') {
            // Allow only whole numbers
            if (value === '' || /^[0-9]*$/.test(value)) {
                setData({ ...data, [field]: value })
            }
        } else {
            setData({ ...data, [field]: value });
        }
    };

    const handleNavigatePage = () => {
        history.push('/ui/couriers');
    };

    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);

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
                        label='Name'
                        name='name'
                        id='name'
                        onChange={handleInputChange('name')}
                        value={data.name ?? ""}
                        key='name'
                        error={isEmpty(data.name)}
                        maxLength={100}
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
                        error={isEmpty(data.phone) || !phoneNumberValidator(data.phone)}
                        helperText={isEmpty(data.phone) || !phoneNumberValidator(data.phone) ? 'Enter a valid phone number.' : ''}
                        maxLength={15}
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
                        <InputSelectNoCreate
                        selectItems={vehicleTypes.map(vehicle => ({
                            value: vehicle,
                            name: formatFormRecordDropdown(vehicle)
                        }))}
                        label='Vehicle Types'
                        name='vehicle_type'
                        id='vehicle_type'
                        onChange={handleInputChange('vehicle_type')}
                        value={data.vehicle_type ?? ""}
                        error={isEmpty(data.vehicle_type)}
                        loading={loadingVehicleTypes}
                        errorMessage={errorVehicleTypes}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputSelectNoCreate
                        selectItems={isAvailable.map(available => ({
                            value: available,
                            name: formatFormRecordDropdown(available)
                        }))}
                        label='Is Available'
                        name='is_available'
                        id='is_available'
                        onChange={handleInputChange('is_available')}
                        value={data.is_available ?? ""}
                        error={isEmpty(data.is_available)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Default Delivery Cost'
                        name='default_delivery_cost'
                        id='default_delivery_cost'
                        onChange={handleInputChange('default_delivery_cost')}
                        value={data.default_delivery_cost ?? ""}
                        key='default_delivery_cost'
                        error={isEmpty(data.default_delivery_cost)}
                        maxLength={15}
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
            </FormControl>
            )}
        </>
    )
}

export default Form