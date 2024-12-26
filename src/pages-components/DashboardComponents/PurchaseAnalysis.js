import React, { useState, useEffect } from 'react';
import { Card, FormControl, MenuItem, Select, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chart from 'react-apexcharts';
import apiClient from '../../config/apiClient';
import { API_ENDPOINTS } from '../../config/apis';
import Loader from '../Loader';

const PurchaseAnalysis = () => {
  const [timePeriod, setTimePeriod] = useState('current-month');
  const [purchaseData, setPurchaseData] = useState({
    completed_total: 0,
    pending_total: 0,
    completed_orders: [],
    pending_orders: []
  });
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
            customIcons: []
          },
          export: {
            csv: {
              filename: 'purchase-analysis',
              columnDelimiter: ',',
              headerCategory: 'Date',
              headerValue: 'Value'
            },
            svg: {
              filename: 'purchase-analysis'
            },
            png: {
              filename: 'purchase-analysis'
            }
          }
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true
        }
      },
      colors: ['#1bc943', '#f4772e'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          format: 'yyyy-MM-dd'
        }
      },
      yaxis: {
        title: {
          text: 'Purchase Amount ($)'
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
      const response = await apiClient.get(
        timePeriod === 'current-month'
          ? API_ENDPOINTS.GET_PURCHASE_CURRENT_MONTH()
          : API_ENDPOINTS.GET_PURCHASE_30_DAYS()
      );

      const data = response.data || {
        completed_total: 0,
        pending_total: 0,
        completed_orders: [],
        pending_orders: []
      };
      setPurchaseData(data);

      // Get all unique dates from both completed and pending orders
      const allDates = [...new Set([
        ...(data.completed_orders || []).map(item => new Date(item.completed_at).getTime()),
        ...(data.pending_orders || []).map(item => new Date(item.created_at).getTime())
      ])].sort();

      // Initialize data objects
      const completedByDate = {};
      const pendingByDate = {};
      
      allDates.forEach(date => {
        completedByDate[date] = 0;
        pendingByDate[date] = 0;
      });

      // Map completed orders
      if (data.completed_orders && data.completed_orders.length > 0) {
        data.completed_orders.forEach(item => {
          const timestamp = new Date(item.completed_at).getTime();
          completedByDate[timestamp] = item.total;
        });
      }

      // Map pending orders
      if (data.pending_orders && data.pending_orders.length > 0) {
        data.pending_orders.forEach(item => {
          const timestamp = new Date(item.created_at).getTime();
          pendingByDate[timestamp] = item.total;
        });
      }

      setChartData(prev => ({
        ...prev,
        series: [
          {
            name: 'Completed Orders',
            type: 'line',
            data: allDates.map(date => ({
              x: date,
              y: completedByDate[date]
            }))
          },
          {
            name: 'Pending Orders',
            type: 'line',
            data: allDates.map(date => ({
              x: date,
              y: pendingByDate[date]
            }))
          }
        ]
      }));

    } catch (error) {
      console.error('Error fetching purchase data:', error);
      setChartData(prev => ({
        ...prev,
        series: [
          { name: 'Completed Orders', type: 'line', data: [] },
          { name: 'Pending Orders', type: 'line', data: [] }
        ]
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
                Purchase Analysis
              </h6>
              <p className="text-black-50 font-size-sm mb-0">
                Completed: ${purchaseData.completed_total?.toFixed(2)} | Pending: ${purchaseData.pending_total?.toFixed(2)}
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

  if (!purchaseData.completed_orders?.length && !purchaseData.pending_orders?.length) {
    return (
      <Card className="card-box mb-spacing-6-x2">
        <div className="p-4">
          <div className="p-2 d-flex justify-content-between align-items-center">
            <div>
              <h6 className="font-weight-bold font-size-xl mb-1 text-black">
                Purchase Analysis
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
              Purchase Analysis
            </h6>
            <p className="text-black-50 font-size-sm mb-0">
              Completed: ${purchaseData.completed_total?.toFixed(2)} | Pending: ${purchaseData.pending_total?.toFixed(2)}
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
          type="line"
          height={350}
        />
      </div>
    </Card>
  );
}

export default PurchaseAnalysis;