import * as React from "react";
import Layout from "Components/layout";
import ContactForm from "Components/Customer/Contacts/ContactForm";

export const CreateContact: React.FC = () => {
  return (
    <Layout title="Add Contact">
      <ContactForm />
    </Layout>
  );
};

export default CreateContact;
