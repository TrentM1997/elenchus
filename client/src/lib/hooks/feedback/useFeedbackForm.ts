import { assertNever } from "@/lib/helpers/asserts/assertNever";
import {
  declineFeedBack,
  recordFeedback,
} from "@/state/Reducers/Feedback/FeedbackSlice";
import { submitFeedback } from "@/state/Reducers/Feedback/thunks";
import { renderModal } from "@/state/Reducers/Overlay/PipelineSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formInputValidator } from "@/lib/services/validation/FormValidationService";

export const useFeedbackForm = () => {
  const activeSession = useSelector(
    (state: RootState) => state.auth.userKind === "authenticated",
  );
  const formState = useSelector((s: RootState) => s.feedback.form);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const email = formState.status === "ready" ? formState.data.email.trim() : "";
  const message =
    formState.status === "ready" ? formState.data.message.trim() : "";
  const validationError = !message
    ? "Please enter a message."
    : !activeSession && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Please enter a valid email address."
      : null;
  const inputErrors = attemptedSubmit ? validationError : null;
  const dispatch = useDispatch<AppDispatch>();

  const decline = () => {
    dispatch(declineFeedBack());
    dispatch(renderModal(null));
  };

  const sendFeedback = async () => {
    setAttemptedSubmit(true);
    if (formState.status !== "ready" || validationError) {
      return;
    }
    void dispatch(
      submitFeedback({
        email,
        message,
      }),
    );
  };

  const recordMessage = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { ok, data } = formInputValidator.messageInput(e.target.value);

      if (!ok) {
      }

      switch (formState.status) {
        case "initial":
          return;
        case "showing": {
          dispatch(
            recordFeedback({
              status: "ready",
              data: { email: "", message: data },
            }),
          );
          return;
        }
        case "ready": {
          const current = formState.data.email;
          dispatch(
            recordFeedback({
              status: "ready",
              data: { email: current, message: data },
            }),
          );
          return;
        }

        default: {
          return assertNever(formState);
        }
      }
    },
    [formState],
  );

  const recordEmailInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      switch (formState.status) {
        case "initial":
          return;
        case "showing": {
          dispatch(
            recordFeedback({
              status: "ready",
              data: { email: value, message: "" },
            }),
          );
          return;
        }
        case "ready": {
          const current = formState.data.message;
          dispatch(
            recordFeedback({
              status: "ready",
              data: { email: value, message: current },
            }),
          );
          return;
        }

        default: {
          return assertNever(formState);
        }
      }
    },
    [formState],
  );

  return {
    activeSession,
    recordEmailInput,
    recordMessage,
    sendFeedback,
    decline,
    inputErrors,
  };
};
