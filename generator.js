/**
 * SVG Generator for the Shape Drawing DSL
 * Converts parsed data into SVG markup
 */
function generateSVG(parsedData) {
    // Start with SVG header
    let svgOutput = '<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">\n';
    
    // Process the parsed data based on shape type
    const shape = parsedData.shape;
    const properties = parsedData.properties;
    
    if (shape === 'circle') {
      // Generate circle SVG
      const x = properties.point.x;
      const y = properties.point.y;
      const radius = properties.radius;
      const color = properties.color;
      
      svgOutput += `  <circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" />\n`;
    } 
    else if (shape === 'rectangle') {
      // Generate rectangle SVG
      const x = properties.point.x;
      const y = properties.point.y;
      const width = properties.width;
      const height = properties.height;
      const color = properties.color;
      
      svgOutput += `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" />\n`;
    } 
    else if (shape === 'line') {
      // Generate line SVG
      const x1 = properties.from.x;
      const y1 = properties.from.y;
      const x2 = properties.to.x;
      const y2 = properties.to.y;
      const color = properties.color;
      // Use default width if not specified
      const width = properties.width || 1;
      
      svgOutput += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" />\n`;
    }
    
    // Close SVG tag
    svgOutput += '</svg>';
    
    return svgOutput;
  }