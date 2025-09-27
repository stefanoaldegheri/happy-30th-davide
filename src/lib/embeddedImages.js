import poneglyphImage from '../assets/poneglyph_256.png';
import shipWheelImage from '../assets/ship_wheel_256.png';
import treasureBoxImage from '../assets/treasure_box_256.png';

// Export the image imports as base64 encoded strings
export const poneglyphBase64 = poneglyphImage;
export const shipWheelBase64 = shipWheelImage;
export const treasureBoxBase64 = treasureBoxImage;

// Create a mapping for easy reference
export const embeddedImages = {
  poneglyph: poneglyphBase64,
  ship_wheel: shipWheelBase64,
  treasure_box: treasureBoxBase64,
};

export default embeddedImages;