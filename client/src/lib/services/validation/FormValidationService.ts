import {
  FormatConfigType,
  formatsConfig,
} from "@elenchus/contracts/schemas/formats";

export interface IFormInputValidationService {
  emailInput(input: string): { ok: boolean; data: string };
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
}

export const formInputValidator = new FormInputValidationService(formatsConfig);
