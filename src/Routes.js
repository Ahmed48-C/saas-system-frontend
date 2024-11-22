import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ClimbingBoxLoader } from 'react-spinners';

import { LeftSidebar } from './layout-blueprints';

import { ThemeProvider } from '@material-ui/styles';
import MuiTheme from './theme';

import InternalServerError from './pages/InternalServerError';
import NotFound from './pages/NotFound';
// import BadRequest from './pages/BadRequest';
// import Forbidden from './pages/Forbidden';
// import Unauthorized from './pages/Unauthorized';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fab,
  faFacebook,
  faTwitter,
  faVuejs,
  faReact,
  faHtml5,
  faGoogle,
  faInstagram,
  faPinterest,
  faYoutube,
  faDiscord,
  faSlack,
  faDribbble,
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import {
  far,
  faSquare,
  faLifeRing,
  faCheckCircle,
  faTimesCircle,
  faDotCircle,
  faThumbsUp,
  faComments,
  faFolderOpen,
  faTrashAlt,
  faFileImage,
  faFileArchive,
  faCommentDots,
  faFolder,
  faKeyboard,
  faCalendarAlt,
  faEnvelope,
  faAddressCard,
  faMap,
  faObjectGroup,
  faImages,
  faUser,
  faLightbulb,
  faGem,
  faClock,
  faUserCircle,
  faQuestionCircle,
  faBuilding,
  faBell,
  faFileExcel,
  faFileAudio,
  faFileVideo,
  faFileWord,
  faFilePdf,
  faFileCode,
  faFileAlt,
  faEye,
  faChartBar
} from '@fortawesome/free-regular-svg-icons';
import {
  fas,
  faExclamation,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faCheck,
  faSmile,
  faHeart,
  faBatteryEmpty,
  faBatteryFull,
  faChevronRight,
  faSitemap,
  faPrint,
  faMapMarkedAlt,
  faTachometerAlt,
  faAlignCenter,
  faExternalLinkAlt,
  faShareSquare,
  faInfoCircle,
  faSync,
  faQuoteRight,
  faStarHalfAlt,
  faShapes,
  faCarBattery,
  faTable,
  faCubes,
  faPager,
  faCameraRetro,
  faBomb,
  faNetworkWired,
  faBusAlt,
  faBirthdayCake,
  faEyeDropper,
  faUnlockAlt,
  faDownload,
  faAward,
  faPlayCircle,
  faReply,
  faUpload,
  faBars,
  faEllipsisV,
  faSave,
  faSlidersH,
  faCaretRight,
  faChevronUp,
  faPlus,
  faLemon,
  faChevronLeft,
  faTimes,
  faChevronDown,
  faFilm,
  faSearch,
  faEllipsisH,
  faCog,
  faArrowsAltH,
  faPlusCircle,
  faAngleRight,
  faAngleUp,
  faAngleLeft,
  faAngleDown,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faArrowLeft,
  faStar,
  faSignOutAlt,
  faLink
} from '@fortawesome/free-solid-svg-icons';
library.add(
  far,
  faSquare,
  faLifeRing,
  faCheckCircle,
  faTimesCircle,
  faDotCircle,
  faThumbsUp,
  faComments,
  faFolderOpen,
  faTrashAlt,
  faFileImage,
  faFileArchive,
  faCommentDots,
  faFolder,
  faKeyboard,
  faCalendarAlt,
  faEnvelope,
  faAddressCard,
  faMap,
  faObjectGroup,
  faImages,
  faUser,
  faLightbulb,
  faGem,
  faClock,
  faUserCircle,
  faQuestionCircle,
  faBuilding,
  faBell,
  faFileExcel,
  faFileAudio,
  faFileVideo,
  faFileWord,
  faFilePdf,
  faFileCode,
  faFileAlt,
  faEye,
  faChartBar
);
library.add(
  fab,
  faFacebook,
  faTwitter,
  faVuejs,
  faReact,
  faHtml5,
  faGoogle,
  faInstagram,
  faPinterest,
  faYoutube,
  faDiscord,
  faSlack,
  faDribbble,
  faGithub
);
library.add(
  fas,
  faExclamation,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faCheck,
  faSmile,
  faHeart,
  faBatteryEmpty,
  faBatteryFull,
  faChevronRight,
  faSitemap,
  faPrint,
  faMapMarkedAlt,
  faTachometerAlt,
  faAlignCenter,
  faExternalLinkAlt,
  faShareSquare,
  faInfoCircle,
  faSync,
  faQuoteRight,
  faStarHalfAlt,
  faShapes,
  faCarBattery,
  faTable,
  faCubes,
  faPager,
  faCameraRetro,
  faBomb,
  faNetworkWired,
  faBusAlt,
  faBirthdayCake,
  faEyeDropper,
  faUnlockAlt,
  faDownload,
  faAward,
  faPlayCircle,
  faReply,
  faUpload,
  faBars,
  faEllipsisV,
  faSave,
  faSlidersH,
  faCaretRight,
  faChevronUp,
  faPlus,
  faLemon,
  faChevronLeft,
  faTimes,
  faChevronDown,
  faFilm,
  faSearch,
  faEllipsisH,
  faCog,
  faArrowsAltH,
  faPlusCircle,
  faAngleRight,
  faAngleUp,
  faAngleLeft,
  faAngleDown,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faArrowLeft,
  faStar,
  faSignOutAlt,
  faLink
);

