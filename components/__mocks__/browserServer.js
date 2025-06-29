import { setupWorker } from "msw";
import { handlers } from "./apiHandler";

export const worker = setupWorker(...handlers);
