export type Department = {
  id: string;
  name: string;
  createdAt: string;
};

export type CompanySettings = {
  name: string;
  logoUrl: string;
  slogan: string;
};

/** Slug for a spoken language (preset or custom). */
export type SpokenLanguage = string;

export type Language = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export type Employee = {
  id: string;
  name: string;
  bio: string;
  position: string;
  departmentId: string;
  email: string;
  photoUrl: string;
  phone: string;
  telegram: string;
  facebook: string;
  tiktok: string;
  linkedin: string;
  spokenLanguages: SpokenLanguage[];
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type StoreData = {
  company: CompanySettings;
  departments: Department[];
  languages?: Language[];
  employees: Employee[];
};

export type EmployeeInput = {
  name: string;
  bio: string;
  position: string;
  departmentId: string;
  email: string;
  photoUrl?: string;
  phone: string;
  telegram: string;
  facebook: string;
  tiktok: string;
  linkedin: string;
  spokenLanguages: SpokenLanguage[];
};

export type CompanyInput = {
  name: string;
  logoUrl?: string;
  slogan: string;
};
