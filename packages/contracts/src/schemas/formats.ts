type FormatLabel = "uuid" | "email" | "specialCharacter" | "httpUrl";

type FormatValidator = RegExp | ((value: string) => boolean);

export type FormatConfigType = Record<FormatLabel, FormatValidator>;

export const formatsConfig = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  specialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
  httpUrl: (value: string): boolean => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
} as const satisfies FormatConfigType;
