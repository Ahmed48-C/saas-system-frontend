import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Grid, Card, CardContent, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader } from '../../pages-components';
import { handleFetchRecord } from '../../functions/pages/handleFetchRecord';
import { API_ENDPOINTS } from '../../config/apis';

const useStyles = makeStyles({
  invoiceWrapper: {
    width: '100%',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0',
  },
  invoicePaper: {
    width: '210mm',
    minHeight: '297mm',
    background: 'white',
    padding: '12mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    margin: '0 auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    '@media screen': {
      margin: '20px auto',
    }
  },
  invoiceContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    margin: '0',
  },
  downloadButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  },
//   '@media print': {
//     '@page': {
//       size: 'A4',
//       margin: '0mm',
//     },
//     'html, body': {
//       width: '210mm',
//       height: '297mm',
//       margin: '0',
//       padding: '0',
//     },
//     invoiceWrapper: {
//       width: '210mm',
//       minHeight: '297mm',
//       padding: '0',
//       margin: '0',
//       background: 'white',
//       '-webkit-print-color-adjust': 'exact',
//       'print-color-adjust': 'exact',
//     },
//     invoicePaper: {
//       width: '210mm',
//       minHeight: '297mm',
//       padding: '12mm',
//       margin: '0',
//       boxShadow: 'none',
//       transform: 'none',
//       '-webkit-print-color-adjust': 'exact',
//       'print-color-adjust': 'exact',
//     },
//     invoiceContent: {
//       padding: '0',
//       margin: '0',
//     },
//     downloadButton: {
//       display: 'none',
//     },
//     'body > *:not(.MuiDialog-root)': {
//       display: 'none',
//     },
//     'div[role="dialog"]': {
//       position: 'absolute',
//       left: '0',
//       top: '0',
//       margin: '0',
//       padding: '0',
//       width: '210mm',
//       minHeight: '297mm',
//       overflow: 'hidden',
//       '& > *': {
//         visibility: 'hidden',
//       },
//       '& .MuiDialogContent-root': {
//         visibility: 'visible',
//         overflow: 'hidden',
//         padding: '0',
//         margin: '0',
//         '& > *': {
//           visibility: 'visible',
//         },
//       },
//     },
//     table: {
//       pageBreakInside: 'avoid',
//       '-webkit-print-color-adjust': 'exact',
//       'print-color-adjust': 'exact',
//     },
//     'tr': {
//       pageBreakInside: 'avoid',
//       pageBreakAfter: 'auto',
//     },
//     'thead': {
//       display: 'table-header-group',
//     },
//     'tfoot': {
//       display: 'table-footer-group',
//     },
//   },
});