const NotFound404 = () => {
  return <NotFound title="404 - Page Not Found" description="Sorry, the page you are looking for does not exist." />;
};

const InternalServerError500 = () => {
  return <InternalServerError title="500 - Internal Server Error" description="The server encountered an internal error and was unable to complete your request." />;
};

// const BadRequest400 = () => {
//   return <BadRequest title="400 - Bad Request" description="The server could not understand the request due to invalid syntax." />;
// };

// const Forbidden403 = () => {
//   return <Forbidden title="403 - Forbidden" description="You do not have permission to access this page." />;
// };

// const Unauthorized401 = () => {
//   return <Unauthorized title="401 - Unauthorized" description="You need to be logged in to view this page." />;
// };

const Dashboard = lazy(() =>
  import('./pages/Dashboard')
);


const Locations = lazy(() =>
  import('./pages/Locations/index')
);

const CreateLocations = lazy(() =>
  import('./pages/Locations/CreateContent')
);

const EditLocations = lazy(() =>
  import('./pages/Locations/EditContent')
);


const Stores = lazy(() =>
  import('./pages/Stores/index')
);

const CreateStores = lazy(() =>
  import('./pages/Stores/CreateContent')
);

const EditStores = lazy(() =>
  import('./pages/Stores/EditContent')
);


const Suppliers = lazy(() =>
  import('./pages/Suppliers/index')
);

const CreateSuppliers = lazy(() =>
  import('./pages/Suppliers/CreateContent')
);

const EditSuppliers = lazy(() =>
  import('./pages/Suppliers/EditContent')
);


const Customers = lazy(() =>
  import('./pages/Customers/index')
);

const CreateCustomers = lazy(() =>
  import('./pages/Customers/CreateContent')
);

const EditCustomers = lazy(() =>
  import('./pages/Customers/EditContent')
);


const Products = lazy(() =>
  import('./pages/Products/index')
);

const CreateProducts = lazy(() =>
  import('./pages/Products/CreateContent')
);

const EditProducts = lazy(() =>
  import('./pages/Products/EditContent')
);


const Inventories = lazy(() =>
  import('./pages/Inventories/index')
);

const CreateInventories = lazy(() =>
  import('./pages/Inventories/CreateContent')
);

const EditInventories = lazy(() =>
  import('./pages/Inventories/EditContent')
);


const PurchaseOrders = lazy(() =>
  import('./pages/PurchaseOrders/index')
);

const CreatePurchaseOrders = lazy(() =>
  import('./pages/PurchaseOrders/CreateContent')
);

