export type JwtPayload = {
  email: String;
  id: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };


