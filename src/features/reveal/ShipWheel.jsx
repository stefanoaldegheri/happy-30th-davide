import React, { useState, useRef, useEffect } from 'react';
import './ShipWheel.css';

const ShipWheel = ({ onRotationChange, targetAngle, step, onPoneglyphAlignment }) => {
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
    const diff = Math.abs(normalizedAngle - normalizedTarget);
    const circularDiff = Math.min(diff, 360 - diff); // Handle 0-360 wrap-around
    const reached = circularDiff < 5;
    
    setIsTargetReached(reached);
    return reached;
  };
  
  // Prevent default drag behavior to avoid ghosting effect
  const handleDragStart = (e) => {
    e.preventDefault();
    
    // Create an invisible image to use as drag image
    const emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    // Set the drag image to be transparent
    if (e.dataTransfer) {
      e.dataTransfer.setDragImage(emptyImage, 0, 0);
      e.dataTransfer.setData('text/plain', 'ship-wheel');
    }
  };
  
  // Handle mouse down on wheel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };
  
  // Handle touch start on wheel
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setLastPosition({ 
      x: touch.clientX, 
      y: touch.clientY 
    });
  };
  
  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!isDragging || !wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate current angle
    const currentAngleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let currentAngleDeg = currentAngleRad * 180 / Math.PI;
    
    // Adjust angle to be from 0 to 360
    currentAngleDeg = (currentAngleDeg + 90 + 360) % 360;
    
    // Calculate rotation based on previous angle
    const prevAngleRad = Math.atan2(lastPosition.y - centerY, lastPosition.x - centerX);
    let prevAngleDeg = prevAngleRad * 180 / Math.PI;
    prevAngleDeg = (prevAngleDeg + 90 + 360) % 360;
    
    // Calculate the difference in rotation
    let delta = currentAngleDeg - prevAngleDeg;
    
    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Calculate new rotation with constraints
    let newRotation = rotation + delta;
    
    // Constrain rotation to 0-360 range (stop at boundaries)
    newRotation = Math.max(0, Math.min(360, newRotation));
    
    setRotation(newRotation);
    setCurrentAngle(newRotation);
    
    // For step 5 (poneglyph alignment), call the alignment function
    if (step === 5) {
      onPoneglyphAlignment && onPoneglyphAlignment(newRotation);
    }
    
    checkTargetReached(newRotation);
    
    // Update last position
    setLastPosition({ 
      x: e.clientX, 
      y: e.clientY 
    });
  };
  
  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isDragging || !wheelRef.current) return;
    
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate current angle
    const currentAngleRad = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    let currentAngleDeg = currentAngleRad * 180 / Math.PI;
    
    // Adjust angle to be from 0 to 360
    currentAngleDeg = (currentAngleDeg + 90 + 360) % 360;
    
    // Calculate rotation based on previous angle
    const prevAngleRad = Math.atan2(lastPosition.y - centerY, lastPosition.x - centerX);
    let prevAngleDeg = prevAngleRad * 180 / Math.PI;
    prevAngleDeg = (prevAngleDeg + 90 + 360) % 360;
    
    // Calculate the difference in rotation
    let delta = currentAngleDeg - prevAngleDeg;
    
    // Handle angle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Calculate new rotation with constraints
    let newRotation = rotation + delta;
    
    // Constrain rotation to 0-360 range (stop at boundaries)
    newRotation = Math.max(0, Math.min(360, newRotation));
    
    setRotation(newRotation);
    setCurrentAngle(newRotation);
    
    // For step 5 (poneglyph alignment), call the alignment function
    if (step === 5) {
      onPoneglyphAlignment && onPoneglyphAlignment(newRotation);
    }
    
    checkTargetReached(newRotation);
    
    // Update last position
    setLastPosition({ 
      x: touch.clientX, 
      y: touch.clientY 
    });
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (isDragging) {
      // Check if target is reached when mouse is released
      if (checkTargetReached(rotation)) {
        // For step 5, if not at 0°, reset
        if (step === 5 && Math.abs(rotation) > 5) {
          // Reset wheel to 0° if not properly aligned
          setRotation(0);
          setCurrentAngle(0);
        } else {
          onRotationChange && onRotationChange(targetAngle);
        }
      }
    }
    setIsDragging(false);
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (isDragging) {
      // Check if target is reached when touch is released
      if (checkTargetReached(rotation)) {
        // For step 5, if not at 0°, reset
        if (step === 5 && Math.abs(rotation) > 5) {
          // Reset wheel to 0° if not properly aligned
          setRotation(0);
          setCurrentAngle(0);
        } else {
          onRotationChange && onRotationChange(targetAngle);
        }
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
  }, [isDragging, lastPosition, rotation, targetAngle, step, onPoneglyphAlignment]);
  
  // Get instruction based on current step
  const getInstruction = () => {
    switch (step) {
      case 0:
        return "Rotate wheel to 180° to display text";
      case 1:
        return "Move to 90°: open treasure chest west and fade in text";
      case 2:
        return "Move to 270°: open treasure chest east and remove punctuation";
      case 3:
        return "Move to 180°: open treasure chest south and apply padding";
      case 4:
        return "Move to 0°: open treasure chest north and show chessboard";
      case 5:
        return "Align poneglyph: slide chessboard to target position";
      case 6:
        return "Apply opacity filter: from 100° (opacity 100) to 360° (full transparent)";
      default:
        return "Rotate wheel to target position";
    }
  };
  
  // Get target angle based on current step
  const getTargetAngle = () => {
    switch (step) {
      case 0:
        return 180;
      case 1:
        return 90;
      case 2:
        return 270;
      case 3:
        return 180;
      case 4:
        return 0;
      case 5:
        return 0; // For poneglyph alignment, target is to return to 0
      case 6:
        return 360;
      default:
        return targetAngle;
    }
  };
  
  // Update target when step changes
  useEffect(() => {
    const newTarget = getTargetAngle();
    if (newTarget !== targetAngle) {
      // This would require a callback to update parent state, but we'll use the calculated one directly
    }
  }, [step, targetAngle]);
  
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
          onDragStart={handleDragStart}
        />
      </div>
      <div className="ship-wheel-right">
        <div className="ship-wheel-instruction">
          <h3>Instruction:</h3>
          <p>{getInstruction()}</p>
        </div>
        <div className="ship-wheel-position">
          <p>Current Position: <span className={isTargetReached ? "position-reached" : "position-not-reached"}>{Math.round(rotation)}°</span></p>
          <p>Target Position: <span>{getTargetAngle()}°</span></p>
        </div>
      </div>
    </div>
  );
};

export default ShipWheel;