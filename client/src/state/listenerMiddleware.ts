import { createListenerMiddleware } from "@reduxjs/toolkit";
import { saveInvgestigation } from "./Reducers/Investigate/research/thunks";
import { renderToast } from "./Reducers/RenderingPipelines/PipelineSlice";
import { loginUser, logOut } from "./Reducers/Athentication/thunks";

export const listenerMiddleware = createListenerMiddleware();

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
