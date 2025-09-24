import React from 'react';
import EnhancedReveal from './EnhancedReveal';

const RevealModule = () => (
  <div
    style={{
      background: 'rgba(188, 161, 88, 0.2)', /* Aged brass with transparency */
      borderRadius: '15px',
      border: '2px solid #bca158', /* Aged brass border */
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <EnhancedReveal />
  </div>
);

export default RevealModule;
