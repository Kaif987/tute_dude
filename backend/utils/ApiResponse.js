class ApiResponse {
  success;
  statusCode;
  message;
  data;

  constructor(success, statusCode, message, data) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
