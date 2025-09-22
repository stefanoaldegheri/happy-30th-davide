  // Render the text grid with padding (step 2)
  const renderPaddedTextGrid = () => {
    const grid = textToPaddedGrid(ocrResult || originalText);
    
    return (
      <div className="text-grid-content" style={{ 
        position: 'relative', 
        width: 'fit-content',
        height: '272px'
      }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row" style={{ 
            position: 'absolute', 
            top: `${rowIndex * 34}px`, 
            left: 0, 
            paddingLeft: `${paddingConfig[rowIndex] * 34}px`,
            width: 'fit-content'
          }}>
            {row.map((char, colIndex) => {
              // Calculate original position without padding
              const originalCol = colIndex - paddingConfig[rowIndex];
              
              return (
                <span 
                  key={`${rowIndex}-${colIndex}`} 
                  className="grid-char"
                  data-original-row={rowIndex}
                  data-original-col={originalCol}
                  data-target-row={rowIndex}
                  data-target-col={colIndex}
                  style={{ 
                    position: 'absolute',
                    left: `${colIndex * 34}px`,
                    top: 0,
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    margin: '2px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };