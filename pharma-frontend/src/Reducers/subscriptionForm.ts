import { Form } from "Interfaces/Subscriptions";

export type Actions = {
  type: "MUTATE";
  payload: { form_id: string; field: string; value: string | number | boolean };
};

export const reducer = (state: Array<Form>, action: Actions) => {
  const { type, payload } = action;
  switch (type) {
    case "MUTATE":
      return state.map(form =>
        form.id === payload.form_id
          ? {
              ...form,
              fields: form.fields.map(field =>
                field.name === payload.field ? { ...field, value: payload.value } : field
              )
            }
          : form
      );
    default:
      return state;
  }
};
