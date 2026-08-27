export interface ValidationErrors {
  fridge_number?: string;
  location?: string;
  description?: string;
  notify_to?: string;
}

export const validateForm = (values: {
  fridge_number: string;
  location: string;
  description: string;
  notify_to: string;
  id?: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!values.fridge_number) {
    errors.fridge_number = "Fridge number is required.";
  } else if (!/^[A-Za-z0-9]+$/.test(values.fridge_number)) {
    errors.fridge_number = "Fridge number must be alphanumeric characters.";
  }

  if (!values.location) {
    errors.location = "Location is required.";
  }

  if (!values.description) {
    errors.description = "Description is required.";
  }

  if (!values.notify_to) {
    errors.notify_to = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(values.notify_to)) {
    errors.notify_to = "Email is not valid.";
  }

  return errors;
};
