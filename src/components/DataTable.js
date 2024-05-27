import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const DataTable = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ curr_inv: 10000, curr_cash: 40000 });

  const combineDateTime = (date, time) => {
    const [day, month, year] = date.split('-');
    return new Date(`${year}-${month}-${day}T${time}`);
  };

  const fetchData = () => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        console.log(response.data)
        const new_data = [...response.data];

        // Sorting the data based on createdAt field
        new_data.sort((a, b) => combineDateTime(b.date, b.time) - combineDateTime(a.date, a.time));

        console.log(new_data.curr_cash)
        console.log(new_data.dp)
        setStats({ curr_inv: new_data[0].inventory, curr_cash: new_data[0].cashinhand })
        setData(new_data)
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000); // Fetch data every 4 seconds

    // const ws = new WebSocket('ws://localhost:5000');

    // ws.onopen = () => {
    //   console.log('WebSocket connection established');
    // };

    // ws.onmessage = (event) => {
    //   const newEntry = JSON.parse(event.data);
    //   setData(prevData => [...prevData, newEntry]);
    // };

    // ws.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    // };

    // ws.onclose = () => {
    //   console.log('WebSocket connection closed');
    // };

    return () => {
      clearInterval(interval);
      // ws.close();
    };
  }, []);

  return (
    <div className="table-container">
      <h2>All Data Entries</h2>
      <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px', 
      backgroundColor: '#f9f9f9', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      margin: '20px',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2 style={{ 
        color: '#333', 
        fontSize: '24px', 
        margin: 0 
      }}>Current Inventory: <span style={{ color: '#007BFF' }}>{stats.curr_inv}</span></h2>
      <h2 style={{ 
        color: '#333', 
        fontSize: '24px', 
        margin: 0 
      }}>Current Cash in hand: <span style={{ color: '#28A745' }}>{stats.curr_cash}</span></h2>
    </div>
    <style>
        {`
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 16px;
            font-family: 'Arial, sans-serif';
          }

          .table thead tr {
            background-color: #009879;
            color: #ffffff;
            text-align: left;
            font-weight: bold;
          }

          .table th,
          .table td {
            padding: 12px 15px;
          }

          .table tbody tr {
            border-bottom: 1px solid #dddddd;
          }

          .table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
          }

          .table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }

          .table tbody tr:hover {
            background-color: #f1f1f1;
            cursor: pointer;
          }
        `}
      </style>

      <table className="table">
        <thead>
          <tr>
            <th>Transaction No.</th>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>CID</th>
            <th>Cash Status</th>
            <th>Due Status</th>
            <th>Inventory</th>
            <th>Cash in Hand</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => (
            <tr key={entry._id}>
              <td>{entry.tno}</td>
              <td>{entry.date}</td>
              <td>{entry.time}</td>
              <td>{entry.amount}</td>
              <td>{entry.cid}</td>
              <td>{entry.cash_status}</td>
              <td>{entry.dp}</td>
              <td>{entry.inventory}</td>
              <td>{entry.cashinhand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
