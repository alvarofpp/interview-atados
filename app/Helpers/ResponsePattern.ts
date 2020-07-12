export default class ResponsePattern {
  static success({message = '', data = {}}) {
    return {
      message: message,
      data: data,
    }
  }

  static error({message = '', error = {}}) {
    return {
      message: message,
      error: error,
    }
  }

  static data(data = {}) {
    return {
      data: data,
    }
  }
}
