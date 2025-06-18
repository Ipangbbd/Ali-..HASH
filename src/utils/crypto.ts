// Advanced text transformation utilities for autonomous operation
export class SecureTextTransformer {
  private static readonly MAGIC_HEADER = 'CYPHER_CORE_V1';
  private static readonly CHECKSUM_LENGTH = 8;

  /**
   * Generates a deterministic transformation key from the input text
   */
  private static generateTransformationMatrix(text: string): number[] {
    const matrix: number[] = [];
    let seed = 0;
    
    // Create a seed from the text content
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i) * (i + 1);
    }
    
    // Generate transformation matrix using linear congruential generator
    let current = seed;
    for (let i = 0; i < 256; i++) {
      current = (current * 1103515245 + 12345) & 0x7fffffff;
      matrix.push(current % 256);
    }
    
    return matrix;
  }

  /**
   * Creates a simple checksum for integrity verification
   */
  private static createChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Applies a reversible transformation to the text
   */
  private static transformText(text: string, matrix: number[], reverse: boolean = false): string {
    const result: number[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const matrixValue = matrix[i % matrix.length];
      
      if (reverse) {
        // Reverse transformation
        result.push(charCode - matrixValue);
      } else {
        // Forward transformation
        result.push(charCode + matrixValue);
      }
    }
    
    return String.fromCharCode(...result);
  }

  /**
   * Encodes plain text using autonomous transformation
   */
  static encrypt(plaintext: string): string {
    if (!plaintext.trim()) {
      throw new Error('Text cannot be empty');
    }

    try {
      // Generate transformation matrix from the text itself
      const matrix = this.generateTransformationMatrix(plaintext);
      
      // Apply transformation
      const transformed = this.transformText(plaintext, matrix);
      
      // Create checksum for integrity
      const checksum = this.createChecksum(plaintext);
      
      // Combine header, checksum, and transformed data
      const combined = `${this.MAGIC_HEADER}:${checksum}:${transformed}`;
      
      // Encode to base64 for safe transport
      return btoa(unescape(encodeURIComponent(combined)));
    } catch (error) {
      throw new Error('Encoding failed: ' + (error as Error).message);
    }
  }

  /**
   * Decodes transformed text back to original
   */
  static decrypt(encodedText: string): string {
    if (!encodedText.trim()) {
      throw new Error('Encoded text cannot be empty');
    }

    try {
      // Decode from base64
      const decoded = decodeURIComponent(escape(atob(encodedText)));
      
      // Parse the components
      const parts = decoded.split(':');
      if (parts.length !== 3 || parts[0] !== this.MAGIC_HEADER) {
        throw new Error('Invalid encoded text format');
      }
      
      const [, originalChecksum, transformedData] = parts;
      
      // We need to reverse-engineer the original text
      // Since we used the original text to generate the matrix,
      // we'll use an iterative approach to find the original
      const result = this.reverseTransformation(transformedData, originalChecksum);
      
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid encoded text format')) {
        throw error;
      }
      throw new Error('Decoding failed: Invalid format or corrupted data');
    }
  }

  /**
   * Reverse transformation using iterative approach
   */
  private static reverseTransformation(transformedData: string, expectedChecksum: string): string {
    // For a more robust approach, we'll use a different strategy
    // We'll apply a reverse transformation based on position and character patterns
    
    const result: number[] = [];
    
    // Create a reverse transformation pattern
    for (let i = 0; i < transformedData.length; i++) {
      const charCode = transformedData.charCodeAt(i);
      // Use a deterministic reverse calculation based on position
      const offset = ((i + 1) * 37 + 123) % 256;
      result.push(charCode - offset);
    }
    
    const decoded = String.fromCharCode(...result);
    
    // Verify checksum
    const calculatedChecksum = this.createChecksum(decoded);
    if (calculatedChecksum !== expectedChecksum) {
      throw new Error('Data integrity check failed - text may be corrupted');
    }
    
    return decoded;
  }

  /**
   * Enhanced encoding that's truly reversible
   */
  static encrypt(plaintext: string): string {
    if (!plaintext.trim()) {
      throw new Error('Text cannot be empty');
    }

    try {
      const result: number[] = [];
      const checksum = this.createChecksum(plaintext);
      
      // Apply position-based transformation
      for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i);
        const offset = ((i + 1) * 37 + 123) % 256;
        result.push(charCode + offset);
      }
      
      const transformed = String.fromCharCode(...result);
      const combined = `${this.MAGIC_HEADER}:${checksum}:${transformed}`;
      
      return btoa(unescape(encodeURIComponent(combined)));
    } catch (error) {
      throw new Error('Encoding failed: ' + (error as Error).message);
    }
  }

  /**
   * Validates if a string appears to be validly encoded
   */
  static isValidEncryptedFormat(text: string): boolean {
    try {
      const decoded = decodeURIComponent(escape(atob(text)));
      const parts = decoded.split(':');
      return parts.length === 3 && parts[0] === this.MAGIC_HEADER;
    } catch {
      return false;
    }
  }
}