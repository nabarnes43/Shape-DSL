/**
 * Parser for the Shape Drawing DSL
 * Implements a recursive descent parser based on the grammar
 */
class Parser {
    constructor(tokens) {
      this.tokens = tokens;
      this.current = 0;
    }
  
    // Check if we've reached the end of tokens
    isAtEnd() {
      return this.current >= this.tokens.length;
    }
  
    // Get the current token
    peek() {
      if (this.isAtEnd()) return null;
      return this.tokens[this.current];
    }
  
    // Move to the next token and return the previous one
    advance() {
      if (!this.isAtEnd()) this.current++;
      return this.tokens[this.current - 1];
    }
  
    // Check if the current token matches the expected type and value
    match(type, value = null) {
      if (this.isAtEnd()) return false;
      
      const token = this.peek();
      if (token.type !== type) return false;
      if (value !== null && token.value.toLowerCase() !== value.toLowerCase()) return false;
      
      return true;
    }
  
    // Consume a token if it matches the expected type/value, otherwise throw an error
    consume(type, value = null, errorMessage) {
      if (this.match(type, value)) {
        return this.advance();
      }
      
      throw new Error(errorMessage || `Expected ${type}${value ? ` "${value}"` : ''}, got ${this.peek()?.type} "${this.peek()?.value}"`);
    }
  
    // Parse the entire program (just a command in our case)
    parse() {
      return this.command();
    }
  
    // Parse a command: "draw" <shape> <properties>
    command() {
      this.consume('KEYWORD', 'draw', "Program must start with 'draw'");
      
      const shapeToken = this.peek();
      if (!this.match('KEYWORD', 'circle') && 
          !this.match('KEYWORD', 'rectangle') && 
          !this.match('KEYWORD', 'line')) {
        throw new Error("Expected shape: 'circle', 'rectangle', or 'line'");
      }
      
      this.advance(); // consume the shape token
      
      let properties;
      switch (shapeToken.value.toLowerCase()) {
        case 'circle':
          properties = this.circleProperties();
          break;
        case 'rectangle':
          properties = this.rectangleProperties();
          break;
        case 'line':
          properties = this.lineProperties();
          break;
      }
      
      return {
        type: 'command',
        shape: shapeToken.value.toLowerCase(),
        properties
      };
    }
  
    // Parse circle properties: "at" <point> "radius" <number> "color" <color>
    circleProperties() {
      this.consume('KEYWORD', 'at', "Expected 'at' after 'circle'");
      const point = this.point();
      
      this.consume('KEYWORD', 'radius', "Expected 'radius' after point");
      const radius = this.number();
      
      this.consume('KEYWORD', 'color', "Expected 'color' after radius");
      const color = this.color();
      
      return {
        point,
        radius,
        color
      };
    }
  
    // Parse rectangle properties: "at" <point> "width" <number> "height" <number> "color" <color>
    rectangleProperties() {
      this.consume('KEYWORD', 'at', "Expected 'at' after 'rectangle'");
      const point = this.point();
      
      this.consume('KEYWORD', 'width', "Expected 'width' after point");
      const width = this.number();
      
      this.consume('KEYWORD', 'height', "Expected 'height' after width");
      const height = this.number();
      
      this.consume('KEYWORD', 'color', "Expected 'color' after height");
      const color = this.color();
      
      return {
        point,
        width,
        height,
        color
      };
    }
  
    // Parse line properties: "from" <point> "to" <point> "color" <color> ["width" <number>]
    lineProperties() {
      this.consume('KEYWORD', 'from', "Expected 'from' after 'line'");
      const from = this.point();
      
      this.consume('KEYWORD', 'to', "Expected 'to' after point");
      const to = this.point();
      
      this.consume('KEYWORD', 'color', "Expected 'color' after point");
      const color = this.color();
      
      let width = 1; // Default width
      if (this.match('KEYWORD', 'width')) {
        this.advance(); // consume "width"
        width = this.number();
      }
      
      return {
        from,
        to,
        color,
        width
      };
    }
  
    // Parse a point: "(" <number> "," <number> ")"
    point() {
      this.consume('SYMBOL', '(', "Expected '(' for point");
      const x = this.number();
      this.consume('SYMBOL', ',', "Expected ',' after x coordinate");
      const y = this.number();
      this.consume('SYMBOL', ')', "Expected ')' after y coordinate");
      
      return { x, y };
    }
  
    // Parse a number
    number() {
      const token = this.consume('NUMBER', null, "Expected a number");
      return parseFloat(token.value);
    }
  
    // Parse a color
    color() {
      const token = this.consume('COLOR', null, "Expected a color");
      return token.value.toLowerCase();
    }
  }