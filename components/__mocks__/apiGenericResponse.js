import { response, context } from "msw";

const res = (...transformers) => {
  if (process.env.NODE_ENV === "test") {
    return response(...transformers);
  } else {
    return response(...transformers, context.delay());
  }
};

export { res };
