import React, { useState, useEffect } from 'react';
import { Card, FormControl, MenuItem, Select, Button, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chart from 'react-apexcharts';
import apiClient from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/apis';
import Loader from '../Loader';

const SalesCompletedAnalysis = () => {
  const [timePeriod, setTimePeriod] = useState('current-month');
  const [salesData, setSalesData] = useState({ total_amount: 0, sales: [] });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    options: {
      stroke: {
        curve: 'smooth',
        width: 3
      },
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: [
              {
                icon: '<i class="fas fa-sync" style="color: #666;"></i>',
                index: 0,
                title: 'Refresh Data',
                class: 'custom-icon',
                click: function(chart, options) {
                  fetchData();
                }
              }
            ]
          },
          export: {
            csv: {
              filename: 'sales-analysis-csv',
              columnDelimiter: ',',
              headerCategory: 'Date',
              headerValue: 'Value'
            },
            svg: {
              filename: 'sales-analysis-svg'
            },
            png: {
              filename: 'sales-analysis-png'
            }
          }
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true
        }
      },
      colors: ['#1bc943'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#1bc943',
              opacity: 0.7
            },
            {
              offset: 100,
              color: '#1bc943',
              opacity: 0.3
            }
          ]
        }
      },
      labels: [],
      xaxis: {
        type: 'datetime',
        // title: {
        //     offsetY: 5,  // Add margin to the x-axis title
        //   text: 'Date'
        // }
      },
      yaxis: {
        title: {
          text: 'Sales Amount ($)'
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        strokeDashArray: '5',
        borderColor: 'rgba(125, 138, 156, 0.3)'
      },
      legend: {
        show: true
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return `$${value.toFixed(2)}`;
          }
        }
      }
    },
    series: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
    //   const response = await apiClient.get(
    //     timePeriod === 'current-month' 
    //       ? API_ENDPOINTS.GET_SALES_CURRENT_MONTH() 
    //       : API_ENDPOINTS.GET_SALES_30_DAYS()
    //   );

      const response = await Promise.all([
        apiClient.get(timePeriod === 'current-month' ? API_ENDPOINTS.GET_SALES_CURRENT_MONTH() : API_ENDPOINTS.GET_SALES_30_DAYS())
      ]);

      console.log(response);

      const sales = response[0].data || { total_amount: 0, sales: [] };
      setSalesData(sales);

      // Process data for chart
      const dates = [...new Set(
        (sales.sales || []).map(item => new Date(item.completed_at).getTime())
      )].sort();

      const salesByDate = {};
      
      dates.forEach(date => {
        salesByDate[date] = 0;
      });

      if (sales.sales && sales.sales.length > 0) {
        sales.sales.forEach(item => {
          const timestamp = new Date(item.completed_at).getTime();
          salesByDate[timestamp] = item.total;
        });
      }

      setChartData(prev => ({
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            type: 'datetime',
            labels: {
              datetimeUTC: false,
              format: 'yyyy-MM-dd'
            }
          }
        },
        series: [
          {
            name: 'Sales',
            type: 'area',
            data: dates.map(date => ({
              x: date,
              y: salesByDate[date]
            }))
          }
        ]
      }));

    } catch (error) {
      console.error('Error fetching sales data:', error);
      setChartData(prev => ({
        ...prev,
        series: [{ name: 'Sales', type: 'area', data: [] }]
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod]);

  if (loading) {
    return (
      <Card className="card-box mb-spacing-6-x2">
        <div className="p-4">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                Sales Analysis
              </h6>
              <p className="text-black-50 font-size-sm mb-0">
                Total Sales: ${salesData.total_amount?.toFixed(2)}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
                <Select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="text-sm">
                  <MenuItem value="current-month">Current Month</MenuItem>
                  <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                variant="contained"
                disabled={true}
                style={{ minWidth: '40px', padding: '6px' }}>
                <FontAwesomeIcon
                  icon={['fas', 'sync']}
                  spin={true}
                  className="font-size-sm"
                />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div style={{ height: '350px' }} className="d-flex align-items-center justify-content-center">
          <Loader />
        </div>
      </Card>
    );
  }

  if (!salesData.sales || salesData.sales.length === 0) {
    return (
      <Card className="card-box mb-spacing-6-x2">
        <div className="p-4">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                Sales Analysis
              </h6>
            </div>
            <div className="d-flex align-items-center">
              <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
                <Select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="text-sm">
                  <MenuItem value="current-month">Current Month</MenuItem>
                  <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                variant="contained"
                onClick={fetchData}
                disabled={loading}
                style={{ minWidth: '40px', padding: '6px' }}>
                <FontAwesomeIcon
                  icon={['fas', 'sync']}
                  spin={loading}
                  className="font-size-sm"
                />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div style={{ height: '350px' }} className="d-flex align-items-center justify-content-center">
          <div className="text-muted">No data available</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-box mb-spacing-6-x2">
      <div className="p-4">
        <div className="p-2 d-flex justify-content-between align-items-center">
          <div>
            <h6 className="font-weight-bold font-size-xl mb-1 text-black">
              Sales Analysis
            </h6>
            <p className="text-black-50 font-size-sm mb-0">
              Total Sales: ${salesData.total_amount?.toFixed(2)}
            </p>
          </div>
          <div className="d-flex align-items-center">
            <FormControl variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
              <Select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="text-sm">
                <MenuItem value="current-month">Current Month</MenuItem>
                <MenuItem value="last-30-days">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              variant="contained"
              onClick={fetchData}
              disabled={loading}
              style={{ minWidth: '40px', padding: '6px' }}>
              <FontAwesomeIcon
                icon={['fas', 'sync']}
                spin={loading}
                className="font-size-sm"
              />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="divider" />
      <div style={{ height: '350px' }}>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      </div>
    </Card>
  );
}

export default SalesCompletedAnalysis;