const EditPurchaseOrders = lazy(() =>
  import('./pages/PurchaseOrders/EditContent')
);

const Balances = lazy(() =>
  import('./pages/Balances/index')
);

const CreateBalances = lazy(() =>
  import('./pages/Balances/CreateContent')
);

const Deposits = lazy(() =>
  import('./pages/Deposits/index')
);

const CreateDeposits = lazy(() =>
  import('./pages/Deposits/CreateContent')
);

const Withdraws = lazy(() =>
  import('./pages/Withdraws/index')
);

const CreateWithdraws = lazy(() =>
  import('./pages/Withdraws/CreateContent')
);

const Transfers = lazy(() =>
  import('./pages/Transfers/index')
);

const CreateTransfers = lazy(() =>
  import('./pages/Transfers/CreateContent')
);

const SaleOrders = lazy(() =>
  import('./pages/SaleOrders/index')
);

const CreateSaleOrders = lazy(() =>
  import('./pages/SaleOrders/CreateContent')
);

const EditSaleOrders = lazy(() =>
  import('./pages/SaleOrders/EditContent')
);

const CompletedSaleOrders = lazy(() =>
  import('./pages/CompletedSaleOrders/index')
);

const DeliverySaleOrders = lazy(() =>
  import('./pages/DeliverySaleOrders/index')
);

const CancelledSaleOrders = lazy(() =>
  import('./pages/CancelledSaleOrders/index')
);

const Couriers = lazy(() =>
  import('./pages/Couriers/index')
);

const CreateCouriers = lazy(() =>
  import('./pages/Couriers/CreateContent')
);

const EditCouriers = lazy(() =>
  import('./pages/Couriers/EditContent')
);

const Clients = lazy(() =>
  import('./pages/Clients/index')
);

const CreateClients = lazy(() =>
  import('./pages/Clients/CreateContent')
);

const EditClients = lazy(() =>
  import('./pages/Clients/EditContent')
);

