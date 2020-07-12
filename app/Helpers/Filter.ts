export default class Filter {
  static apply(queryString: object, filters: {column, type}[], clauses: object = {}) {
    try {
      filters.forEach(({column, type}) => {
        if (column in queryString) {
          const queryStringField = JSON.parse(queryString[column])

          if (typeof (queryStringField) !== type) {
            clauses = {
              message: `Filter type "${column}" is invalid (expected ${type}).`,
              hasError: true,
            }
            return
          }

          clauses[column] = queryStringField
        }
      })
    } catch (err) {
      return {
        message: `An error occurred while applying the filter.`,
        error: err,
        hasError: true,
      }
    }
    return clauses
  }
}
