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
import DatePicker from '../DatePicker';
import InputSelect from '../InputSelect';
import TagSelect from '../TagSelect';
import TimePicker from '../TimePicker';
import Upload from '../Upload';
import ToggleSwitch from '../ToggleSwitch';
import Textarea from '../Textarea';

const MainTable = ({ headers, tableContent, tableButtons, createContent, Heading, selectItems, tagSelectOptions }) => {
    const Create = () => {
      return (
        <Card className="p-4 mb-4" style={{
          minHeight: '80vh',
          height: 'auto',
          // width: '100%',
          // display: 'flex',
          // flexDirection: 'column',
          // justifyContent: 'space-between',
        }}>
            <PageTitle titleHeading={'Add ' + Heading} handleClick={handleClick} />
            <DatePicker />
            <InputSelect selectItems={selectItems} />
            <TagSelect tagSelectOptions={tagSelectOptions} />
            <TimePicker />
            <Upload />
            <ToggleSwitch />
            <Textarea />
            {createContent}
            {/* <Button size="small" className="btn-neutral-primary" onClick={handleClick}>
              <span className="btn-wrapper--icon">
                <FontAwesomeIcon icon={['fas', 'plus-circle']} />
              </span>
              <span className="btn-wrapper--label">Exit</span>
            </Button> */}
        </Card>
      )
    }

    const [entries, setEntries] = useState('1');
    const [showCreate, setShowCreate] = useState(false);

    const handleChange = (event) => {
      setEntries(event.target.value);
    };

    const handleClick = (event) => {
      setShowCreate(prevShowCreate => !prevShowCreate);
  };
  
    return (
      <>
        {showCreate ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Create />
          </motion.div>
        ) : (
        <Card className="card-box mb-spacing-6-x2">
          <div className="card-header py-3">
            <div className="card-header--title font-size-lg">Support board</div>
            <div className="card-header--actions">
              <Button size="small" className="btn-neutral-primary" onClick={handleClick}>
                <span className="btn-wrapper--icon">
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                </span>
                <span className="btn-wrapper--label">Add ticket</span>
              </Button>
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
        )}
      </>
    );
}

export default MainTable