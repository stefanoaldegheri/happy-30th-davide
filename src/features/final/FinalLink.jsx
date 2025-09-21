import React from 'react';
import './FinalLink.css';

const FinalLink = () => {
  // The final gift URL (to be replaced with actual URL)
  const finalGiftUrl = 'https://davidesthirty.github.io/regalo-segreto/';
  
  return (
    <div className="final-container">
      <div className="final-card">
        <h1 className="final-title">Congratulations!</h1>
        <p className="final-message">
          You've successfully completed all the challenges and revealed the secret message.
        </p>
        <p className="final-message">
          Your journey has led you to this special gift created just for you.
        </p>
        
        <div className="gift-link-container">
          <a 
            href={finalGiftUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="gift-link"
          >
            davidesthirty
          </a>
        </div>
        
        <p className="final-instructions">
          Click the link above to access your personalized gift.
        </p>
      </div>
    </div>
  );
};

export default FinalLink;