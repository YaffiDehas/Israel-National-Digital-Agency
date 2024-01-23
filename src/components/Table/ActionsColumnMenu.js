import React, { useState } from 'react';
import { Table, Dropdown, ButtonGroup } from 'react-bootstrap';

const ActionsColumnMenu = ({ onMenuItemClick }) => {
  const handleItemClick = (action) => {
    onMenuItemClick(action);
  };

  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle variant="secondary" id="dropdown-actions">
        Actions
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleItemClick('edit')}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => handleItemClick('delete')}>Delete</Dropdown.Item>
        {/* Add more actions as needed */}
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default ActionsColumnMenu;