import React, { useState, useMemo } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Search from './Search';

const PaginatedTable = ({ data, itemsPerPage }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterValues, setFilterValues] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
    let filteredData = data.filter((item) =>
      Object.entries(filterValues).every(([col, filterValue]) =>
        filterValue ? String(item[col]).includes(filterValue) : true
      )
    );

    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

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
  }, [data, filterValues, sortColumn, sortDirection, searchTerm]);
  
  const handleRowClick = (id) => {
    // Handle single-click action (if needed)
    console.log(`Single-click on row with ID ${id}`);
  };

  const handleRowDoubleClick = (id) => {
    // Handle double-click action (drill)
    console.log(`Double-click on row with ID ${id}`);
    // Navigate to the drill page
    // You can use react-router-dom's history or Link component here
  };
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = filteredAndSortedData.slice(startIdx, endIdx);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                label=""
                checked={selectedRows.length === currentItems.length}
                onChange={() => handleCheckboxChange('selectAll')}
              />
            </th>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            {/* ... other table headers ... */}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
          <tr key={item.id} onClick={() => handleRowClick(item.id)} onDoubleClick={() => handleRowDoubleClick(item.id)}>
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
                <Link to={item.drillLink} style={{ textDecoration: 'none' }}>{item.id}</Link>
              </td>
              {/* ... other table cells ... */}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Row className="justify-content-center">
        <Col md="auto">
          <Button
            variant="outline-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>{' '}
          Page {currentPage} of {totalPages}{' '}
          <Button
            variant="outline-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Col>
      </Row>
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
    </div>
  );
};

export default PaginatedTable;
