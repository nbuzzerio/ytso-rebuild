import * as yup from "yup";

const signInSchema = yup.object({
  name: yup
    .string()
    .required("Please enter your name.")
    .min(3, "Name is too short.")
    .max(50, "Name is too long."),
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match.")
    .required("Please confirm your Password."),
});

export default signInSchema;
