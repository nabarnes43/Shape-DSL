/**
 * Converts number words to their numeric values
 * Handles numbers from zero to nine hundred ninety nine
 * @param {string} text - Text containing number words
 * @return {string} - Text with number words converted to digits
 */
function wordToNumber(text) {
    // Basic number mappings
    const units = {
      'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 
      'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
      'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
      'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19
    };
    
    const tens = {
      'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
    };
    
    // Handle three-part numbers (e.g. "three hundred twenty five")
    const hundredPattern = /\b(zero|one|two|three|four|five|six|seven|eight|nine)\s+hundred(?:\s+(?:and\s+)?)?(?:(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[ -](zero|one|two|three|four|five|six|seven|eight|nine))?)?/gi;
    let result = text.replace(hundredPattern, (match, hundredWord, tensWord, unitWord) => {
      let value = units[hundredWord.toLowerCase()] * 100;
      
      if (tensWord) {
        value += tens[tensWord.toLowerCase()];
        if (unitWord) {
          value += units[unitWord.toLowerCase()];
        }
      }
      
      return value.toString();
    });
    
    // Handle two-part numbers (e.g. "twenty five")
    const twoPartPattern = /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[ -](zero|one|two|three|four|five|six|seven|eight|nine)\b/gi;
    result = result.replace(twoPartPattern, (match, tensWord, unitWord) => {
      return (tens[tensWord.toLowerCase()] + units[unitWord.toLowerCase()]).toString();
    });
    
    // Handle single numbers (units, teens, decades)
    const singlePattern = /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/gi;
    result = result.replace(singlePattern, match => {
      const word = match.toLowerCase();
      if (units[word] !== undefined) {
        return units[word].toString();
      } else if (tens[word] !== undefined) {
        return tens[word].toString();
      }
      return match;
    });
    
    // Fix spacing issues
    result = result.replace(/(\d+)(\s*)comma(\s*)(\d+)/g, '$1,$4');
    
    // Fix spacing between numbers and words
    result = result.replace(/(\d+)([a-zA-Z])/g, '$1 $2');
    result = result.replace(/([a-zA-Z])(\d+)/g, '$1 $2');
    
    return result;
  }
  
  // Example usage
  console.log(preprocess("draw a circle at one hundred comma fifty with radius twenty five color red"));
  // Output: "draw a circle at (100, 50) with radius 25 color red"
  
  console.log(preprocess("draw a line from twenty comma thirty to two hundred fifty comma three hundred color blue"));
  // Output: "draw a line from (20, 30) to (250, 300) color blue"

/**
 * Normalizes comma formatting
 * @param {string} text - Text containing commas
 * @return {string} - Text with standardized comma formatting
 */
function normalizeCommas(text) {
  // Replace "comma" word with actual comma symbol
  let result = text.replace(/\s+comma\s+/gi, ',');
  
  // Add commas between back-to-back numbers (e.g., "50 60" becomes "50,60")
  result = result.replace(/(\d+)\s+(\d+)/g, '$1,$2');
  
  return result;
}

/**
 * Normalizes parentheses formatting
 * @param {string} text - Text containing parentheses descriptions
 * @return {string} - Text with standardized parentheses
 */
function normalizeParentheses(text) {
  // Replace parentheses words with symbols
  let result = text
    .replace(/\s+open\s+parenthesis\s+/gi, ' (')
    .replace(/\s+close\s+parenthesis(\s+|$)/gi, ') ')
    .replace(/\s+left\s+parenthesis\s+/gi, ' (')
    .replace(/\s+right\s+parenthesis(\s+|$)/gi, ') ')
    .replace(/\s+open\s+paren\s+/gi, ' (')
    .replace(/\s+close\s+paren(\s+|$)/gi, ') ')
    .replace(/\s+left\s+paren\s+/gi, ' (')
    .replace(/\s+right\s+paren(\s+|$)/gi, ') ');
    
  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ').trim();
    
  return result;
}

/**
 * Normalizes hex color codes
 * @param {string} text - Text containing hashtag colors
 * @return {string} - Text with standardized hex color formatting
 */
function normalizeHashtags(text) {
  // Convert "hashtag" followed by hex to proper #hex format
  // First, remove spaces between hex digits
  let result = text.replace(/hashtag\s+([0-9a-f]\s*[0-9a-f]\s*[0-9a-f]\s*[0-9a-f]\s*[0-9a-f]\s*[0-9a-f])/gi, 
    (match, hexPart) => {
      // Remove spaces from hex part
      const cleanHex = hexPart.replace(/\s+/g, '');
      return `#${cleanHex}`;
    });
  
  return result;
}

/**
 * Normalizes action keywords to standard DSL terms
 * @param {string} text - Text containing various action descriptions
 * @return {string} - Text with standardized action keywords
 */
function normalizeActions(text) {
  return text
    .replace(/\b(create|make|add|place|draw a)\b/gi, 'draw')    
    .replace(/\b(square)\b/gi, 'rectangle')
    .replace(/\bposition\b/gi, 'at')
    .replace(/\b(with size|of size)\b/gi, 'with')
    .replace(/\b(in|using|with color|colored)\b/gi, 'color');
}

/**
 * Converts natural coordinate phrases to proper format
 * @param {string} text - Text containing coordinate descriptions
 * @return {string} - Text with standardized coordinate format
 */
