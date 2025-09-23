import React from 'react';
import './TreasureBoxBorder.css';

const TreasureBoxBorder = ({ children }) => {
  // Create 9 positions for treasure boxes (3x3 grid)
  const positions = [
    { id: 'top-left', className: 'treasure-box top-left' },
    { id: 'top-center', className: 'treasure-box top-center' },
    { id: 'top-right', className: 'treasure-box top-right' },
    { id: 'middle-left', className: 'treasure-box middle-left' },
    { id: 'middle-right', className: 'treasure-box middle-right' },
    { id: 'bottom-left', className: 'treasure-box bottom-left' },
    { id: 'bottom-center', className: 'treasure-box bottom-center' },
    { id: 'bottom-right', className: 'treasure-box bottom-right' }
  ];

  return (
    <div className="treasure-box-border">
      {positions.map((position) => (
        <img
          key={position.id}
          src="/images/treasure_box_256.png"
          alt="Treasure Box"
          className={position.className}
        />
      ))}
      <div className="treasure-box-content">
        {children}
      </div>
    </div>
  );
};

export default TreasureBoxBorder;