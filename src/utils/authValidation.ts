export type LoginField = "email" | "password";
export type RegisterField =
  | "firstName"
  | "lastName"
  | "email"
  | "password"
  | "confirmPassword";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string => {
  if (!email) return "Email address is required";
  if (!emailPattern.test(email)) return "Please enter a valid email address";
  return "";
};

export const validateName = (name: string, label: "First name" | "Last name"): string => {
  if (!name.trim()) return `${label} is required`;
  return "";
};

export const validateLoginField = (field: LoginField, value: string): string => {
  if (field === "email") {
    return validateEmail(value);
  }

  if (!value) return "Password is required";
  return "";
};

export const validateLoginForm = (
  email: string,
  password: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = validateLoginField("email", email);
  const passwordError = validateLoginField("password", password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
};

export const validateRegisterField = (
  field: RegisterField,
  value: string,
  password: string
): string => {
  if (field === "firstName") {
    return validateName(value, "First name");
  }

  if (field === "lastName") {
    return validateName(value, "Last name");
  }

  if (field === "email") {
    return validateEmail(value);
  }

  if (field === "password") {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    return "";
  }

  if (value !== password) return "Passwords do not match";
  return "";
};

export const validateRegisterForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const firstNameError = validateRegisterField("firstName", firstName, password);
  const lastNameError = validateRegisterField("lastName", lastName, password);
  const emailError = validateRegisterField("email", email, password);
  const passwordError = validateRegisterField("password", password, password);
  const confirmPasswordError = validateRegisterField(
    "confirmPassword",
    confirmPassword,
    password
  );

  if (firstNameError) errors.firstName = firstNameError;
  if (lastNameError) errors.lastName = lastNameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};