const Routes = () => {
  const SuspenseLoading = () => {
      const [show, setShow] = useState(false);
      useEffect(() => {
        let timeout = setTimeout(() => setShow(true), 300);
        return () => {
          clearTimeout(timeout);
        };
      }, []);

      return (
        <>
          <AnimatePresence>
            {show && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}>
                <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
                  <div className="d-flex align-items-center flex-column px-4">
                    <ClimbingBoxLoader color={'#3c44b1'} loading={true} />
                  </div>
                  <div className="text-muted font-size-xl text-center pt-3">
                    Please wait while we load the live preview examples
                    <span className="font-size-lg d-block text-dark">
                      This live preview instance can be slower than a real
                      production build!
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
  };

  return (
      <ThemeProvider theme={MuiTheme}>
          <LeftSidebar>
              <AnimatePresence>
                  <Suspense fallback={<SuspenseLoading />}>
                      <Switch>
                          <Redirect exact from="/ui" to="/ui/dashboard" />
                          {/* <Route> */}

                            <Route
                                exact
                                path="/ui/dashboard"
                                component={Dashboard}
                            />

                            <Route
                                exact
                                path="/ui/locations"
                                component={Locations}
                            />
                            <Route
                                exact
                                path="/ui/location/create"
                                component={CreateLocations}
                            />
                            <Route
                                exact
                                path="/ui/location/edit/:id"
                                component={EditLocations}
                            />

                            <Route
                                exact
                                path="/ui/stores"
                                component={Stores}
                            />
                            <Route
                                exact
                                path="/ui/store/create"
                                component={CreateStores}
                            />
                            <Route
                                exact
                                path="/ui/store/edit/:id"
                                component={EditStores}
                            />

                            <Route
                                exact
                                path="/ui/suppliers"
                                component={Suppliers}
                            />
                            <Route
                                exact
                                path="/ui/supplier/create"
                                component={CreateSuppliers}
                            />
                            <Route
                                exact
                                path="/ui/supplier/edit/:id"
                                component={EditSuppliers}
                            />

                            <Route
                                exact
                                path="/ui/customers"
                                component={Customers}
                            />
                            <Route
                                exact
                                path="/ui/customer/create"
                                component={CreateCustomers}
                            />
                            <Route
                                exact
                                path="/ui/customer/edit/:id"
                                component={EditCustomers}
                            />

                            <Route
                                exact
                                path="/ui/products"
                                component={Products}
                            />
                            <Route
                                exact
                                path="/ui/product/create"
                                component={CreateProducts}
                            />
                            <Route
                                exact
                                path="/ui/product/edit/:id"
                                component={EditProducts}
                            />

                            <Route
                                exact
                                path="/ui/inventories"
                                component={Inventories}
                            />
                            <Route
                                exact
                                path="/ui/inventory/create"
                                component={CreateInventories}
                            />
                            <Route
                                exact
                                path="/ui/inventory/edit/:id"
                                component={EditInventories}
                            />

                            <Route
                                exact
                                path="/ui/purchase-orders"
                                component={PurchaseOrders}
                            />
                            <Route
                                exact
                                path="/ui/purchase-order/create"
                                component={CreatePurchaseOrders}
                            />
                            <Route
                                exact
                                path="/ui/purchase-order/edit/:id"
                                component={EditPurchaseOrders}
                            />

                            <Route
                                exact
                                path="/ui/balances"
                                component={Balances}
                            />
                            <Route
                                exact
                                path="/ui/balance/create"
                                component={CreateBalances}
                            />

                            <Route
                                exact
                                path="/ui/deposits"
                                component={Deposits}
                            />
                            <Route
                                exact
                                path="/ui/deposit/create"
                                component={CreateDeposits}
                            />

                            <Route
                                exact
                                path="/ui/withdraws"
                                component={Withdraws}
                            />
                            <Route
                                exact
                                path="/ui/withdraw/create"
                                component={CreateWithdraws}
                            />

                            <Route
                                exact
                                path="/ui/transfers"
                                component={Transfers}
                            />
                            <Route
                                exact
                                path="/ui/transfer/create"
                                component={CreateTransfers}
                            />

                            <Route
                                exact
                                path="/ui/sale-orders"
                                component={SaleOrders}
                            />
                            <Route
                                exact
                                path="/ui/sale-order/create"
                                component={CreateSaleOrders}
                            />
                            <Route
                                exact
                                path="/ui/sale-order/edit/:id"
                                component={EditSaleOrders}
                            />

                            <Route
                                exact
                                path="/ui/completed-sale-orders"
                                component={CompletedSaleOrders}
                            />

                            <Route
                                exact
                                path="/ui/delivery-sale-orders"
                                component={DeliverySaleOrders}
                            />

                            <Route
                                exact
                                path="/ui/cancelled-sale-orders"
                                component={CancelledSaleOrders}
                            />

                            <Route
                              exact
                              path="/ui/couriers"
                              component={Couriers}
                            />
                            <Route
                              exact
                              path="/ui/courier/create"
                              component={CreateCouriers}
                            />
                            <Route
                              exact
                              path="/ui/courier/edit/:id"
                              component={EditCouriers}
                            />

                            <Route
                              exact
                              path="/ui/clients"
                              component={Clients}
                            />
                            <Route
                              exact
                              path="/ui/client/create"
                              component={CreateClients}
                            />
                            <Route
                              exact
                              path="/ui/client/edit/:id"
                              component={EditClients}
                            />

                            {/* <Route path="/ui/400" component={BadRequest400} />
                            <Route path="/ui/401" component={Unauthorized401} />
                            <Route path="/ui/403" component={Forbidden403} /> */}
                            <Route path="/ui/500" component={InternalServerError500} />
                            {/* Catch all other routes */}
                            <Route component={NotFound404} />
                          {/* </Route> */}
                      </Switch>
                  </Suspense>
              </AnimatePresence>
          </LeftSidebar>
      </ThemeProvider>
  )
}

export default Routes