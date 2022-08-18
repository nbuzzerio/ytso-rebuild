import { rest } from "msw";

export const handlers = [
  rest.get(
    "http://localhost:3000/api/products",
    (req, res, ctx) => {
      return res(ctx.json());
    }
  ),
];
