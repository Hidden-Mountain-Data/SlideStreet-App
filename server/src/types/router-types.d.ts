export type RouterStatus = {
  success: boolean;
  message: string;
};

export interface CreateRouterWithUserId extends CreateRouterDto {
  userId: number;
}

export interface JwtRequest extends ExpressRequest {
  user: {
    userId: number;
  };
}

export type RouterLocation = {
  routerId: number;
  longitude: number;
  latitude: number;
  dateTime: Date;
};
