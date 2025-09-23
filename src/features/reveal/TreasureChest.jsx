import React from 'react';
import './TreasureChest.css';

const TreasureChest = ({ position, isOpen, onOpenComplete }) => {
  return (
    <div className={`treasure-chest-container treasure-chest-${position} ${isOpen ? 'open' : 'closed'}`}>
      {isOpen && (
        <img 
          src="/images/treasure_box_256.png" 
          alt="Treasure Chest" 
          className="treasure-chest-image"
        />
      )}
    </div>
  );
};

export default TreasureChest;