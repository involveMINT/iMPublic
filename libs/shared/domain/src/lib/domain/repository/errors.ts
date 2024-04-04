/**
 * An Operation's error response schema.
 */
export interface OrchaOperationError {
  statusCode: number;
  /** ISO string. */
  timestamp: string;
  operation: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  response: string | object;
}
