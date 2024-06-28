import React, { useState } from 'react';

import clsx from 'clsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Tooltip
} from '@material-ui/core';

import { connect } from 'react-redux';

const PageTitle = (props) => {
  const {
    pageTitleStyle,
    pageTitleBackground,
    pageTitleShadow,
    titleHeading,
    children,
    handleClick
  } = props;

  return (
    <>
      <div
          className={clsx('app-page-title', pageTitleStyle, pageTitleBackground, {
            'app-page-title--shadow': pageTitleShadow
          })}
          style={{ padding: 0, margin: 0 }}
        >
        <div>
          <div className="app-page-title--first">
            <div className="app-page-title--heading">
              <h1>{titleHeading}</h1>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          {children}
          <Tooltip title="Close">
            <Button
              variant="contained"
              size="small"
              className="d-40 btn-danger"
              onClick={handleClick}>
              <span className="btn-wrapper--icon">
                <FontAwesomeIcon icon={['fas', 'minus']} className="opacity-8" />
              </span>
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  pageTitleStyle: state.ThemeOptions.pageTitleStyle,
  pageTitleBackground: state.ThemeOptions.pageTitleBackground,
  pageTitleShadow: state.ThemeOptions.pageTitleShadow,
});

export default connect(mapStateToProps)(PageTitle);
