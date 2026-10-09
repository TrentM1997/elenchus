import { useForm } from "react-hook-form";
import type { LoginCredentialsSchemaType } from "@elenchus/contracts/schemas/auth/AuthSchemas";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import { formInputValidator } from "@/lib/services/validation/FormValidationService";
import { loginUser } from "@/state/Reducers/Athentication/thunks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const status = useSelector((s: RootState) => s.auth.loginState.status);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentialsSchemaType>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const submitCredentials = async (credentials: LoginCredentialsSchemaType) => {
    await dispatch(loginUser(credentials));
  };

  const login = handleSubmit(submitCredentials);

  const { ref: emailInputRef, ...emailField } = register("email", {
    required: "Email is required",
    validate: (value) => {
      const { ok } = formInputValidator.emailInput(value);
      if (ok) {
        return true;
      } else {
        return "Please provide a valid email address";
      }
    },
  });

  const { ref: passwordInputRef, ...passwordField } = register("password", {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    validate: (value) => {
      const { ok } = formInputValidator.passwordInput(value);
      if (ok) {
        return true;
      } else {
        return "Password must be 8 characters long & have at least one special character";
      }
    },
  });

  useEffect(() => {
    if (status !== "success") return;

    const timer = window.setTimeout(() => {
      navigate("/");
    }, 800);

    return () => window.clearTimeout(timer);
  }, [status, navigate]);

  return {
    fields: {
      email: {
        ...emailField,
        inputRef: emailInputRef,
      },
      password: {
        ...passwordField,
        inputRef: passwordInputRef,
      },
    },
    status,
    pending: isSubmitting || status === "pending",
    errors,
    login,
  };
};
