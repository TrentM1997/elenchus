type FormatLabel = "uuid" | "email" | "specialCharacter";

export type FormatConfigType = Record<FormatLabel, RegExp>;

export const formatsConfig = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  specialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
} as const satisfies FormatConfigType;
