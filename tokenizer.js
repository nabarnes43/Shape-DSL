/**
 * Tokenizer for the Shape Drawing DSL
 * Converts input string into tokens for the parser
 */
function tokenize(input) {
    // Regular expressions for different token types
    const patterns = [
      { type: 'KEYWORD', regex: /^(draw|circle|rectangle|line|at|radius|width|height|color|from|to)/i },
      { type: 'NUMBER', regex: /^-?\d+(\.\d+)?/ },
      { type: 'COLOR', regex: /^(red|green|blue|yellow|black|white|purple|orange|#[0-9a-f]{6})/i },
      { type: 'SYMBOL', regex: /^[\(\),]/ },
      { type: 'WHITESPACE', regex: /^\s+/ }
    ];
  
    const tokens = [];
    let remaining = input.trim();
  
    // Process input until nothing remains
    while (remaining.length > 0) {
      let matched = false;
      
      // Try each pattern
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match) {
          const value = match[0];
          // Only add non-whitespace tokens
          if (pattern.type !== 'WHITESPACE') {
            tokens.push({ type: pattern.type, value });
          }
          // Remove the matched portion from the remaining text
          remaining = remaining.slice(value.length).trim();
          matched = true;
          break;
        }
      }
      
      // If no pattern matched, there's an error in the input
      if (!matched) {
        throw new Error(`Unexpected token at: ${remaining}`);
      }
    }
    
    return tokens;
  }