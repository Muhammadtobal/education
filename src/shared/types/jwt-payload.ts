import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export interface UserJWTPayload {
  userId: string;
}

export interface TeacherJWTPayload {
  teacherId: string;
}

export interface EmployeeJWTPayload {
  empId: string;
  permissions: string[];
}

export const verifyJwtToken = <T>(
  token: string,
  secretKey: string,
  ignoreExpiration = false,
): T => {
  try {
    return jwt.verify(token, secretKey, { ignoreExpiration }) as T;
  } catch (err: any) {
    throw new HttpException(
      err.name === 'TokenExpiredError'
        ? 'TOKEN_EXPIRED'
        : 'INVALID_TOKEN_SIGNATURE',
      HttpStatus.UNAUTHORIZED,
    );
  }
};

export const decodeJwtToken = (token: string) => {
  const decoded = jwt.decode(token, { complete: true }) as jwt.Jwt | null;
  if (!decoded || typeof decoded.payload !== 'object') {
    throw new HttpException('INVALID_JWT_PAYLOAD', HttpStatus.UNAUTHORIZED);
  }
  return decoded.payload;
};
