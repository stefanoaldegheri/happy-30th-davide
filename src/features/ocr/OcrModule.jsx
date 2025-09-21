import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import './OcrModule.css';

const OcrModule = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  // The expected text from the PRD
  const expectedText = `A NEW DECADE AWAITS AHEAD BE BOLD AND READY
YOUR FUTURE IS CODE TO WRITE AND NEVER DEBUG
LIFE IS A NEW CHALLENGE NOW ACCEPT THE QUEST
SO DIVE INTO THE NEXT VERSION OF YOUR STORY
AND DEBUG EVERY SINGLE ERROR ON YOUR JOURNEY
STARTING THIS NEW CHAPTER IS HIGHLY EXCITING
ERRORS ARE JUST A GREAT START TO A NEW SCRIPT
YOU ARE THE MASTER OF YOUR WAY SO JUST ENJOY`;
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera. Please ensure you have given permission.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL and set as captured image
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      
      // Stop the camera
      stopCamera();
    }
  };
  
  const processImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    
    try {
      const worker = await createWorker({
        logger: m => console.log(m),
      });
      
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const {
        data: { text },
      } = await worker.recognize(capturedImage);
      
      // Clean the text (remove extra spaces and normalize line breaks)
      const cleanedText = text
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      setOcrResult(cleanedText);
      
      // Check if the text matches the expected text
      if (cleanedText === expectedText) {
        setIsValid(true);
      }
      
      await worker.terminate();
    } catch (error) {
      console.error('OCR processing error:', error);
      alert('Error processing the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleContinue = () => {
    navigate('/reveal');
  };
  
  const restart = () => {
    setCapturedImage(null);
    setOcrResult('');
    setIsValid(false);
    startCamera();
  };
  
  return (
    <div className="ocr-container">
      <div className="ocr-card">
        <h1 className="ocr-title">Text Recognition Challenge</h1>
        <p className="ocr-instructions">
          Point your camera at the block of text in your book and capture it.
        </p>
        
        {!isCameraActive && !capturedImage && (
          <div className="camera-setup">
            <button className="action-button" onClick={startCamera}>
              Start Camera
            </button>
          </div>
        )}
        
        {isCameraActive && (
          <div className="camera-view">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-feed"
            />
            <button className="capture-button" onClick={captureImage}>
              Capture
            </button>
            <button className="stop-button" onClick={stopCamera}>
              Stop Camera
            </button>
          </div>
        )}
        
        {capturedImage && (
          <div className="image-preview">
            <h3>Captured Image:</h3>
            <img src={capturedImage} alt="Captured" className="captured-image" />
            <div className="ocr-actions">
              <button 
                className="action-button" 
                onClick={processImage} 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Process Image'}
              </button>
              <button className="secondary-button" onClick={restart}>
                Retake Photo
              </button>
            </div>
          </div>
        )}
        
        {ocrResult && (
          <div className="ocr-result">
            <h3>Recognized Text:</h3>
            <pre className="recognized-text">{ocrResult}</pre>
            {isValid ? (
              <div className="validation-success">
                <p className="success-message">Text validated successfully!</p>
                <button className="continue-button" onClick={handleContinue}>
                  Reveal the Secret
                </button>
              </div>
            ) : (
              <div className="validation-error">
                <p className="error-message">
                  Text does not match. Please try again with a clearer image.
                </p>
                <button className="secondary-button" onClick={restart}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default OcrModule;