import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  contactsFromEmployee,
  legacyFieldsFromContacts,
  sanitizeContacts,
} from "./contacts";
import { normalizeSpokenLanguages } from "./languages";
import { uniqueSlug } from "./slug";
import type {
  CompanyInput,
  CompanySettings,
  Department,
  Employee,
  EmployeeInput,
  StoreData,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

const defaultCompany = (): CompanySettings => ({
  name: "SANDAI",
  logoUrl: "/sandai-logo.png",
  slogan: "SMART STRATEGY STRONGER TOMORROW",
});

function normalizeEmployee(raw: Record<string, unknown>, fallbackDeptId = ""): Employee {
  const name = String(raw.name ?? "").trim();
  const now = new Date().toISOString();
  const bio = String(raw.bio ?? raw.bioEn ?? raw.subtitle ?? "").trim();
  const position = String(raw.position ?? raw.positionEn ?? "").trim();
  const base = {
    id: String(raw.id ?? randomUUID()),
    name,
    bio,
    position,
    departmentId: String(raw.departmentId ?? fallbackDeptId),
    email: String(raw.email ?? "").trim(),
    photoUrl: String(raw.photoUrl ?? raw.logoUrl ?? "").trim(),
    phone: String(raw.phone ?? raw.personalContact ?? "").trim(),
    telegram: String(raw.telegram ?? "").trim(),
    facebook: String(raw.facebook ?? "").trim(),
    tiktok: String(raw.tiktok ?? "").trim(),
    linkedin: String(raw.linkedin ?? "").trim(),
    contacts: Array.isArray(raw.contacts)
      ? sanitizeContacts(raw.contacts as NonNullable<Employee["contacts"]>)
      : [],
    spokenLanguages: normalizeSpokenLanguages(raw.spokenLanguages),
    slug: String(raw.slug ?? "").trim() || uniqueSlug(name || "employee", []),
    createdAt: String(raw.createdAt ?? now),
    updatedAt: String(raw.updatedAt ?? now),
  };
  const contacts = contactsFromEmployee(base).filter((item) => item.value);
  const legacy = legacyFieldsFromContacts(contacts);
  return { ...base, ...legacy, contacts };
}

function normalizeStore(raw: Record<string, unknown>): StoreData {
  const companyRaw = (raw.company as Record<string, unknown> | undefined) ?? {};
  const departments = Array.isArray(raw.departments)
    ? (raw.departments as Department[])
    : [];
  const employeesRaw = Array.isArray(raw.employees) ? raw.employees : [];
  const employees = employeesRaw.map((item) =>
    normalizeEmployee(item as Record<string, unknown>, departments[0]?.id ?? ""),
  );

  // Ensure unique slugs after migration
  const used: string[] = [];
  for (const employee of employees) {
    const slug = uniqueSlug(
      employee.slug || employee.name,
      used.map((s) => `x::${s}`),
    );
    employee.slug = slug;
    used.push(slug);
  }

  return {
    company: {
      name: String(companyRaw.name ?? "SANDAI").trim() || "SANDAI",
      logoUrl: String(companyRaw.logoUrl ?? "/sandai-logo.png").trim() || "/sandai-logo.png",
      slogan:
        String(companyRaw.slogan ?? "SMART STRATEGY STRONGER TOMORROW").trim() ||
        "SMART STRATEGY STRONGER TOMORROW",
    },
    departments,
    employees,
  };
}

const seedData = (): StoreData => {
  const now = new Date().toISOString();
  const departments: Department[] = [
    { id: randomUUID(), name: "Executive", createdAt: now },
    { id: randomUUID(), name: "Engineering", createdAt: now },
    { id: randomUUID(), name: "Marketing", createdAt: now },
    { id: randomUUID(), name: "People & Culture", createdAt: now },
  ];

  const employees: Employee[] = [
    {
      id: randomUUID(),
      name: "Bobby Tandy",
      bio: "Hello! Welcome to my digital namecard. Feel free to reach out anytime.",
      position: "Project manager",
      departmentId: departments[2].id,
      email: "bobby.tandy@sandai.com",
      photoUrl: "",
      phone: "096 7777 256",
      telegram: "t.me/bobby.tandy",
      facebook: "www.facebook.com/bobby.tandy",
      tiktok: "www.tiktok.com/@bobby_tandy",
      linkedin: "www.linkedin.com/in/bobbytandy",
      spokenLanguages: ["khmer", "english", "chinese"],
      slug: "bobby-tandy",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      name: "Ava Chen",
      bio: "Building the next chapter with people and process.",
      position: "Chief Operating Officer",
      departmentId: departments[0].id,
      email: "ava.chen@sandai.com",
      photoUrl: "",
      phone: "+1 415 555 0142",
      telegram: "",
      facebook: "",
      tiktok: "",
      linkedin: "www.linkedin.com/in/avachen",
      spokenLanguages: ["english", "chinese"],
      slug: "ava-chen",
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    company: defaultCompany(),
    departments,
    employees,
  };
};

async function ensureStore(): Promise<StoreData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const normalized = normalizeStore(JSON.parse(raw) as Record<string, unknown>);
    await writeStore(normalized);
    return normalized;
  } catch {
    const seeded = seedData();
    await writeStore(seeded);
    return seeded;
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function getStore(): Promise<StoreData> {
  return ensureStore();
}

export async function getCompany(): Promise<CompanySettings> {
  const store = await ensureStore();
  return store.company;
}

export async function updateCompany(input: CompanyInput): Promise<CompanySettings> {
  const store = await ensureStore();
  const name = input.name.trim();
  if (!name) throw new Error("Company name is required");
  store.company = {
    name,
    logoUrl: input.logoUrl?.trim() ?? store.company.logoUrl,
    slogan: input.slogan.trim(),
  };
  await writeStore(store);
  return store.company;
}

export async function listDepartments(): Promise<Department[]> {
  const store = await ensureStore();
  return store.departments.sort((a, b) => a.name.localeCompare(b.name));
}

export async function createDepartment(name: string): Promise<Department> {
  const store = await ensureStore();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Department name is required");
  if (store.departments.some((d) => d.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error("Department already exists");
  }
  const department: Department = {
    id: randomUUID(),
    name: trimmed,
    createdAt: new Date().toISOString(),
  };
  store.departments.push(department);
  await writeStore(store);
  return department;
}

export async function updateDepartment(id: string, name: string): Promise<Department> {
  const store = await ensureStore();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Department name is required");
  const index = store.departments.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Department not found");
  if (
    store.departments.some(
      (d) => d.id !== id && d.name.toLowerCase() === trimmed.toLowerCase(),
    )
  ) {
    throw new Error("Department already exists");
  }
  store.departments[index] = { ...store.departments[index], name: trimmed };
  await writeStore(store);
  return store.departments[index];
}

export async function deleteDepartment(id: string): Promise<void> {
  const store = await ensureStore();
  const inUse = store.employees.some((e) => e.departmentId === id);
  if (inUse) throw new Error("Cannot delete a department that still has employees");
  store.departments = store.departments.filter((d) => d.id !== id);
  await writeStore(store);
}

export async function listEmployees(): Promise<Employee[]> {
  const store = await ensureStore();
  return store.employees.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getEmployee(id: string): Promise<Employee | null> {
  const store = await ensureStore();
  return store.employees.find((e) => e.id === id) ?? null;
}

export async function getEmployeeBySlug(slug: string): Promise<Employee | null> {
  const store = await ensureStore();
  const normalized = slug.trim().toLowerCase();
  return store.employees.find((e) => e.slug.toLowerCase() === normalized) ?? null;
}

function validateEmployeeInput(input: EmployeeInput, store: StoreData) {
  if (!input.name.trim()) throw new Error("Name is required");
  if (!input.email.trim()) throw new Error("Email is required");
  if (!input.position.trim()) throw new Error("Position is required");
  if (!input.departmentId) throw new Error("Department is required");
  if (!store.departments.some((d) => d.id === input.departmentId)) {
    throw new Error("Invalid department");
  }
}

function buildEmployeeFields(input: EmployeeInput, store: StoreData, current?: Employee) {
  const slug = uniqueSlug(
    current?.slug || input.name,
    store.employees.map((e) => `${e.id}::${e.slug}`),
    current?.id,
  );

  const fromInput = sanitizeContacts(input.contacts ?? []);
  const contacts =
    fromInput.length > 0
      ? fromInput
      : contactsFromEmployee({
          id: current?.id ?? "",
          name: input.name,
          bio: input.bio,
          position: input.position,
          departmentId: input.departmentId,
          email: input.email,
          photoUrl: input.photoUrl ?? "",
          phone: input.phone ?? current?.phone ?? "",
          telegram: input.telegram ?? current?.telegram ?? "",
          facebook: input.facebook ?? current?.facebook ?? "",
          tiktok: input.tiktok ?? current?.tiktok ?? "",
          linkedin: input.linkedin ?? current?.linkedin ?? "",
          spokenLanguages: [],
          slug: "",
          createdAt: "",
          updatedAt: "",
        }).filter((item) => item.value);
  const legacy = legacyFieldsFromContacts(contacts);

  return {
    name: input.name.trim(),
    bio: input.bio.trim(),
    position: input.position.trim(),
    departmentId: input.departmentId,
    email: input.email.trim(),
    photoUrl: input.photoUrl?.trim() ?? current?.photoUrl ?? "",
    ...legacy,
    contacts,
    spokenLanguages: normalizeSpokenLanguages(input.spokenLanguages),
    slug,
  };
}

export async function createEmployee(input: EmployeeInput): Promise<Employee> {
  const store = await ensureStore();
  validateEmployeeInput(input, store);
  const now = new Date().toISOString();
  const employee: Employee = {
    id: randomUUID(),
    ...buildEmployeeFields(input, store),
    createdAt: now,
    updatedAt: now,
  };
  store.employees.push(employee);
  await writeStore(store);
  return employee;
}

export async function updateEmployee(
  id: string,
  input: EmployeeInput,
): Promise<Employee> {
  const store = await ensureStore();
  validateEmployeeInput(input, store);
  const index = store.employees.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Employee not found");
  const updated: Employee = {
    ...store.employees[index],
    ...buildEmployeeFields(input, store, store.employees[index]),
    updatedAt: new Date().toISOString(),
  };
  store.employees[index] = updated;
  await writeStore(store);
  return updated;
}

export async function deleteEmployee(id: string): Promise<void> {
  const store = await ensureStore();
  store.employees = store.employees.filter((e) => e.id !== id);
  await writeStore(store);
}
