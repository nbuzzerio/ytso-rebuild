import * as yup from "yup";

const signInSchema = yup.object({
  email: yup
    .string()
    .max(255, "Email is too long.")
    .email("Please enter a valid email.")
    .required("Please enter your email."),
  password: yup
    .string()
    .required("Please enter your Password.")
    .min(5, "Password is too short.")
    .max(100, "Password is too long."),
});

export default signInSchema;
