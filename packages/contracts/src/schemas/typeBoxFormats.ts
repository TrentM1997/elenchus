import { FormatRegistry } from "@sinclair/typebox";
import { formatsConfig } from "./formats.js";

FormatRegistry.Set("email", (value) => formatsConfig.email.test(value));
FormatRegistry.Set("uuid", (value) => formatsConfig.uuid.test(value));
