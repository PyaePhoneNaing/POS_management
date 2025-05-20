import React from 'react';

export default function DateFilter({ filterDate, setFilterDate }) {
  return (
    <label style={{ fontWeight: 500 }}>
      Date:
      <input
        type="date"
        value={filterDate}
        onChange={e => setFilterDate(e.target.value)}
        style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: 6 }}
      />
    </label>
  );
}
