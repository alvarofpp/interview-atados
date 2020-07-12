/**
 * Standardization of responses.
 */
export default class ResponsePattern {
  /**
   * Success response.
   *
   * @param message
   * @param data
   */
  static success({message = '', data = {}}) {
    return {
      message: message,
      data: data,
    }
  }

  /**
   * Response of returning data.
   *
   * @param data
   */
  static data(data = {}) {
    return {
      data: data,
    }
  }

  /**
   * Error response.
   *
   * @param message
   * @param error
   */
  static error({message = '', error = {}}) {
    return {
      message: message,
      error: error,
    }
  }
}
