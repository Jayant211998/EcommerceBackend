export const globalErrorHandler = (err, req, res, next) => {
  //stack trace
  //message
  const stack = err?.stack;
  const message = err?.message;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  res.status(statusCode).json({
    stack,
    message,
  });
};

// 404 Not Found

export const notFoundErrorHandler = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  next(error);
};
