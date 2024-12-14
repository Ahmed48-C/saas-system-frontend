import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS, BASE_URL} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import { emailValidator } from '../../functions/pages/emailValidator'
import { phoneNumberValidator } from '../../functions/pages/phoneNumberValidator'
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams();

    const [suppliersData, setSuppliersData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    const [loadingLocations, setLoadingLocations] = useState(false);
    const [errorLocations, setErrorLocations] = useState('');

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_SUPPLIER, setSuppliersData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingLocations(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/locations/`, setLocations);
                setLoadingLocations(false);
            } catch (error) {
                setErrorLocations('Error fetching suppliers');
                setLoadingLocations(false);
            }

        };

        fetchDropdownData();

        // formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/locations/`, setLocations);
    }, [id, fetchData]);

    const isFormValid = () => {
        return  suppliersData.name &&
                // suppliersData.phone &&
                // phoneNumberValidator(suppliersData.phone) &&
                // suppliersData.email &&
                suppliersData.location_id&&
                (isEmpty(suppliersData.contact_phone) || phoneNumberValidator(suppliersData.contact_phone)) &&
                (isEmpty(suppliersData.phone) || phoneNumberValidator(suppliersData.phone)) &&
                (isEmpty(suppliersData.email) || emailValidator(suppliersData.email)) ;
                // emailValidator(suppliersData.email);
    };

    const handleInputChange = (field) => (e) => {
        setSuppliersData({ ...suppliersData, [field]: e.target.value });
    };

    const handleNavigatePage = () => {
        history.push('/ui/suppliers');
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
                                                handleClick(suppliersData);
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
                        // error={isEmpty(suppliersData.phone)}
                        error={!isEmpty(suppliersData.phone) && !phoneNumberValidator(suppliersData.phone)}
                        helperText={!isEmpty(suppliersData.phone) && !phoneNumberValidator(suppliersData.phone) ? 'Enter a valid phone number.' : ''}
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
                        value={suppliersData.email ?? ""}
                        key='email'
                        error={!isEmpty(suppliersData.email) && !emailValidator(suppliersData.email)}
                        helperText={!isEmpty(suppliersData.email) && !emailValidator(suppliersData.email) ? 'Enter a valid email address.' : ''}
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
                        loading={loadingLocations}
                        errorMessage={errorLocations}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
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
                        maxLength={15}
                        error={!isEmpty(suppliersData.contact_phone) && !phoneNumberValidator(suppliersData.contact_phone)}
                        helperText={
                            !isEmpty(suppliersData.contact_phone) && !phoneNumberValidator(suppliersData.contact_phone)
                                ? 'Enter a valid phone number.'
                                : ''
                        }
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
                                    handleClick(suppliersData);
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