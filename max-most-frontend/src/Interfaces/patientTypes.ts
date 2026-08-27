export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  address: string;
  prescriber: string;
  prescriber_email: string;
  prescriber_phone: string;
}

export interface PatientResponse {
  page: number | undefined;
  count: number;
  pages: number;
  total: string;
  results: Patient[] | undefined;
}
