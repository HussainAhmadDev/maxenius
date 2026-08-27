import { FileType } from '@/components/editor/types';

export interface Project {
  id: string | number;
  name: number;
  projectName: string;
  status: string;
  location: string;
  sales: string;
  action: JSX.Element[];
  locked?: boolean;
  have_pdf?: null | number;
}
export interface ProjectResponse {
  id: string | number;
  name: number;
  status: 'open' | 'finished';
  file: null;
  editRestricted: null;
  owner: null;
  editors: null;
  customer_data: CustomerData;
  assembler_data: AssemblerData;
  created_at: '2024-03-22T06:33:06.983095+00:00';
  project_data: ProjectData;
  misc: MiscData | null;
  locked: boolean;
  have_pdf: null | number;
}

export interface CustomerData {
  created_at: any;
  id: any;
  email: string;
  company: string;
  country: string;
  zipCode: string;
  address1: string;
  address2: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  projectName: string;
}
export interface AssemblerData {
  email: string;
  company: string;
  country: string;
  zipCode: string;
  address1: string;
  address2: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
}

export interface ProjectData {
  pitch: number;
  holder: number;
  coating: string;
  profile: string;
  wallWidth: number;
  aDimension: number;
  cDimension: number;
  specialColor: number;
  externalOffset: number;
  internalOffset: number;
  endCapTailLength: number;
  materialThickness: number;
}

export interface MiscData {
  file: File;
  note: string;
}

export interface ProjectDetails {
  id: string;
  editRestricted: boolean;
  editors: string[];
  file: FileType;
  name: string;
  owner: string;
  customer: CustomerData;
  assembler: AssemblerData;
  project_attributes: ProjectData;
  misc: MiscData | null;
  locked: boolean;
  have_pdf?: null | number;
}
