import React, { useState, useEffect } from 'react';

const SessionStorageTest = () => {
  const [ocrResult, setOcrResult] = useState('');
  const [storedValue, setStoredValue] = useState('');

  // Test storing a value
  const storeValue = () => {
    const testValue = 'This is a test OCR result';
    sessionStorage.setItem('ocrResult', testValue);
    setOcrResult(testValue);
  };

  // Test retrieving a value
  const retrieveValue = () => {
    const value = sessionStorage.getItem('ocrResult');
    setStoredValue(value || 'No value found');
  };

  // Test clearing storage
  const clearStorage = () => {
    sessionStorage.removeItem('ocrResult');
    setStoredValue('');
    setOcrResult('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Session Storage Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Store Test Value</h2>
        <button onClick={storeValue}>Store Test OCR Result</button>
        <p>Current value in state: {ocrResult}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Retrieve Test Value</h2>
        <button onClick={retrieveValue}>Retrieve OCR Result</button>
        <p>Retrieved value: {storedValue}</p>
      </div>
      
      <div>
        <h2>Clear Storage</h2>
        <button onClick={clearStorage}>Clear OCR Result</button>
      </div>
    </div>
  );
};

export default SessionStorageTest;