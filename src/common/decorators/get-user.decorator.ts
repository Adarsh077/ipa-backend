import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from 'src/auth/auth.interface';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const request = context.getContext().req as AuthenticatedRequest;

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('You are not authenticated');
    }

    return data ? user[data] : user;
  },
);
