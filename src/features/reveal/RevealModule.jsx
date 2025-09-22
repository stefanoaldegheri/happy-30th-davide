import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnhancedReveal from './EnhancedReveal';

const RevealModule = () => {
  const navigate = useNavigate();
  
  // For now, we'll use the enhanced reveal component
  // In the future, we can add more logic here if needed
  return <EnhancedReveal />;
};

export default RevealModule;