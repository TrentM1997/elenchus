import { createListenerMiddleware } from "@reduxjs/toolkit";
import { saveInvgestigation } from "./Reducers/Investigate/research/thunks";
import { renderToast } from "./Reducers/RenderingPipelines/PipelineSlice";
import {
  deleteAccount,
  loginUser,
  logOut,
  signUp,
} from "./Reducers/Athentication/thunks";
import { submitFeedback } from "./Reducers/Feedback/thunks";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: submitFeedback.pending,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "feedback", status: "pending" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: submitFeedback.rejected,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "feedback", status: "failed" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: submitFeedback.fulfilled,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "feedback", status: "success" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: saveInvgestigation.pending,
  effect: async (action, api) => {
    api.dispatch(
      renderToast({ status: "pending", kind: "save investigation" }),
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: saveInvgestigation.rejected,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "failed", kind: "save investigation" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: saveInvgestigation.fulfilled,
  effect: (action, api) => {
    api.dispatch(
      renderToast({ status: "success", kind: "save investigation" }),
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: loginUser.pending,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "pending", kind: "login" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: loginUser.rejected,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "failed", kind: "login" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "success", kind: "login" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: logOut.pending,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "pending", kind: "logout" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: logOut.rejected,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "failed", kind: "logout" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: logOut.fulfilled,
  effect: (action, api) => {
    api.dispatch(renderToast({ status: "success", kind: "logout" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: signUp.pending,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "signup", status: "pending" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: signUp.rejected,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "signup", status: "failed" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: signUp.fulfilled,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "signup", status: "success" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: deleteAccount.pending,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "delete account", status: "pending" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: deleteAccount.rejected,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "delete account", status: "failed" }));
  },
});

listenerMiddleware.startListening({
  actionCreator: deleteAccount.fulfilled,
  effect: (action, api) => {
    api.dispatch(renderToast({ kind: "delete account", status: "success" }));
  },
});
