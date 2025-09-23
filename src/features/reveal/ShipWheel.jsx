import React, { useState, useRef, useEffect } from 'react';
import './ShipWheel.css';

const ShipWheel = ({ onRotationChange, targetAngle }) => {
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isTargetReached, setIsTargetReached] = useState(false);
  
  // Normalize angle to 0-360 range
  const normalizeAngle = (angle) => {
    return ((angle % 360) + 360) % 360;
  };
  
  // Check if target angle is reached (within 5 degrees)
  const checkTargetReached = (angle) => {
    const normalizedAngle = normalizeAngle(angle);
    const normalizedTarget = normalizeAngle(targetAngle);
    
    // Check if we're close to the target angle (within 5 degrees)
    const reached = Math.abs(normalizedAngle - normalizedTarget) < 5 || 
                   Math.abs(normalizedAngle - (normalizedTarget + 360)) < 5 ||
                   Math.abs(normalizedAngle - (normalizedTarget - 360)) < 5;
    
    setIsTargetReached(reached);
    return reached;
  };
  
  // Handle mouse down on wheel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Handle touch start on wheel
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };
  
  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!isDragging || !wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to current position
    const currentAngleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let currentAngleDeg = currentAngleRad * 180 / Math.PI;
    
    // Adjust angle to be from 0 to 360
    currentAngleDeg = (currentAngleDeg + 90 + 360) % 360;
    
    setCurrentAngle(currentAngleDeg);
    
    // Update last position
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isDragging || !wheelRef.current) return;
    
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to current position
    const currentAngleRad = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    let currentAngleDeg = currentAngleRad * 180 / Math.PI;
    
    // Adjust angle to be from 0 to 360
    currentAngleDeg = (currentAngleDeg + 90 + 360) % 360;
    
    setCurrentAngle(currentAngleDeg);
    
    // Update last position
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging) {
      // Check if target is reached when mouse is released
      if (checkTargetReached(currentAngle)) {
        onRotationChange && onRotationChange(targetAngle);
      }
    }
    setIsDragging(false);
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (isDragging) {
      // Check if target is reached when touch is released
      if (checkTargetReached(currentAngle)) {
        onRotationChange && onRotationChange(targetAngle);
      }
    }
    setIsDragging(false);
  };
  
  // Add event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, lastPosition, rotation, currentAngle, targetAngle]);
  
  // Get instruction based on target angle
  const getInstruction = () => {
    switch (targetAngle) {
      case 180:
        return "Display text with fade in effect";
      case 90:
        return "Remove punctuation";
      case 270:
        return "Apply padding";
      case 0:
      case 360:
        return "Show chessboard";
      default:
        return "Rotate wheel to target position";
    }
  };
  
  return (
    <div className="ship-wheel-container">
      <div className="ship-wheel-left">
        <img
          ref={wheelRef}
          src="/images/ship_wheel_256.png"
          alt="Ship Wheel"
          className="ship-wheel"
          style={{ transform: `rotate(${rotation}deg)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </div>
      <div className="ship-wheel-right">
        <div className="ship-wheel-instruction">
          <h3>Instruction:</h3>
          <p>{getInstruction()}</p>
        </div>
        <div className="ship-wheel-position">
          <p>Current Position: <span className={isTargetReached ? "position-reached" : "position-not-reached"}>{Math.round(currentAngle)}°</span></p>
          <p>Target Position: <span>{targetAngle}°</span></p>
        </div>
      </div>
    </div>
  );
};

export default ShipWheel;