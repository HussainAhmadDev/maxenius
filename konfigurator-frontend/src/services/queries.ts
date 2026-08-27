export const SupabaseTableNames = {
  project: 'projects',
  customer: 'customer',
  assembler: 'assembler',
  project_attributes: 'project_attributes',
  misc: 'misc',
  pdf: 'pdf',
  pdfProfile: 'pdf_profile',
};

export const LIST_QUERY = `
id,
status,
locked,
have_pdf:  file->pdf->0->pdf_data->0->0->am,
customer (
  name, 
  address1, 
  address2
),
assembler (
  firstName, 
  lastName
)
where status = 'done'
`;

export const PROJECT_DETAILS_QUERY = `
id,
status,
*,
customer (*),
assembler (*),
project_attributes(*),
misc (*)
`;

export const DETAILS_QUERY = `
id,
status,
customer (
  name,
  address1,
  address2,
  city,
  state,
  zipCode,
  country,
  phone,
  email,
  ),
  assembler (
    firstName,
    lastName,
    email,
    phone,
  )
)`;
