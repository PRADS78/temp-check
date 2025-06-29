import { setupServer } from "msw/node";
import { handlers } from "./apiHandler";

export const server = setupServer(...handlers);
