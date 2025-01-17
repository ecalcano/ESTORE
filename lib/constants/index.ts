export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Estore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 6;
export const signInDefaultValues = {
  email: "",
  password: "",
};
export const signUpDefaultValues = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "Eric Calcano",
  streetAddress: "1523 scriven ave",
  city: "Bellmore",
  postalCode: "11710",
  country: "USA",
};
