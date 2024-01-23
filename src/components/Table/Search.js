import React from 'react';
import {Form, Row, Col } from 'react-bootstrap';

const Search = ({data, handleSearchChange, handleFilterChange, handleSort, filterValues, searchTerm, sortDirection, sortColumn}) => {

    const filterChange = (column, value) => {
        handleFilterChange(column, value)
      };
    
      const searchChange = (value) => {
        handleSearchChange(value);
      };

    const sortByCol = (column) =>{
        handleSort(column)
    }

  return (
   <div>
    {/* Search Bar */}
    <Row className="mt-3">
        <Col>
          <Form.Group controlId="search">
            <Form.Label>Search:</Form.Label>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={(e) => searchChange(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Filter Dropdowns */}
      <Row className="mb-3">
        {Object.keys(data[0]).map((column) => (
          <Col key={column}>
            <Form.Group controlId={`filter-${column}`}>
              <Form.Label>{column}:</Form.Label>
              <Form.Control
                as="select"
                value={filterValues[column] || ''}
                onChange={(e) => filterChange(column, e.target.value)}
              >
                <option value="">All</option>
                {Array.from(new Set(data.map((item) => item[column]))).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        ))}
      </Row>

       {/* Sort Indicator */}
       <Row className="mb-3">
        <Col>
          <div>
            <span className="mr-2">Sort by:</span>
            {Object.keys(data[0]).map((column) => (
              <span
                key={column}
                className="cursor-pointer"
                onClick={() => sortByCol(column)}
              >
                {column}{' '}
                {sortColumn === column && (sortDirection === 'asc' ? '▲' : '▼')}
              </span>
            ))}
          </div>
        </Col>
      </Row>

   </div>
  );
}

export default Search;