const InvoicePaper = ({ invoiceId }) => {
  const classes = useStyles();
  const [invoiceData, setInvoiceData] = useState({
    items: [{ product_id: '', price: 0.0, quantity: 0, total: 0.00 }],
    // You can include other parts of data as well
});
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [locationData, setLocationData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [productsData, setProductsData] = useState({});
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Fetch invoice data
      await handleFetchRecord(invoiceId, API_ENDPOINTS.GET_INVOICE, setInvoiceData, setInvoiceLoading);
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    } finally {
      setInvoiceLoading(false);
    }
  }, [invoiceId]);

  // First effect to fetch invoice data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Second effect to fetch location and customer data once invoice data is available
  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        // Create an array of promises based on available IDs
        const promises = [];
        
        if (invoiceData.location_id) {
          promises.push(
            handleFetchRecord(invoiceData.location_id, API_ENDPOINTS.GET_LOCATION, setLocationData, setLocationLoading)
          );
        } else {
          setLocationLoading(false); // No location to load
        }

        if (invoiceData.customer_id) {
          promises.push(
            handleFetchRecord(invoiceData.customer_id, API_ENDPOINTS.GET_CUSTOMER, setCustomerData, setCustomerLoading)
          );
        } else {
          setCustomerLoading(false); // No customer to load
        }

        // Execute all promises in parallel if any exist
        if (promises.length > 0) {
          await Promise.all(promises);
        }
      } catch (error) {
        console.error('Error fetching related data:', error);
      } finally {
        // Ensure loading states are set to false even if there's an error
        if (invoiceData.location_id) setLocationLoading(false);
        if (invoiceData.customer_id) setCustomerLoading(false);
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [invoiceData.location_id, invoiceData.customer_id]);

  // Third effect to fetch product data for each item
  useEffect(() => {
    const fetchProductsData = async () => {
      if (invoiceData.items && invoiceData.items.length > 0) {
        try {
          setProductsLoading(true);
          const uniqueProductIds = [...new Set(invoiceData.items.map(item => item.product_id))];
          
          const productPromises = uniqueProductIds.map(productId =>
            handleFetchRecord(productId, API_ENDPOINTS.GET_PRODUCT, 
              (data) => setProductsData(prev => ({ ...prev, [productId]: data })),
              () => {})
          );

          await Promise.all(productPromises);
        } catch (error) {
          console.error('Error fetching products data:', error);
        } finally {
          setProductsLoading(false);
        }
      }
    };

    fetchProductsData();
  }, [invoiceData.items]);

  // Update the loading state to include products loading
  useEffect(() => {
    const allDataLoaded = !invoiceLoading && !locationLoading && !customerLoading && !productsLoading;
    setLoading(!allDataLoaded);
  }, [invoiceLoading, locationLoading, customerLoading, productsLoading]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-paper');
    
    // Calculate the dimensions
    const a4Width = 210; // mm
    const a4Height = 297; // mm
    const pixelsPerMm = 3.78; // Higher DPI for better quality
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: a4Width * pixelsPerMm,
      height: a4Height * pixelsPerMm,
      windowWidth: a4Width * pixelsPerMm,
      windowHeight: a4Height * pixelsPerMm,
      backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    pdf.save(`invoice-${invoiceId}.pdf`);
  };

  const handleOpenPDF = async () => {
    const element = document.getElementById('invoice-paper');
    
    // Calculate the dimensions
    const a4Width = 210; // mm
    const a4Height = 297; // mm
    const pixelsPerMm = 3.78; // Higher DPI for better quality
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: a4Width * pixelsPerMm,
      height: a4Height * pixelsPerMm,
      windowWidth: a4Width * pixelsPerMm,
      windowHeight: a4Height * pixelsPerMm,
      backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
    
    // Open PDF in new tab without downloading
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  return (
    <>
    {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader />
        </div>
    ) : (
    <div className={classes.invoiceWrapper}>
      <div id="invoice-paper" className={classes.invoicePaper}>
        <div className={classes.invoiceContent}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              {/* <div className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#2196f3' }}>
                BILLED FROM
              </div>
              <p style={{ fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '0.9rem' }}>CompanyName, Inc.</p>
              <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                201 Something St., Something Town, YT 242, Country 6546
              </p>
              <div style={{ fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '0.2rem' }}>
                  <b>Tel.: </b>
                  609-876-0996
                </div>
                <div>
                  <b>Email: </b>
                  name@company.com
                </div>
              </div> */}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#2196f3' }}>
                INVOICE NO.
              </div>
              {/* <div style={{ fontSize: '1.5rem', color: '#666' }}>#INV49583</div> */}
              <div style={{ fontSize: '1.5rem', color: '#666' }}>{invoiceData.number}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#2196f3' }}>
                BILLED TO
              </div>
              <p style={{ fontWeight: 'bold', marginBottom: '0.3rem', fontSize: '0.9rem' }}>{customerData.name}</p>
              <p style={{ color: '#666', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                {[
                  locationData.street,
                  locationData.city,
                  locationData.state,
                  locationData.postcode,
                  locationData.country
                ].filter(Boolean).join(', ')}
              </p>
              <div style={{ fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '0.2rem' }}>
                  <b>Tel: </b>
                  {customerData.phone}
                </div>
                <div>
                  <b>Email: </b>
                  {customerData.email}
                </div>
              </div>
            </div>
            <div>
              <div className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#2196f3' }}>
                INVOICE INFORMATION
              </div>
              <div style={{ minWidth: '200px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#666' }}>Invoice Number</span>
                  <span>{invoiceData.number}</span>
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#666' }}>Product ID</span>
                  <span>32456</span>
                </div> */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#666' }}>Issue Date</span>
                  <span>{invoiceData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Due Date</span>
                  <span>{invoiceData.due_date}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive" style={{ margin: '1.5rem 0' }}>
            <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th className="text-primary" style={{ padding: '0.5rem', textAlign: 'left', width: '40%', fontSize: '0.75rem', color: '#2196f3', fontWeight: 'bold' }}>PRODUCT</th>
                  <th className="text-primary" style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#2196f3', fontWeight: 'bold' }}>QTY</th>
                  <th className="text-primary" style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.75rem', color: '#2196f3', fontWeight: 'bold' }}>UNIT PRICE</th>
                  <th className="text-primary" style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.75rem', color: '#2196f3', fontWeight: 'bold' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                      {productsData[item.product_id]?.name || 'Loading...'}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>{item.quantity}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>{item.price}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>{item.total}</td>
                  </tr>
                ))}
                {/* <tr>
                  <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>Photoshop design</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>1</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>$1,200.00</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>$1,200.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>Server configuration</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>2</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>$850.00</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>$1,700.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>Build mobile app</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>3</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>$850.00</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.85rem' }}>$2,550.00</td>
                </tr> */}
              </tbody>
            </Table>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            {/* <Grid container spacing={4}>
              <Grid item lg={8}>
                {invoiceData.note && (
                  <div style={{ backgroundColor: '#f8f9fa', padding: '0.75rem', borderRadius: '4px' }}>
                    <div className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#2196f3' }}>
                      NOTES
                    </div>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      {invoiceData.note}
                    </p>
                  </div>
                )}
              </Grid>
              <Grid item lg={4}>
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontWeight: 'bold', fontSize: '1rem' }}>
                    <span>Total Due</span>
                    <span>{invoiceData.currency} {invoiceData.total}</span>
                  </div>
                </div>
              </Grid>
            </Grid> */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: '0 0 60%' }}>
                {invoiceData.note && (
                  <div style={{ backgroundColor: '#f8f9fa', padding: '0.75rem', borderRadius: '4px' }}>
                    <div className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.3rem', color: '#2196f3' }}>
                      NOTES
                    </div>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      {invoiceData.note}
                    </p>
                  </div>
                )}
              </div>
              <div style={{ flex: '0 0 35%' }}>
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontWeight: 'bold', fontSize: '1rem' }}>
                    <span>Total Due</span>
                    <span>{invoiceData.currency} {invoiceData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.downloadButton}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          style={{ marginRight: '10px' }}
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenPDF}
          style={{ marginRight: '10px' }}
        >
          View PDF
        </Button>
        {/* <Button
          variant="contained"
          color="secondary"
          onClick={handlePrint}
        >
          Print
        </Button> */}
      </div>
    </div>
    )}
    </>
  );
};

export default InvoicePaper;