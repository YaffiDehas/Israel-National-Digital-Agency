import React from 'react';

const Expander = ({ onExpand, expanded }) => {
  return (
    <button className="expander-btn" onClick={onExpand}>
      {expanded ? '-' : '+'}
    </button>
  );
};

export default Expander;
