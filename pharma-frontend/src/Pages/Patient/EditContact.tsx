import * as React from "react";
import Layout from "../../Components/layout";
import EditContact from "../../Components/Customer/Contacts/ContactForm/EditContact";

export const CreateContact: React.FC = () => {
  return (
    <Layout title="Edit Contact">
      <EditContact />
    </Layout>
  );
};

export default CreateContact;
