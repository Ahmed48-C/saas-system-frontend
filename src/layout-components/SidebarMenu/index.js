import React, { useState } from 'react';

import clsx from 'clsx';

import { Collapse } from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import SidebarUserbox from '../SidebarUserbox';

import ChevronRightTwoToneIcon from '@material-ui/icons/ChevronRightTwoTone';

import DashboardIcon from '@material-ui/icons/Dashboard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ContactsIcon from '@material-ui/icons/Contacts';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import BuildIcon from '@material-ui/icons/Build';
import SettingsIcon from '@material-ui/icons/Settings';
import ArchiveIcon from '@material-ui/icons/Archive';

const SidebarMenu = (props) => {
  const { setSidebarToggleMobile, sidebarUserbox } = props;

  const toggleSidebarMobile = () => setSidebarToggleMobile(false);

  const [salesOpen, setSalesOpen] = useState(false);
  const toggleSales = (event) => {
    setSalesOpen(!salesOpen);
    event.preventDefault();
  };

  const [purchasesOpen, setPurchasesOpen] = useState(false);
  const togglePurchases = (event) => {
    setPurchasesOpen(!purchasesOpen);
    event.preventDefault();
  };

  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const toggleTransactions = (event) => {
    setTransactionsOpen(!transactionsOpen);
    event.preventDefault();
  };

  const [reportsOpen, setReportsOpen] = useState(false);
  const toggleReports = (event) => {
    setReportsOpen(!reportsOpen);
    event.preventDefault();
  };

  const [contactsOpen, setContactsOpen] = useState(false);
  const toggleContacts = (event) => {
    setContactsOpen(!contactsOpen);
    event.preventDefault();
  };

  const [accountingOpen, setAccountingOpen] = useState(false);
  const toggleAccounting = (event) => {
    setAccountingOpen(!accountingOpen);
    event.preventDefault();
  };

  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const toggleControlPanel = (event) => {
    setControlPanelOpen(!controlPanelOpen);
    event.preventDefault();
  };

  return (
    <>
      <PerfectScrollbar>
        {sidebarUserbox && <SidebarUserbox />}
        <div className="sidebar-navigation">
          <div className="sidebar-header">
            <span>Dashboard</span>
          </div>
          <ul>
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/ui/Dashboard">
                <span className="sidebar-icon">
                  {/* <BallotTwoToneIcon /> */}
                  <DashboardIcon />
                </span>
                Dashboard
                {/* <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span> */}
              </NavLink>
            </li>
            <li>
              <a
                href="#/"
                onClick={togglePurchases}
                className={clsx({ active: purchasesOpen })}>
                <span className="sidebar-icon">
                  {/* <VerifiedUserTwoToneIcon /> */}
                  <ShoppingCartIcon />
                </span>
                <span className="sidebar-item-label">Purchases</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={purchasesOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/purchase-orders">
                      Purchase Order
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardCommerce">
                      Bill
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardAnalytics">
                      Credit Note
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Payment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Refund
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <a
                href="#/"
                onClick={toggleSales}
                className={clsx({ active: salesOpen })}>
                <span className="sidebar-icon">
                  {/* <VerifiedUserTwoToneIcon /> */}
                  <AttachMoneyIcon />
                </span>
                <span className="sidebar-item-label">Sales</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={salesOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardMonitoring">
                      Quote
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardCommerce">
                      Invoice
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/sale-orders">
                      Sale Order
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Credit Note
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Payment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Refund
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <a
                href="#/"
                onClick={toggleTransactions}
                className={clsx({ active: transactionsOpen })}>
                <span className="sidebar-icon">
                  {/* <VerifiedUserTwoToneIcon /> */}
                  <SwapHorizIcon />
                </span>
                <span className="sidebar-item-label">Transactions</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={transactionsOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/balances">
                      Balances
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/deposits">
                      Deposits
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/withdraws">
                      Withdraws
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/transfers">
                      Transfers
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <a
                href="#/"
                onClick={toggleReports}
                className={clsx({ active: reportsOpen })}>
                <span className="sidebar-icon">
                  {/* <VerifiedUserTwoToneIcon /> */}
                  <AssessmentIcon />
                </span>
                <span className="sidebar-item-label">Reports</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={reportsOpen}>
                <ul>
                  
                </ul>
              </Collapse>
            </li>
            <li>
              <a
                href="#/"
                onClick={toggleContacts}
                className={clsx({ active: contactsOpen })}>
                <span className="sidebar-icon">
                  <ContactsIcon />
                </span>
                <span className="sidebar-item-label">Contacts</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={contactsOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardMonitoring">
                      Employees
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/suppliers">
                      Suppliers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/customers">
                      Customers
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li>
            <li>
              <a
                href="#/"
                onClick={toggleAccounting}
                className={clsx({ active: accountingOpen })}>
                <span className="sidebar-icon">
                  <AccountBalanceIcon />
                </span>
                <span className="sidebar-item-label">Accounting</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={accountingOpen}>
                <ul>
                  
                </ul>
              </Collapse>
            </li>
            {/* <li>
              <a
                href="#/"
                onClick={toggleProductsServices}
                className={clsx({ active: productsServicesOpen })}>
                <span className="sidebar-icon">
                  <BuildIcon />
                </span>
                <span className="sidebar-item-label">Products & Services</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={productsServicesOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardMonitoring">
                      Monitoring
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardCommerce">
                      Commerce
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardAnalytics">
                      Analytics
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Statistics
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li> */}
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/ui/products">
                <span className="sidebar-icon">
                  {/* <BallotTwoToneIcon /> */}
                  <BuildIcon />
                </span>
                Products
                {/* <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span> */}
              </NavLink>
            </li>
            {/* <li>
              <a
                href="#/"
                onClick={toggleIventory}
                className={clsx({ active: InventoryOpen })}>
                <span className="sidebar-icon">
                  <ArchiveIcon />
                </span>
                <span className="sidebar-item-label">Inventory</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={InventoryOpen}>
                <ul>

                </ul>
              </Collapse>
            </li> */}
            <li>
              <NavLink
                activeClassName="active"
                onClick={toggleSidebarMobile}
                className="nav-link-simple"
                to="/ui/inventories">
                <span className="sidebar-icon">
                  {/* <BallotTwoToneIcon /> */}
                  <ArchiveIcon />
                </span>
                Inventories
                {/* <span className="sidebar-icon-indicator sidebar-icon-indicator-right">
                  <ChevronRightTwoToneIcon />
                </span> */}
              </NavLink>
            </li>
            {/* <li>
              <a
                href="#/"
                onClick={toggleSuppliers}
                className={clsx({ active: suppliersOpen })}>
                <span className="sidebar-icon">
                  <LocalShippingIcon />
                </span>
                <span className="sidebar-item-label">Suppliers</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={suppliersOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardMonitoring">
                      Monitoring
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardCommerce">
                      Commerce
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardAnalytics">
                      Analytics
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/DashboardStatistics">
                      Statistics
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li> */}
            <li>
              <a
                href="#/"
                onClick={toggleControlPanel}
                className={clsx({ active: controlPanelOpen })}>
                <span className="sidebar-icon">
                  <SettingsIcon />
                </span>
                <span className="sidebar-item-label">Control Panel</span>
                <span className="sidebar-icon-indicator">
                  <ChevronRightTwoToneIcon />
                </span>
              </a>
              <Collapse in={controlPanelOpen}>
                <ul>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/locations">
                      Locations
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={toggleSidebarMobile}
                      to="/ui/stores">
                      Stores
                    </NavLink>
                  </li>
                </ul>
              </Collapse>
            </li>
          </ul>
        </div>
      </PerfectScrollbar>
    </>
  );
};

const mapStateToProps = (state) => ({
  sidebarUserbox: state.ThemeOptions.sidebarUserbox,

  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarMenu);
