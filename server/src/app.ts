import "./Config.js";
import { PORT } from "./Config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { responseBinder } from "../core/middleware/responseBinder.js";
import { globalErrorHandler } from "../core/middleware/globalErrorHandler.js";
import { createRouter } from "../core/routes/createRouter.js";
import { AppServices } from "../services/appServices.js";
import { apiContractConfig } from "@elenchus/contracts";
import { corsOptions } from "./corsConfig.ts";

app.use(responseBinder);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(createRouter({ app: new AppServices(), contract: apiContractConfig }));

app.use(globalErrorHandler);

app.listen(PORT, () => {
  return console.log(`Express is listening at ${PORT}`);
});
