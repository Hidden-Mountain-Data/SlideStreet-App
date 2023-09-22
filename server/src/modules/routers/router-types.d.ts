export type RouterAddStatus = {
  success: boolean;
  message: string;
};

export interface CreateRouterWithUserId extends CreateRouterDto {
  userId: number;
}

export interface JwtRequest extends ExpressRequest {
  user: {
    userId: number;
    // add other fields you expect in req.user here
  };
}
