import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="table-container">
      <h2>All Data Entries</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>CID</th>
            <th>Inventory</th>
            <th>Cash in Hand</th>
          </tr>
        </thead>
        <tbody>
          {data.map(entry => (
            <tr key={entry._id}>
              <td>{entry.date}</td>
              <td>{entry.time}</td>
              <td>{entry.amount}</td>
              <td>{entry.cid}</td>
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
