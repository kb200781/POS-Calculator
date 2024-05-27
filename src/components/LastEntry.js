import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LastEntry = () => {
  const [lastEntry, setLastEntry] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/lastEntry')
      .then(response => setLastEntry(response.data))
      .catch(error => console.error('Error fetching last entry:', error));
  }, []);

  return (
    <div className="last-entry">
      <h2>Last Entry</h2>
      {lastEntry ? (
        <table className="table table-striped">
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
            <tr>
              <td>{lastEntry.date}</td>
              <td>{lastEntry.time}</td>
              <td>{lastEntry.amount}</td>
              <td>{lastEntry.cid}</td>
              <td>{lastEntry.inventory}</td>
              <td>{lastEntry.cashinhand}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No entry found.</p>
      )}
    </div>
  );
};

export default LastEntry;
