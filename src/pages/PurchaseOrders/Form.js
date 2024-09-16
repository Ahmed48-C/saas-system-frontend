import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Box, Button, Card, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core'
import { InputSelect, Loader, Textarea } from '../../pages-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isEmpty from '../../functions/pages/isEmpty'
import { useParams } from 'react-router-dom';
import API_ENDPOINTS from '../../config/apis'
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord'
import { formatFormRecordDropdown } from '../../functions/pages/formatFormRecordDropdown'
import { formFetchDropdownRecords } from '../../functions/pages/formFetchDropdownRecords'
import { AddOutlined, DeleteOutline } from '@material-ui/icons'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import drag-and-drop components

const Form = ({ handleClick, icon, title }) => {
    const { id } = useParams(); // Get the ID from the URL

    // const [data, setData] = useState({});
    const [data, setData] = useState({
        items: [{ product_id: '', price: 0.0, quantity: 0, total: 0.00 }],
        // You can include other parts of data as well
    });
    const [editLoading, setEditLoading] = useState(false); // Add loading state
    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [balances, setBalances] = useState([]);
    // const [items, setItems] = useState([{product: '', price: '', quantity: '', total: ''}]); // New state to hold the product list
    const [total, setTotal] = useState(0); // State to hold total value
    const statuses = ['Pending', 'Completed']

    const fetchData = useCallback(() => {
        handleFetchRecord(id, API_ENDPOINTS.GET_PURCHASE_ORDER, setData, setEditLoading);
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchData();
        }

        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/stores/`, setStores)
        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/products/`, setProducts)
        formFetchDropdownRecords(`http://127.0.0.1:8000/api/get/balances/`, setBalances)
    }, [id, fetchData]);

    useEffect(() => {
        console.log('Products:', products); // Log products to verify
    }, [products]);

    // useEffect(() => {
    //     calculateTotal();
    //     console.log(items);
    // }, [items]); // Recalculate total whenever items changes

    // const calculateTotal = (price, quantity) => {
    //     const total = (parseFloat(price) || 0) * (parseFloat(quantity) || 0);
    //     return total.toFixed(2); // Ensure total is rounded to two decimal places
    // };

    // const calculateTotal = () => {
    //     const totalValue = items.reduce((acc, product) => {
    //         const price = parseFloat(product.price) || 0;
    //         const quantity = parseFloat(product.quantity) || 0;
    //         return acc + (price * quantity);
    //     }, 0);

    //     setTotal(totalValue.toFixed(2)); // Update the total state

    //     // Also update the total in the data object
    //     setData((prevData) => ({
    //         ...prevData,
    //         total: totalValue.toFixed(2) // Ensure total is formatted to 2 decimal places
    //     }));
    // };

    const calculateTotal = () => {
        const totalValue = data.items.reduce((acc, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseFloat(product.quantity) || 0;
            return acc + (price * quantity);
        }, 0);

        // Update the total in the data object
        setData((prevData) => ({
            ...prevData,
            total: totalValue.toFixed(2) // Ensure total is formatted to 2 decimal places
        }));
    };


    // const isFormValid = () => {
    //     return  data.name &&
    //             data.price &&
    //             data.quantity &&
    //             data.store_id &&
    //             data.product_id &&
    //             data.balance_id;
    // };

    // const isFormValid = () => {
    //     return  data.code &&
    //             data.store_id &&
    //             data.balance_id &&
    //             data.items.length > 0;
    // };

    const isFormValid = () => {
        // Ensure all basic fields are filled
        if (!data.code || !data.store_id || !data.balance_id) {
            return false;
        }

        // Check if items array is not empty
        if (data.items.length === 0) {
            return false;
        }

        // Validate each item in the items array
        const areItemsValid = data.items.every(item =>
            item.product_id &&               // Ensure product_id is not empty
            item.price > 0 &&                // Ensure price is greater than 0
            item.quantity > 0 &&             // Ensure quantity is greater than 0
            item.total > 0                   // Ensure total is greater than 0
        );

        return areItemsValid;
    };

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;

        if (field === 'price') {
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                const updatedData = { ...data, [field]: value };
                updatedData.total = calculateTotal(updatedData.price, updatedData.quantity);
                setData(updatedData);
            }
        } else if (field === 'quantity') {
            // Allow only whole numbers
            if (value === '' || /^[0-9]*$/.test(value)) {
                const updatedData = { ...data, [field]: value };
                updatedData.total = calculateTotal(updatedData.price, updatedData.quantity);
                setData(updatedData);
            }
        } else {
            setData({ ...data, [field]: value });
        }
    };

    // const handleProductChange = (index, field, value) => {
    //     const updatedProducts = [...items];
    //     updatedProducts[index][field] = value;
    //     setItems(updatedProducts);
    // };

    // const handleProductChange = (index, field, value) => {
    //     const updatedItems = [...items];

    //     if (field === 'product_id' || field === 'quantity') {
    //         updatedItems[index][field] = parseInt(value, 10) || 0; // Ensure integer for product_id and quantity
    //     } else if (field === 'price') {
    //         updatedItems[index][field] = parseFloat(value) || 0.0; // Ensure float for price
    //     }

    //     // Calculate the total for the row
    //     updatedItems[index].total = (updatedProductList[index].price * updatedProductList[index].quantity).toFixed(2);

    //     setProductList(updatedProductList);
    // };

    // const handleProductChange = (index, field, value) => {
    //     const updatedProductList = [...data.productList];

    //     if (field === 'product_id' || field === 'quantity') {
    //         updatedProductList[index][field] = parseInt(value, 10) || 0; // Ensure integer for product_id and quantity
    //     } else if (field === 'price') {
    //         updatedProductList[index][field] = parseFloat(value) || 0.0; // Ensure float for price
    //     }

    //     // Calculate the total for the row
    //     updatedProductList[index].total = (updatedProductList[index].price * updatedProductList[index].quantity).toFixed(2);

    //     setData(prevData => ({
    //         ...prevData,
    //         productList: updatedProductList
    //     }));
    // };

    const handleProductChange = (index, field, value) => {
        const updatedItems = [...data.items];

        if (field === 'product_id') {
            // Ensure product is an integer
            updatedItems[index][field] = parseInt(value, 10) || 0;
        } else if (field === 'price') {
            // Allow numeric input including decimals with max 2 decimal places
            if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
                updatedItems[index][field] = parseFloat(value) || 0.0;
            }
        } else if (field === 'quantity') {
            // Allow only whole numbers
            if (value === '' || /^[0-9]*$/.test(value)) {
                updatedItems[index][field] = parseInt(value, 10) || 0;
            }
        }

        // Calculate the total for the row
        updatedItems[index].total = (updatedItems[index].price * updatedItems[index].quantity).toFixed(2);

        // Update the data object with the modified items
        setData(prevData => ({
            ...prevData,
            items: updatedItems
        }));

        // Optionally, calculate the overall total again
        calculateTotal();
    };


    // const addProductRow = () => {
    //     setItems([...productList, { product_id: '', price: '', quantity: '', total: '' }]);
    // };

    // const addProductRow = () => {
    //     setProductList([...productList, { product_id: '', price: 0.0, quantity: 0, total: '0.00' }]);
    // };

    const addProductRow = () => {
        setData(prevData => ({
            ...prevData,
            items: [
                ...prevData.items,
                { product_id: '', price: 0.0, quantity: 0, total: 0.00 }
            ]
        }));
    };

    // const removeProductRow = (index) => {
    //     const updatedProducts = items.filter((_, i) => i !== index);
    //     setItems(updatedProducts);
    // };

    const removeProductRow = (index) => {
        setData(prevData => ({
            ...prevData,
            items: prevData.items.filter((_, i) => i !== index)
        }));
    };

    // const handleDragEnd = (result) => {
    //     if (!result.destination) return;

    //     const reorderedProducts = Array.from(items);
    //     const [movedProduct] = reorderedProducts.splice(result.source.index, 1);
    //     reorderedProducts.splice(result.destination.index, 0, movedProduct);

    //     setItems(reorderedProducts);
    // };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        // Make a copy of the items from the data object
        const reorderedProducts = Array.from(data.items);

        // Remove the dragged product and reinsert it at the destination index
        const [movedProduct] = reorderedProducts.splice(result.source.index, 1);
        reorderedProducts.splice(result.destination.index, 0, movedProduct);

        // Update the data object with the reordered items
        setData(prevData => ({
            ...prevData,
            items: reorderedProducts
        }));
    };

    const ProductInputSelect = ({ selectItems, label, value, onChange, error, disabled }) => {
        // Custom menu props to limit the visible items and enable scrolling
        const menuProps = {
            PaperProps: {
                style: {
                maxHeight: 400, // Set the maximum height for the dropdown menu
                },
            },
        };

        return (
            <FormControl
            fullWidth
            // variant="standard"
            //   variant="outlined"
            //   className="m-3"
            error={error}
            disabled={disabled}
            >
                {/* <InputLabel id="country-select-label">{label}</InputLabel> */}
                <Select
                labelId="country-select-label"
                id="country-select"
                value={value}
                onChange={onChange}
                label={label}
                MenuProps={menuProps} // Apply custom menu props
                >
                <MenuItem value="">
                    None
                </MenuItem>
                {selectItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                    {item.name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        );
    }

    useEffect(() => {
        console.log(" TOTAL: ", data.total)
    }, [data.total])

    return (
        <>
            {editLoading ? (
                <Loader /> // Render the Loader component while loading
            ) : (
            <FormControl fullWidth>
                <Grid container spacing={5} className="my-4" style={{ width: '100%' }}>

                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <div className="app-page-title--first">
                                <div className="app-page-title--heading">
                                    <h1>{title}</h1>
                                </div>
                            </div>
                            <div className="app-page-title--heading">
                                <h1>Total: <span className='text-success'>${data.total ?? "0.00"}</span></h1>
                            </div>
                        </Box>
                        <Divider className="my-4" />
                    </Grid>

                    <Grid item xs={12}>
                        <div className="app-page-title--first">
                            <div className="app-page-title--heading">
                                <h1>DETAILS</h1>
                            </div>
                        </div>
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

                    <Grid item xs={3}>

                    </Grid>

                    <Grid item xs={3}>
                        <Textarea
                        rows={1}
                        rowsMax={2}
                        label='Total'
                        name='total'
                        id='total'
                        value={data.total ?? "0.00"}
                        key='total'
                        error={data.total <= 0 || data.total === undefined}
                        readOnly
                        />
                    </Grid>

                    <Grid item xs={9}>
                        <InputSelect
                        selectItems={statuses.map(status => ({
                            value: status,
                            name: formatFormRecordDropdown(status)
                        }))}
                        label='Status'
                        name='status'
                        id='status'
                        onChange={handleInputChange('status')}
                        value={data.status ?? ""}
                        error={isEmpty(data.status)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={stores.map(store => ({
                            value: store.id,
                            name: formatFormRecordDropdown(store.name)
                        }))}
                        label='Store'
                        name='store_id'
                        id='store_id'
                        onChange={handleInputChange('store_id')}
                        value={data.store_id ?? ""}
                        error={isEmpty(data.store_id)}
                        disabled={!!id}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputSelect
                        selectItems={balances.map(balance => ({
                            value: balance.id,
                            name: formatFormRecordDropdown(balance.name)
                        }))}
                        label='Balance'
                        name='balance_id'
                        id='balance_id'
                        onChange={handleInputChange('balance_id')}
                        value={data.balance_id ?? ""}
                        error={isEmpty(data.balance_id)}
                        disabled={!!id}
                        />
                    </Grid>

                    {/* <Grid item xs={12} style={{ padding: '0 0 0 35px' }}>
                        <Card className="p-4 shadow-xxl mb-spacing-6-x2" >
                            <div className="table-responsive-md">
                                <Table className="table table-alternate-spaced">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '400px', paddingLeft: 28 }} scope="col">Product</th>
                                            <th scope="col" style={{ paddingLeft: 28 }}>Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col" className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((row, index) => (
                                            <>
                                            <tr key={index} style={{ boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                                                <td style={{ marginBottom: 15 }}>
                                                    <InputSelect
                                                        selectItems={products.map(product => ({
                                                            value: product.id,
                                                            name: product.name
                                                        }))}
                                                        value={row.product_id}
                                                        onChange={e => handleProductChange(index, 'product_id', e.target.value)}
                                                        style={{ minWidth: '90px'}}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField
                                                        value={row.price}
                                                        onChange={e => handleProductChange(index, 'price', e.target.value)}
                                                        inputMode="decimal"
                                                        maxLength={15}
                                                        variant="outlined"
                                                        fullWidth
                                                        style={{ minWidth: '90px', paddingLeft: '14px'}}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField
                                                        value={row.quantity}
                                                        onChange={e => handleProductChange(index, 'quantity', e.target.value)}
                                                        inputMode="decimal"
                                                        maxLength={15}
                                                        variant="outlined"
                                                        fullWidth
                                                        style={{ minWidth: '90px'}}
                                                    />
                                                </td>
                                                <td className="text-right">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        className="d-40 btn-neutral-first"
                                                        onClick={() => removeProductRow(index)}
                                                    >
                                                        <DeleteOutline />
                                                    </Button>
                                                </td>
                                            </tr>
                                            <tr className="divider"></tr>
                                            </>
                                        ))}
                                        <tr style={{ boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                                            <td colSpan={4} className="text-right">
                                                <span>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        className="d-40 btn-neutral-first"
                                                        onClick={addProductRow}
                                                        >
                                                            <AddOutlined />
                                                    </Button>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Grid> */}

                    {/* <Grid item xs={12} style={{ padding: '0 0 0 35px' }}>
                        <Card className="p-4 shadow-xxl mb-spacing-6-x2">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <Table className="table table-alternate-spaced">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '400px', paddingLeft: 28 }} scope="col">Product</th>
                                                        <th scope="col" style={{ paddingLeft: 28 }}>Price</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col" className="text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((row, index) => (
                                                        <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                                                            {(provided) => (
                                                                <>
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.2)',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                >
                                                                    <td style={{ marginBottom: 15 }}>
                                                                        <InputSelect
                                                                            selectItems={products.map(product => ({
                                                                                value: product.id,
                                                                                name: product.name
                                                                            }))}
                                                                            value={row.product_id}
                                                                            onChange={e => handleProductChange(index, 'product_id', e.target.value)}
                                                                            style={{ minWidth: '90px'}}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextField
                                                                            value={row.price}
                                                                            onChange={e => handleProductChange(index, 'price', e.target.value)}
                                                                            inputMode="decimal"
                                                                            maxLength={15}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            style={{ minWidth: '90px', paddingLeft: '14px'}}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextField
                                                                            value={row.quantity}
                                                                            onChange={e => handleProductChange(index, 'quantity', e.target.value)}
                                                                            inputMode="decimal"
                                                                            maxLength={15}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            style={{ minWidth: '90px'}}
                                                                        />
                                                                    </td>
                                                                    <td className="text-right">
                                                                        <Button
                                                                            variant="contained"
                                                                            size="small"
                                                                            className="d-40 btn-neutral-first"
                                                                            onClick={() => removeProductRow(index)}
                                                                        >
                                                                            <DeleteOutline />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                                <tr className="divider"></tr>
                                                                </>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            <div style={{ boxShadow: '0px 0px 0px 2px rgba(0, 0, 0, 0.2)', borderRadius: '4px'}}>
                                <Table className="table table-alternate-spaced">
                                    <tbody>
                                        <tr>
                                            <td colSpan={4} className="text-right">
                                                <span>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        className="d-40 btn-neutral-first"
                                                        onClick={addProductRow}
                                                    >
                                                        <AddOutlined />
                                                    </Button>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Grid> */}

                    <Grid item xs={12} style={{ padding: '0 0 0 15px' }}>
                        <Card className="p-3 shadow-sm mb-4" style={{ borderRadius: '8px' }}>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <Table className="table table-alternate-spaced" size="small">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '300px', paddingLeft: 28 }} scope="col">Product</th>
                                                        <th scope="col" style={{ paddingLeft: 28 }}>Price</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Total</th>
                                                        <th scope="col" className="text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {data.items.map((row, index) => (
                                                    <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                                                        {(provided) => (
                                                            <>
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
                                                                        borderRadius: '12px'
                                                                    }}
                                                                >
                                                                    <td style={{ padding: '0px 8px' }}>
                                                                        <ProductInputSelect
                                                                            selectItems={products.map(product => ({
                                                                                value: product.id,
                                                                                name: formatFormRecordDropdown(product.name)
                                                                            }))}
                                                                            value={row.product_id}
                                                                            onChange={e => handleProductChange(index, 'product_id', e.target.value)}
                                                                            fullWidth
                                                                            // style={{ minWidth: '90px'}}
                                                                            // size="small"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextField
                                                                            value={row.price}
                                                                            onChange={e => handleProductChange(index, 'price', e.target.value)}
                                                                            inputMode="decimal"
                                                                            maxLength={10}
                                                                            // variant="outlined"
                                                                            size="small"
                                                                            style={{ minWidth: '90px', padding: '4px 8px', paddingLeft: '14px'}}
                                                                            fullWidth
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextField
                                                                            value={row.quantity}
                                                                            onChange={e => handleProductChange(index, 'quantity', e.target.value)}
                                                                            inputMode="decimal"
                                                                            maxLength={10}
                                                                            // variant="outlined"
                                                                            size="small"
                                                                            style={{ minWidth: '90px', padding: '4px 8px'}}
                                                                            fullWidth
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextField
                                                                            value={row.total} // Calculate total
                                                                            // variant="outlined"
                                                                            size="small"
                                                                            style={{ minWidth: '90px', padding: '4px 8px' }}
                                                                            fullWidth
                                                                            inputProps={{ readOnly: true }} // Make total read-only
                                                                        />
                                                                    </td>
                                                                    <td className="text-right">
                                                                        <Button
                                                                            variant="outlined"
                                                                            size="small"
                                                                            className="btn-neutral-first"
                                                                            onClick={() => removeProductRow(index)}
                                                                            style={{ padding: '9px' }}
                                                                        >
                                                                            <DeleteOutline style={{ fontSize: '21px' }} />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                                {/* <tr className="divider" style={{ height: '1px', backgroundColor: '#ddd' }}></tr> */}
                                                            </>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                </tbody>
                                            </Table>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            <div style={{ boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)', borderRadius: '12px'}}>
                                <Table className="table table-alternate-spaced" size="small">
                                    <tbody>
                                        <tr>
                                            <td colSpan={4} className="text-right">
                                                <span>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        className="btn-neutral-first"
                                                        onClick={addProductRow}
                                                        style={{ padding: '9px' }}
                                                    >
                                                        <AddOutlined style={{ fontSize: '21px' }} />
                                                    </Button>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
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
                                    // setData({});
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