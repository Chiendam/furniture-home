class customError extends Error {
  constructor(message, statusCode){
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;

      //Lưu lại stack báo lỗi khi throw hoặc console.log lỗi
      Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = customError;