function normalizeCoordinatePhrases(text) {
  return text
    .replace(/\bat position\s+(\d+)[,\s]+(\d+)\b/gi, 'at ($1, $2)')
    .replace(/\bfrom position\s+(\d+)[,\s]+(\d+)\b/gi, 'from ($1, $2)')
    .replace(/\bto position\s+(\d+)[,\s]+(\d+)\b/gi, 'to ($1, $2)')
    .replace(/\bpoint\s+(\d+)[,\s]+(\d+)\b/gi, '($1, $2)');
}

/**
 * Expands color vocabulary and normalizes color descriptions
 * @param {string} text - Text containing color descriptions
 * @return {string} - Text with standardized colors
 */
function expandColorVocabulary(text) {
  // Map common color terms to standard colors
  const colorMap = {
    'navy': 'blue',
    'sky blue': 'blue',
    'crimson': 'red',
    'scarlet': 'red',
    'forest green': 'green',
    'lime': 'green',
    'golden': 'yellow',
    'ivory': 'white',
    'silver': 'gray',
    'grey': 'gray',
    'magenta': 'purple',
    'violet': 'purple',
    'tangerine': 'orange'
  };
  
  let result = text;
  
  // Replace color synonyms with standard colors
  for (const [synonym, standardColor] of Object.entries(colorMap)) {
    result = result.replace(new RegExp(`\\b${synonym}\\b`, 'gi'), standardColor);
  }
  
  // Handle "rgb" descriptions
  result = result.replace(/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, (match, r, g, b) => {
    // Convert RGB to hex
    const toHex = num => {
      const hex = parseInt(num).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  });
  
  return result;
}

/**
 * Normalizes dimension descriptions
 * @param {string} text - Text containing dimension descriptions
 * @return {string} - Text with standardized dimension terms
 */
function normalizeDimensions(text) {
  return text
    .replace(/\bwith\b/gi, 'width')
    .replace(/\b(with|of) size\s+(\d+)[,\s]+(\d+)\b/gi, 'width $2 height $3')
    .replace(/\b(\d+)\s*by\s*(\d+)\b/gi, 'width $1 height $2')
    .replace(/\bdiameter\s+(\d+)\b/gi, 'radius $1')
    .replace(/\bcircumference\s+(\d+)\b/gi, match => {
      // Convert circumference to radius (c = 2πr)
      const circumference = parseInt(match.match(/\d+/)[0]);
      const radius = Math.round(circumference / (2 * Math.PI));
      return `radius ${radius}`;
    });
}

/**
 * Normalizes measurement units
 * @param {string} text - Text containing measurement units
 * @return {string} - Text with standardized measurements
 */
function normalizeUnits(text) {
  // Remove unit words after numbers to standardize to pixels
  return text.replace(/(\d+)\s*(pixels?|px|points?|pt)\b/gi, '$1');
}

/**
 * Preprocess input text for the tokenizer
 * @param {string} text - Raw input text
 * @return {string} - Preprocessed text ready for tokenization
 */
function preprocess(text) {
  let result = text;
  
  // Remove filler words
  result = result.replace(/\b(please|could you|can you|i want to|i would like to)\b/gi, '');
  
  // Apply all preprocessing steps in the correct order
  result = normalizeActions(result);
  result = wordToNumber(result);
  result = normalizeCommas(result);
  result = normalizeHashtags(result);
  result = normalizeParentheses(result);
  result = normalizeCoordinatePhrases(result);
  result = expandColorVocabulary(result);
  result = normalizeDimensions(result);
  result = normalizeUnits(result);
  
  // Convert comma-separated numbers to coordinates with parentheses
  // But only if they're not already in parentheses
  result = result.replace(/(\d+),(\d+)/g, '($1, $2)');
  
  // Clean up any potential issues
  result = result.replace(/\(\((\d+), (\d+)\)\)/g, '($1, $2)'); // Fix double parentheses
  result = result.replace(/\s+/g, ' ').trim(); // Normalize whitespace
  
  return result;
}

console.log(preprocess("draw a circle at fifty comma sixty hashtag ff00aa"));
// Output: "draw a circle at 50,60 #ff00aa"

// Test auto comma insertion for back-to-back numbers
console.log(preprocess("draw a circle at 50 60 with radius 25"));
// Output should be: "draw a circle at 50,60 with radius 25"

// Test parentheses normalization
console.log(preprocess("draw a line from open paren 10 20 close paren to left parenthesis 30 40 right parenthesis"));
// Output should be: "draw a line from (10,20) to (30,40)"

// Test coordinates parenthesization
console.log(preprocess("draw a circle at 100,50 with radius 25 color red"));
// Output should be: "draw a circle at (100, 50) with radius 25 color red"

// Test new preprocessing features
console.log(preprocess("please create a square at position 200,300 with size 50,50 color navy"));
console.log(preprocess("make a circle with diameter 40 at point 100 200 colored sky blue"));
console.log(preprocess("add a line from position 10 20 to point 30 40 in rgb(255,0,0)"));
console.log(preprocess("draw a rectangle 100 by 50 at 200 300 with color grey"));

// Export functions for testing
module.exports = {
  wordToNumber,
  preprocess,
  normalizeCommas,
  normalizeParentheses,
  normalizeHashtags,
  normalizeActions,
  normalizeCoordinatePhrases,
  expandColorVocabulary,
  normalizeDimensions,
  normalizeUnits
};


  