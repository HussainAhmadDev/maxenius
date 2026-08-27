export interface ValidationErrors {
  fridge_id?: string;
  min_temp?: string;
  max_temp?: string;
  room_temp?: string;
  notes?: string;
}

export const validateForm = (values: {
  fridge_id: string;
  min_temp: string;
  max_temp: string;
  room_temp: string;
  notes: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!values.fridge_id) {
    errors.fridge_id = "Fridge number is required.";
  } else if (!/^[A-Za-z0-9]+$/.test(values.fridge_id)) {
    errors.fridge_id = "Fridge number must be alphanumeric characters.";
  }

  if (!values.min_temp) {
    errors.min_temp = "min temp is required.";
  }

  if (!values.max_temp) {
    errors.max_temp = "max temp is required.";
  }

  if (!values.room_temp) {
    errors.room_temp = "room temp is required.";
  }

  if (!values.max_temp) {
    errors.max_temp = "max temp is required.";
  }

  if (!values.notes) {
    errors.notes = "notes is required.";
  }

  return errors;
};
