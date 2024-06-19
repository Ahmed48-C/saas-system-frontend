import React, { useState } from 'react'
import { DatePicker, InputSelect, MainTable, Popover, TagSelect, Textarea, TimePicker, ToggleSwitch, Upload } from '../pages-components'
import { Box, Button, ButtonGroup, Card, Divider, Fade, Grid, Popper, Tooltip } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useCountries } from 'use-react-countries'

const headers = [
  { key: 'Code', className: 'bg-white text-left' },
  { key: 'Name', className: 'bg-white text-left' },
  { key: 'Actions', className: 'bg-white text-center' }
];

// Extract rows
const rows = [
  {
    ID: '#453',
    Requester: 'Shanelle Wynn',
    Subject: 'When, while the lovely valley teems',
    Priority: { className: 'badge badge-neutral-danger text-danger', text: 'High' },
    Status: { className: 'badge badge-neutral-dark text-dark', text: 'Closed' },
    Created: '12/12/2020',
    Due: '08/30/2021',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  },
  {
    ID: '#584',
    Requester: 'Brody Dixon',
    Subject: 'I am so happy, my dear friend',
    Priority: { className: 'badge badge-neutral-warning text-warning', text: 'Low' },
    Status: { className: 'badge badge-neutral-success text-success', text: 'Open' },
    Created: '06/08/2022',
    Due: '07/25/2023',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  },
  {
    ID: '#764',
    Requester: 'Milton Ayala',
    Subject: 'His own image, and the breath',
    Priority: { className: 'badge badge-neutral-info text-info', text: 'Medium' },
    Status: { className: 'badge badge-neutral-dark text-dark', text: 'Closed' },
    Created: '12/12/2020',
    Due: '08/30/2021',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  },
  {
    ID: '#453',
    Requester: 'Kane Gentry',
    Subject: 'When I hear the buzz',
    Priority: { className: 'badge badge-neutral-warning text-warning', text: 'Low' },
    Status: { className: 'badge badge-neutral-success text-success', text: 'Open' },
    Created: '12/12/2020',
    Due: '08/30/2021',
    Actions: '<Button size="small" className="btn-link d-30 p-0 btn-icon hover-scale-sm"><FontAwesomeIcon icon={["fas", "ellipsis-h"]} className="font-size-lg" /></Button>'
  }
];

