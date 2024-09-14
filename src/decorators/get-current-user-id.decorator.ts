import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/utils/types/jwt.types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) {
      throw new Error('No user found');
    }
    return user.id;
  },
);
