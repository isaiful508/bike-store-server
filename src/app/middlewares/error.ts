import { ZodError } from 'zod';
import {Request, Response, NextFunction  } from 'express';

// eslint-disable-next-line
const error  = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {

    //format error
    // eslint-disable-next-line
    const formattedErrors = err.errors.reduce((acc: any, curr: any) => {
      acc[curr.path[0]] = {
        message: curr.message,
        name: 'ValidatorError',
        properties: {
          message: curr.message,
          type: curr.code,
        },
        kind: curr.code,
        path: curr.path[0],
        value: curr.input, 
      };
      return acc;
    }, {});


    return res.status(400).json({
      message: 'Validation failed',
      success: false,
      error: {
        name: 'ValidationError',
        errors: formattedErrors,
      },
    });
  }

  res.status(500).json({
    message: 'Internal server error',
    success: false,
    error: {
      name: err.name || 'Error',
      message: err.message || 'Something went wrong',
    },
  });
};

export default error;



