import React from 'react';

const ShowMore = ({ handleShowMore }) => {
     const onClick = () => {
        handleShowMore();
     }
  return (
        <tfoot>
          <tr>
            <td colSpan={4}>
              <button className="show-more-btn" onClick={onClick}>
                Show More
              </button>
            </td>
          </tr>
        </tfoot>
  );
};

export default ShowMore;
