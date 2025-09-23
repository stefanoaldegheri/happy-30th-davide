import React, { useState, useRef, useEffect } from 'react';
import './ShipWheel.css';

const ShipWheel = ({ onRotationChange }) => {
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Normalize angle to 0-360 range
  const normalizeAngle = (angle) => {
    return ((angle % 360) + 360) % 360;
  };
  
  // Trigger action based on rotation
  const triggerAction = (angle) => {
    const normalizedAngle = normalizeAngle(angle);
    
    // Define specific angles for actions
    const triggerAngles = [0, 90, 180, 270, 360];
    
    // Check if we're close to any trigger angle (within 5 degrees)
    for (const triggerAngle of triggerAngles) {
      if (Math.abs(normalizedAngle - triggerAngle) < 5 || 
          Math.abs(normalizedAngle - (triggerAngle + 360)) < 5) {
        onRotationChange && onRotationChange(triggerAngle);
        break;
      }
    }
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
    if (!isDragging) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to current position
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    
    // Calculate angle from center to last position
    const lastAngle = Math.atan2(lastPosition.y - centerY, lastPosition.x - centerX) * 180 / Math.PI;
    
    // Calculate rotation delta
    let delta = currentAngle - lastAngle;
    
    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Update rotation
    const newRotation = rotation + delta;
    setRotation(newRotation);
    triggerAction(newRotation);
    
    // Update last position
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to current position
    const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
    
    // Calculate angle from center to last position
    const lastAngle = Math.atan2(lastPosition.y - centerY, lastPosition.x - centerX) * 180 / Math.PI;
    
    // Calculate rotation delta
    let delta = currentAngle - lastAngle;
    
    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Update rotation
    const newRotation = rotation + delta;
    setRotation(newRotation);
    triggerAction(newRotation);
    
    // Update last position
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
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
  }, [isDragging, lastPosition, rotation]);
  
  return (
    <div className="ship-wheel-container">
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
  );
};

export default ShipWheel;