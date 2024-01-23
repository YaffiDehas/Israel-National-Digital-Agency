import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProgressBar from './components/ProgressBar/ProgressBar';
import PaginatedTable from './components/Table/PaginatedTable';
import InfiniteScrollTable from './components/Table/InfiniteScrollTable';
import DynamicfieldsTable from './components/Table/DynamicFieldsTable';
import { mockData } from './data';
import './App.css';

function App() {
  const [progress, setProgress] = useState(80); // Adjust the state to set the value in progress
  const itemsPerPage = 5; // Adjust the number of items per page as needed

  return (
    <div className="App">

      <header>
        <h1>UI - Components</h1>
      </header>

      <main>
        {/* <PaginatedTable data={mockData} itemsPerPage={itemsPerPage} /> */}
        <InfiniteScrollTable data={mockData} />
        {/* <ProgressBar percentage={progress} /> */}
      </main>
      <Routes>
        <Route path="/InfiniteScrollTable" exact element={<InfiniteScrollTable />} />
        <Route path="/PaginatedTable" element={<PaginatedTable />} />
        <Route path="/DynamicfieldsTable" element={<DynamicfieldsTable />} />
      </Routes>
    </div>
  );
}

export default App;
