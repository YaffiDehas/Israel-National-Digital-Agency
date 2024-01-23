import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Table, Form, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ActionsColumnMenu from './ActionsColumnMenu';
import Expander from './Expander';
import ShowMore from './ShowMore';
import Search from './Search';
import './Style.css'; // Import a separate CSS file for styling

const InfiniteScrollTable = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterValues, setFilterValues] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleRows, setVisibleRows] = useState(5); // Number of initially visible rows
  const [totalRows] = useState(20); // Total number of rows
  const [selectedRow, setSelectedRow] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && visibleRows < totalRows) {
            // Load more rows when the last row becomes visible
            setLoading(true);
            setTimeout(() => {
              // Simulate data fetching delay
              setVisibleRows((prevVisibleRows) => Math.min(prevVisibleRows + 10, totalRows));
              setLoading(false);
            }, 1000);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      // Cleanup the observer
      observer.disconnect();
    };
  }, [visibleRows, totalRows, loading]);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[entries.length - 1];
        if (lastEntry.isIntersecting && hasMore) {
          setVisibleItems((prevVisibleItems) => Math.min(prevVisibleItems + 10, data.length));
        }
      },
      { threshold: 1 }
    )
  );

  const lastRowRef = useCallback(
    (node) => {
      if (node !== null) {
        observer.current.observe(node);
      }
    },
    [observer]
  );

  const handleCheckboxChange = (id) => {
    const updatedSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(updatedSelectedRows);
  };

  const handleSort = (column) => {
    setSortColumn(column);
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const handleFilterChange = (column, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [column]: value }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const filteredAndSortedData = useMemo(() => {
    let filteredData = data.slice(0, visibleItems).filter((item) =>
      Object.entries(filterValues).every(([col, filterValue]) =>
        filterValue ? String(item[col]).includes(filterValue) : true
      )
    );

    filteredData = filteredData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortColumn) {
      filteredData.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const order = sortDirection === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * order;
        } else {
          return (aValue - bValue) * order;
        }
      });
    }

    return filteredData;
  }, [data, visibleItems, filterValues, sortColumn, sortDirection, searchTerm]);



  const handleRowClick = (rowId) => {
    setSelectedRow(rowId);
  };

  const handleActionMenuClick = (action) => {
    // Handle the selected action for the specific row (selectedRow)
    console.log(`Performing ${action} action for row with ID}`);
  };

  const handleShowMore = () => {
    // Increase the number of visible rows when 'Show More' is clicked
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
  };
  const toggleExpander = (id) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id]
    );
  };

  return (
    <div className="infinite-scroll-table-container">
      <div className="table-scroll" ref={tableRef}>
        <Table striped bordered hover>
          <thead className="sticky-top">
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  label=""
                  checked={selectedRows.length === visibleItems}
                  onChange={() => handleCheckboxChange('selectAll')}
                />
              </th>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('name')}>Name</th>
              {/* ... other table headers ... */}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.slice(0, visibleRows).map((item, index) => {
              if (index === visibleItems - 1) {
                return (
                  <tr key={item.id} ref={lastRowRef} onClick={() => handleRowClick(item.id)}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        label=""
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <Link to={item.drillLink}>{item.id}</Link>
                    </td>
                    {/* ... other table cells ... */}
                  </tr>
                );
              } else {
                return (
                  <>
                    <tr key={item.id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          label=""
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        <ActionsColumnMenu onMenuItemClick={handleActionMenuClick} />
                      </td>
                      <td>
                        <Expander
                          onExpand={() => toggleExpander(item.id)}
                          expanded={expandedRows.includes(item.id)}
                        />
                      </td>
                    </tr>
                    {expandedRows.includes(item.id) && (
                      <tr>
                        <td colSpan={5}>
                          {/* Additional content for the expanded row */}
                          {item.additionalContent}
                        </td>
                      </tr>
                    )}
                  </>
                );
              }
            })}
          </tbody>
          {loading && (
            <tfoot>
              <tr>
                <td colSpan={4}>Loading more...</td>
              </tr>
            </tfoot>
          )}
        </Table>

      </div>
      {/* Preview Pane (Details) */}
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {selectedRow !== null && (
          <div>
            <h3>Details for Row {selectedRow}:</h3>
            <p>{data.find((item) => item.id === selectedRow)?.details}</p>
          </div>
        )}
      </div>
      <Search
        data={data}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handleSort={handleSort}
        searchTerm={searchTerm}
        filterValues={filterValues}
        sortDirection={sortDirection}
        sortColumn={sortColumn}
      />

      {visibleRows < totalRows &&
        <ShowMore handleShowMore={handleShowMore} />}
    </div>
  );
};

export default InfiniteScrollTable;
