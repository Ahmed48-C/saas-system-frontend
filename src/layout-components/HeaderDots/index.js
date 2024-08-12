import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Popover,
  Badge,
  Button
} from '@material-ui/core';

import CurrencyConverter from '../../pages-components/CurrencyConverter';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import Calculator from '../../pages-components/Calculator';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Reminders from '../../pages-components/Reminders';


const HeaderDots = () => {
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);

  return (
    <>
      <div className="d-flex align-items-center popover-header-wrapper">
        <span className="pr-2">
          <Button
            onClick={handleClick1}
            className="btn-transition-none bg-neutral-success text-success font-size-lg p-0 d-inline-block shadow-none border-0 text-center d-44 rounded position-relative">
            <span>
              <SwapHorizIcon />
            </span>
          </Button>
          <Popover
            open={open1}
            anchorEl={anchorEl1}
            onClose={handleClose1}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            >
            <CurrencyConverter />
          </Popover>
        </span>
        <span className="pr-2">
          <Badge
            variant="dot"
            overlap="circle"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            badgeContent=" ">
            <Button
              onClick={handleClick2}
              className="btn-transition-none bg-neutral-danger text-danger font-size-lg p-0 d-inline-block shadow-none border-0 text-center d-44 rounded position-relative">
              <span>
                <FontAwesomeIcon icon={faCalculator} className="font-size-lg" />
              </span>
            </Button>
          </Badge>
          <Popover
            open={open2}
            anchorEl={anchorEl2}
            onClose={handleClose2}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            >
              <Calculator />
          </Popover>
        </span>
        <span className="pr-2">
          <Badge
            variant="dot"
            overlap="circle"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            badgeContent=" ">
            <Button
              onClick={handleClick3}
              className="btn-transition-none bg-neutral-first text-first font-size-lg p-0 d-inline-block shadow-none border-0 text-center d-44 rounded position-relative">
              <span>
                <NotificationsActiveIcon />
              </span>
            </Button>
          </Badge>
          <Popover
            open={open3}
            anchorEl={anchorEl3}
            onClose={handleClose3}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left' // Shift to the left
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right' // Align the top with the right edge of the button
            }}>
              <Reminders />
          </Popover>
        </span>
      </div>
    </>
  );
};

export default HeaderDots;
