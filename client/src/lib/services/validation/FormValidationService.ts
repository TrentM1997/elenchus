import {
  FormatConfigType,
  formatsConfig,
} from "@elenchus/contracts/schemas/formats";

const specialChars = new Set("@$!%*?&_#-=+[]{}|;:',.<>/\\");

export interface IFormInputValidationService {
  emailInput(input: string): { ok: boolean; data: string };
  passwordInput(input: string): { ok: boolean; data: string };
  messageInput(input: string): { ok: boolean; data: string };
}

export class FormInputValidationService implements IFormInputValidationService {
  constructor(private readonly formats: FormatConfigType) {}

  public emailInput(input: string): { ok: boolean; data: string } {
    const valid = this.formats.email.test(input);
    return {
      ok: valid,
      data: input,
    };
  }

  public passwordInput(input: string): { ok: boolean; data: string } {
    return this.checkPassword(input);
  }

  public messageInput(input: string): { ok: boolean; data: string } {
    if (input === "" || input.length < 2) {
      return {
        ok: false,
        data: input,
      };
    }

    return {
      ok: true,
      data: input,
    };
  }

  private checkPassword(password: string) {
    const hasSpecialCharacters = this.hasSpecialCharacters(password);
    const validLength = password.length >= 8;

    if (hasSpecialCharacters && validLength) {
      return {
        ok: true,
        data: password,
      };
    } else {
      return {
        ok: false,
        data: password,
      };
    }
  }

  private hasSpecialCharacters(password: string) {
    for (const char of password) {
      if (specialChars.has(char)) return true;
    }
    return false;
  }
}

export const formInputValidator = new FormInputValidationService(formatsConfig);
