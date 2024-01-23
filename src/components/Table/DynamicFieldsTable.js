import React, { useState } from 'react';

const DynamicfieldsTable = () => {
  const [visibleFields, setVisibleFields] = useState(['id', 'name', 'age', 'city']);
  const [expandedRow, setExpandedRow] = useState(null);

  // Sample data
  const data = [
    { id: 1, name: 'John Doe', age: 25, city: 'New York', details: 'Additional details for John Doe...' },
    { id: 2, name: 'Jane Smith', age: 30, city: 'San Francisco', details: 'Additional details for Jane Smith...' },
    // Add more rows as needed
  ];

  const toggleExpandRow = (rowId) => {
    setExpandedRow((prevRow) => (prevRow === rowId ? null : rowId));
  };

  const handleFieldToggle = (field) => {
    setVisibleFields((prevFields) =>
      prevFields.includes(field) ? prevFields.filter((f) => f !== field) : [...prevFields, field]
    );
  };

  return (
    <div>
      {/* Field Chooser Panel */}
      <div style={{ marginBottom: '10px' }}>
        <strong>Field Chooser:</strong>
        {['id', 'name', 'age', 'city'].map((field) => (
          <label key={field} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={visibleFields.includes(field)}
              onChange={() => handleFieldToggle(field)}
            />
            {field}
          </label>
        ))}
      </div>

      {/* Table with Dynamic Fields */}
      <table style={{ overflowX: 'auto' }}>
        <thead>
          <tr>
            {visibleFields.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <tr onClick={() => toggleExpandRow(item.id)}>
                {visibleFields.map((field) => (
                  <td key={field}>{item[field]}</td>
                ))}
              </tr>
              {expandedRow === item.id && (
                <tr>
                  <td colSpan={visibleFields.length}>{item.details}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicfieldsTable;
