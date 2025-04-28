/**
 * Main function that integrates tokenizer, parser, and generator
 * for the Shape Drawing DSL
 */
function processCommand(input) {
    try {
      // Step 1: Tokenize the input
      const tokens = tokenize(input);
      
      // Step 2: Parse the tokens
      const parser = new Parser(tokens);
      const parsedData = parser.parse();
      
      // Step 3: Generate SVG from parsed data
      const svgOutput = generateSVG(parsedData);
      
      return {
        tokens,
        parsedData,
        svgOutput
      };
    } catch (error) {
      return {
        error: error.message
      };
    }
  }