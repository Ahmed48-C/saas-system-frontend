import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  InputLabel,
  InputAdornment,
  Card,
  MenuItem,
  Button,
  Tooltip,
  TextField,
  FormControl,
  Select,
  Grid
} from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';

import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';

import { AnimatePresence, motion } from 'framer-motion';
import { PageTitle } from '../../layout-components';

const MainTable = ({ headers, tableContent, tableButtons, createContent, Heading, headingIcon }) => {
    const Create = () => {
      return (
        <Card className="p-4 mb-4 card-box mb-spacing-6-x2" style={{
          minHeight: '80vh',
          height: 'auto',
        }}>
            <PageTitle titleHeading={'Add ' + Heading} handleClick={handleClick} headingIcon={headingIcon} />
            {/* <DatePicker />
            <InputSelect selectItems={selectItems} />
            <TagSelect tagSelectOptions={tagSelectOptions} />
            <TimePicker />
            <Upload />
            <ToggleSwitch />
            <Textarea /> */}
            {createContent}
        </Card>
      )
    }

    const [entries, setEntries] = useState('1');
    const [showCreate, setShowCreate] = useState(false);
    const [pointerEvents, setPointerEvents] = useState('auto');

    const handleChange = (event) => {
      setEntries(event.target.value);
    };

    const handleClick = (event) => {
      setShowCreate(prevShowCreate => !prevShowCreate);
    };

    const handleAnimationStart = () => {
      setPointerEvents('none');
    };

    const handleAnimationComplete = () => {
      setPointerEvents('auto');
    };
  
    return (
      <>
        {showCreate ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onAnimationStart={handleAnimationStart}
            onAnimationComplete={handleAnimationComplete}
            style={{ pointerEvents }}
          >
            <Create />
          </motion.div>
        ) : (
        <motion.div
          key="table"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          style={{ pointerEvents }}
        >
          <Card className="card-box mb-spacing-6-x2">
            <div className="card-header py-3">
              <div className="card-header--title font-size-xl">{Heading}</div>
              <div className="card-header--actions">
                <Tooltip title="New">
                  <Button
                    variant="contained"
                    size="small"
                    className="d-40 btn-primary"
                    onClick={handleClick}>
                    <span className="btn-wrapper--icon">
                      <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                    </span>
                  </Button>
                </Tooltip>
              </div>
            </div>
            {tableButtons}
            <div className="d-flex align-right px-4 py-3">
              <div className="search-wrapper">
                <TextField
                  variant="outlined"
                  size="small"
                  id="input-search"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>
            <div className="divider" />
            <div className="table-responsive-md">
              <Table className="table table-hover text-nowrap mb-0">
                <thead>
                  <tr>
                  {headers.map((header, index) => (
                      <th key={index} className={header.className}>{header.key}</th>
                  ))}
                  </tr>
                </thead>
                <tbody>
                  {tableContent}
                </tbody>
              </Table>
            </div>
            <div className="card-footer py-3 d-flex justify-content-between">
              <Pagination
                className="pagination-second"
                variant="outlined"
                count={10}
              />
              <div className="d-flex align-items-center">
                <span>Show</span>
                <FormControl size="small" variant="outlined" className="mx-3">
                  <InputLabel id="select-entries-label">Entries</InputLabel>
                  <Select
                    labelId="select-entries-label"
                    id="select-entries"
                    value={entries}
                    onChange={handleChange}
                    label="Entries">
                    <MenuItem className="mx-2" value={1}>
                      All entries
                    </MenuItem>
                    <MenuItem className="mx-2" value={10}>
                      10
                    </MenuItem>
                    <MenuItem className="mx-2" value={15}>
                      15
                    </MenuItem>
                    <MenuItem className="mx-2" value={20}>
                      20
                    </MenuItem>
                    <MenuItem className="mx-2" value={25}>
                      25
                    </MenuItem>
                    <MenuItem className="mx-2" value={30}>
                      30
                    </MenuItem>
                  </Select>
                </FormControl>
                <span>entries</span>
              </div>
            </div>
          </Card>
        </motion.div>
        )}
      </>
    );
}

export default MainTable