const Locations = () => {
  const Heading = 'Locations'
  const headingIcon = <DashboardIcon className='text-primary'/>
  
  const { countries } = useCountries();

  const countryOptions = countries
    .map(country => ({
      name: country.name,
      value: country.name, // Setting value to country name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  const createContent = (
    <>
      <Grid container spacing={3} className="my-4">
        <Grid item xs={12}>
          <div className="font-size-lg font-weight-bold">DETAILS</div>
        </Grid>
        <Grid item xs={12}>
          <Divider className="my-4" />
        </Grid>
        <Grid item xs={6}>
          <Textarea rows={1} rowsMax={2} label='Code' />
        </Grid>
        <Grid item xs={6}>
          <Textarea rows={1} rowsMax={2} label='Name' />
        </Grid>
        <Grid item xs={12}>
          <Textarea rows={1} rowsMax={2} label='Note' />
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
          <Textarea rows={1} rowsMax={2} label='Street' />
        </Grid>
        <Grid item xs={6}>
          <Textarea rows={1} rowsMax={2} label='City' />
        </Grid>
        <Grid item xs={6}>
          <Textarea rows={1} rowsMax={2} label='State' />
        </Grid>
        <Grid item xs={6}>
          <Textarea rows={1} rowsMax={2} label='Postcode' />
        </Grid>
        <Grid item xs={6}>
          <InputSelect selectItems={countryOptions} label='country' />
        </Grid>
        <Grid item xs={12}>
          <Divider className="my-4" />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Tooltip title="Submit">
              <Button
                variant="contained"
                size="small"
                className="d-40 btn-success"
                // onClick={handleClick}
              >
                <span className="btn-wrapper--icon">
                  <FontAwesomeIcon icon={['fas', 'plus']} className="opacity-8" />
                </span>
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </>
  )

  const [active, setActive] = useState(true);  // This state controls whether the item is active or not
  const [isDefault, setIsDefault] = useState(false);  // This state controls whether the item is active or not

  const handleOpenPopper = (event) => {
    handleClick();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleButtonClick = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (event) => {
    handleButtonClick();
  };

  const handleActivateClick = (event) => {
    setActive(true);
    handleButtonClick();
  };

  const handleDeactivateClick = (event) => {
    setActive(false);
    handleButtonClick();
  };

  const handleDeleteClick = (event) => {
    handleButtonClick();
  };

  const handleDefaultClick = (event) => {
    handleButtonClick();
  };

  const tableContent = rows.map((row, index) =>(
    <tr key={index}>
      <td>
        <div className="d-flex align-items-center">
          <div>{row.Requester}</div>
        </div>
      </td>
      <td>{row.Subject}</td>
      <td className="text-center">
        <Button
          size="small"
          className="btn-link d-30 p-0 btn-icon hover-scale-sm"
          onClick={handleClick}
          >
          <FontAwesomeIcon
            icon={['fas', 'ellipsis-h']}
            className="font-size-lg"
          />
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              {/* <Card className='card-box' >
                <div className="p-1 font-weight-bold bg-secondary d-flex align-items-center justify-content-center" style={{height: '20px', fontSize: '12px'}}>
                  The content of the Popper.
                </div>
                <Divider />
                <div className="p-1 font-weight-bold bg-secondary d-flex align-items-center justify-content-center" style={{height: '20px', fontSize: '12px'}}>
                  Lorem ipsum
                </div>
              </Card> */}
              {/* <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical outlined primary button group"
                variant="contained"
              >
                <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleEditClick}>Edit</Button>
                <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDefaultClick}>Default</Button>
                <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDeleteClick}>Delete</Button>
                <Button
                  className="d-30 px-5 btn-icon hover-scale-sm text-white"
                  onClick={active ? handleDeactivateClick : handleActivateClick}
                >
                  {active ? 'Deactivate' : 'Activate'}
                </Button>
              </ButtonGroup> */}
              <div>
                {/* Edit button is always visible */}
                {active && isDefault && (
                  <ButtonGroup
                    orientation="vertical"
                    color="primary"
                    aria-label="vertical outlined primary button group"
                    variant="contained"
                  >
                    <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleEditClick}>Edit</Button>
                  </ButtonGroup>
                )}

                {/* Conditional rendering for active and not default */}
                {active && !isDefault && (
                  <ButtonGroup
                    orientation="vertical"
                    color="primary"
                    aria-label="vertical outlined primary button group"
                    variant="contained"
                  >
                    <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleEditClick}>Edit</Button>
                    <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDefaultClick}>Default</Button>
                    <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDeleteClick}>Delete</Button>
                    <Button
                      className="d-30 px-5 btn-icon hover-scale-sm text-white"
                      onClick={handleDeactivateClick}
                    >
                      Deactivate
                    </Button>
                  </ButtonGroup>
                )}

                {/* Conditional rendering for not active */}
                {!active && (
                  <ButtonGroup
                    orientation="vertical"
                    color="primary"
                    aria-label="vertical outlined primary button group"
                    variant="contained"
                  >
                    <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleEditClick}>Edit</Button>
                    <Button className="d-30 px-5 btn-icon hover-scale-sm text-white" onClick={handleDeleteClick}>Delete</Button>
                    <Button
                      className="d-30 px-5 btn-icon hover-scale-sm text-white"
                      onClick={handleActivateClick}
                    >
                      Activate
                    </Button>
                  </ButtonGroup>
                )}
              </div>
            </Fade>
          )}
        </Popper>
      </td>
    </tr>
  ))
  

  return (
    <>
      <MainTable headers={headers} tableContent={tableContent} Heading={Heading} headingIcon={headingIcon} createContent={createContent} />
    </>
  )
}

export default Locations