import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, FormControl, Grid, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import AdornmentTextarea from '../../pages-components/AdornmentTextArea'
import getUnits from '../../config/getUnits'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import CardImageUpload from '../../pages-components/MediaUploader';
import { imageUploadHandler } from "../../config/uploadHandler";
import {
    maxFileSizeInMBForUploadImage,
} from "../../config/common";
import { BASE_URL } from '../../config/apis';
import { useHistory } from 'react-router-dom';
import ConfirmCancel from '../../pages-components/ConfirmCancel'

const Form = ({ handleClick, icon, title }) => {
    const history = useHistory();

    const { id } = useParams();

    const [data, setData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);

    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [errorSuppliers, setErrorSuppliers] = useState('');

    const units = getUnits();

    // const [dimensionUnit, setDimensionUnit] = useState('m');
    const dimensionUnits = units.length || [];

    const weightUnits = units.mass || [];

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_PRODUCT, setData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        const fetchDropdownData = async () => {

            setLoadingSuppliers(true);

            try {
                await formFetchDropdownRecords(`${BASE_URL}/api/get/suppliers/`, setSuppliers);
                setLoadingSuppliers(false);
            } catch (error) {
                setErrorSuppliers('Error fetching suppliers');
                setLoadingSuppliers(false);
            }

        };

        fetchDropdownData();
    }, [id, fetchData]);

    const isFormValid = () => {
        return  data.code &&
                data.name &&
                data.supplier_id;
    };

    const handleInputChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };


    const handleUploadChange = (uploadData) => {
        setData({ ...data, ...uploadData });
    };

    const handleUnitChange = (setValue) => (event) => {
        setValue(event.target.value);
    };

    const handleNavigatePage = () => {
        history.push('/ui/products');
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
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <InputSelect
                        selectItems={suppliers.map(supplier => ({
                            value: supplier.id,
                            name: formatFormRecordDropdown(supplier.name)
                        }))}
                        label='Supplier'
                        name='supplier_id'
                        id='supplier_id'
                        onChange={handleInputChange('supplier_id')}
                        value={data.supplier_id ?? ""}
                        error={isEmpty(data.supplier_id)}
                        loading={loadingSuppliers}
                        errorMessage={errorSuppliers}
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
                        maxLength={180}
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
                    <Grid item xs={8} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <CardImageUpload
                            // disabled={false}
                            // error={"test error"}
                            // helperText={"helper text"}
                            id="product_image"
                            imgSrc={data.image_file}
                            imageSpec={("Product Image Specs", "Product")}
                            maxFileSize={maxFileSizeInMBForUploadImage}
                            removeImageHandler={
                                inputRef =>
                                    (function() {
                                        if (inputRef.current?.value) {
                                            inputRef.current.value = "";
                                        }

                                        const newFormData = {
                                            ...data,
                                            image: null,
                                            image_file: null,
                                        };

                                        if (data.new_upload) {
                                            newFormData.new_upload = false;
                                        }
                                        setData(newFormData);
                                    })
                            }
                            imgHandler={
                                event => {
                                    imageUploadHandler(
                                        event,
                                        handleUploadChange,
                                        "image",
                                        "image_file",
                                    );
                                }
                            }
                            imageFormat={"format" + ": PNG"}
                            title={("Product Image", "Product")}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <Divider className="my-4" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingLeft: '35px', paddingRight: '0px' }}>
                        <div className="font-size-lg font-weight-bold">Additional Info</div>
                    </Grid>
                    <Grid item xs={4}>
                        <AdornmentTextarea
                            rows={1}
                            rowsMax={2}
                            label='Weight'
                            name='weight'
                            id='weight'
                            onChange={handleInputChange('weight')}
                            value={data.weight ?? ""}
                            key='weight'
                            maxLength={80}
                            unit={data.weight_unit ?? ""}
                            onUnitChange={handleInputChange('weight_unit')}
                            units={weightUnits}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AdornmentTextarea
                            rows={1}
                            rowsMax={2}
                            label='Length'
                            name='length'
                            id='length'
                            onChange={handleInputChange('length')}
                            value={data.length ?? ""}
                            key='length'
                            maxLength={80}
                            unit={data.dimension_unit ?? ""}
                            onUnitChange={handleInputChange('dimension_unit')}
                            units={dimensionUnits}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AdornmentTextarea
                        rows={1}
                        rowsMax={2}
                        label='Width'
                        name='width'
                        id='width'
                        onChange={handleInputChange('width')}
                        value={data.width ?? ""}
                        key='width'
                        maxLength={80}
                        unit={data.dimension_unit ?? ""}
                        onUnitChange={handleInputChange('dimension_unit')}
                        units={dimensionUnits}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <AdornmentTextarea
                        rows={1}
                        rowsMax={2}
                        label='Height'
                        name='height'
                        id='height'
                        onChange={handleInputChange('height')}
                        value={data.height ?? ""}
                        key='height'
                        maxLength={80}
                        unit={data.dimension_unit ?? ""}
                        onUnitChange={handleInputChange('dimension_unit')}
                        units={dimensionUnits}
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