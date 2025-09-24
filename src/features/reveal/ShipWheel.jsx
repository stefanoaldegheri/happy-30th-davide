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
    
    if (step === 5) {
      // In step 5, constrain rotation to 5-355 range (stop at boundaries)
      newRotation = Math.max(5, Math.min(355, newRotation));
    } else {
      // For other steps, constrain rotation to 0-360 range (stop at boundaries)
      newRotation = Math.max(0, Math.min(360, newRotation));
    }
    
    setRotation(newRotation);
    setCurrentAngle(newRotation);
    
    // For step 4 and 5 (chessboard positioning and poneglyph alignment), call the alignment function
    if (step === 4 || step === 5) {
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
    
    if (step === 5) {
      // In step 5, constrain rotation to 5-355 range (stop at boundaries)
      newRotation = Math.max(5, Math.min(355, newRotation));
    } else {
      // For other steps, constrain rotation to 0-360 range (stop at boundaries)
      newRotation = Math.max(0, Math.min(360, newRotation));
    }
    
    setRotation(newRotation);
    setCurrentAngle(newRotation);
    
    // For step 4 and 5 (chessboard positioning and poneglyph alignment), call the alignment function
    if (step === 4 || step === 5) {
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
      // For step 4 (sliding chessboard), check if in range 16°-44°
      // For step 5 (opacity control), check if close to 355°
      if (step === 4) {
        if (rotation >= 16 && rotation <= 44) {
          // If properly aligned to the range 16°-44°, trigger the next step
          onRotationChange && onRotationChange(rotation);
        } else {
          // For sliding, the user can rotate freely, but the important position is in range 16°-44°
          // If not in the range, still call poneglyph alignment to update position
          onPoneglyphAlignment && onPoneglyphAlignment(rotation);
        }
      } else if (step === 5) {
        // For step 5, check if aligned close to 355° (old: 0° or 360°)
        if (Math.abs(rotation - 355) < 5) {
          // If properly aligned, trigger the reveal action
          onRotationChange && onRotationChange(355);
        } else {
          // If not properly aligned, keep the rotation as is for poneglyph alignment
          onRotationChange && onRotationChange(rotation);
        }
      } else {
        // For other steps, check if target is reached
        if (checkTargetReached(rotation)) {
          onRotationChange && onRotationChange(getTargetAngle());
        }
      }
    }
    setIsDragging(false);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (isDragging) {
      // For step 4 (sliding chessboard), check if in range 16°-44°
      // For step 5 (opacity control), check if close to 355°
      if (step === 4) {
        if (rotation >= 16 && rotation <= 44) {
          // If properly aligned to the range 16°-44°, trigger the next step
          onRotationChange && onRotationChange(rotation);
        } else {
          // For sliding, the user can rotate freely, but the important position is in range 16°-44°
          // If not in the range, still call poneglyph alignment to update position
          onPoneglyphAlignment && onPoneglyphAlignment(rotation);
        }
      } else if (step === 5) {
        // For step 5, check if aligned close to 355° (old: 0° or 360°)
        if (Math.abs(rotation - 355) < 5) {
          // If properly aligned, trigger the reveal action
          onRotationChange && onRotationChange(355);
        } else {
          // If not properly aligned, keep the rotation as is for poneglyph alignment
          onRotationChange && onRotationChange(rotation);
        }
      } else {
        // For other steps, check if target is reached
        if (checkTargetReached(rotation)) {
          onRotationChange && onRotationChange(getTargetAngle());
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
    }
  }, [isDragging, lastPosition, rotation, targetAngle, step, onPoneglyphAlignment]);
  
  // Get instruction based on current step - updated to match new transition sequence
  const getInstruction = () => {
    switch (step) {
      case 0:
        return "Step 0: Rotate to 180° to show text";
      case 1:
        return "Step 1: Rotate to 90° to remove punctuation";
      case 2:
        return "Step 2: Rotate to 270° to apply padding";
      case 3:
        return "Step 3: Rotate to 180° to show chessboard at column 0";
      case 4:
        return "Step 4: Slide chessboard, rotate to 16°-44° range to continue";
      case 5:
        return "Step 5: Adjust opacity using wheel rotation, target 355°";
      case 6:
        return "Step 6: Message revealed";
      default:
        return "Rotate wheel to target position";
    }
  };
  
  // Get target angle based on current step - updated to match new transition sequence
  const getTargetAngle = () => {
    switch (step) {
      case 0:
        return 180; // Step 0 → target 180° = show text
      case 1:
        return 90;  // Step 1 → target 90° = remove punctuation
      case 2:
        return 270; // Step 2 → target 270° = apply padding
      case 3:
        return 180; // Step 3 → target 180° = show chessboard at column 0
      case 4:
        return 30;  // Step 4 → target 30° = any value from 16 to 44, no specific target
      case 5:
        return 355;  // Step 5 → target 355° = reveal secret by adjusting opacity to 0%
      case 6:
        return 355;  // Step 6 → target 355° = stay at revealed position
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
        {/* Debug controls for testing */}
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <button onClick={() => { setRotation(180); onRotationChange(180); }} style={{ fontSize: '10px', margin: '2px', padding: '2px' }}>To 180°</button>
          <button onClick={() => { setRotation(90); onRotationChange(90); }} style={{ fontSize: '10px', margin: '2px', padding: '2px' }}>To 90°</button>
          <button onClick={() => { setRotation(270); onRotationChange(270); }} style={{ fontSize: '10px', margin: '2px', padding: '2px' }}>To 270°</button>
          <button onClick={() => { setRotation(30); onRotationChange(30); }} style={{ fontSize: '10px', margin: '2px', padding: '2px' }}>To 30°</button>
          <button onClick={() => { setRotation(0); onRotationChange(0); }} style={{ fontSize: '10px', margin: '2px', padding: '2px' }}>To 0°</button>
        </div>
      </div>
      <div className="ship-wheel-right">
        <div className="ship-wheel-instruction">
          <h3>Instruction:</h3>
          <p>{getInstruction()}</p>
        </div>
        <div className="ship-wheel-position">
          {step < 4 && <p>Current Position: <span className={isTargetReached ? "position-reached" : "position-not-reached"}>{Math.round(rotation)}°</span></p>}
          {step < 4 && <p>Target Position: <span>{getTargetAngle()}°</span></p>}
          {(step === 4 || step === 5) && <p>Current Position: <span className={isTargetReached ? "position-reached" : "position-not-reached"}>{Math.round(rotation)}°</span></p>}
          {(step === 4 || step === 5) && <p>Target Position: <span>{getTargetAngle()}°</span></p>}
        </div>
      </div>
    </div>
  );
};

export default ShipWheel;