import * as yup from "yup";

const searchSchema = yup.object({
  search: yup.string().max(255, "search query is too long"),
});

export default searchSchema;
