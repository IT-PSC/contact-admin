"use client";

import { useMemo, useState } from "react";
import { spokenLanguageLabel } from "@/lib/languages";
import type { CompanySettings, Employee } from "@/lib/types";
import { ensureExternalHref } from "@/lib/vcard";

type Lang = "km" | "en" | "zh";

const labels: Record<
  Lang,
  {
    hello: string;
    name: string;
    position: string;
    department: string;
    email: string;
    personalContact: string;
    languagesKnown: string;
    addToContact: string;
    languages: { km: string; en: string; zh: string };
  }
> = {
  en: {
    hello: "HELLO! I'm",
    name: "NAME",
    position: "POSITION",
    department: "DEPARTMENT",
    email: "EMAIL",
    personalContact: "PERSONAL CONTACT",
    languagesKnown: "LANGUAGES",
    addToContact: "Add To Contact",
    languages: { km: "Khmer", en: "English", zh: "Chinese" },
  },
  km: {
    hello: "សួស្តី! ខ្ញុំឈ្មោះ",
    name: "ឈ្មោះ",
    position: "មុខតំណែង",
    department: "ផ្នែក",
    email: "អ៊ីមែល",
    personalContact: "ទំនាក់ទំនងផ្ទាល់ខ្លួន",
    languagesKnown: "ភាសា",
    addToContact: "បញ្ចូលទំនាក់ទំនង",
    languages: { km: "ខ្មែរ", en: "អង់គ្លេស", zh: "ចិន" },
  },
  zh: {
    hello: "你好！我是",
    name: "姓名",
    position: "职位",
    department: "部门",
    email: "邮箱",
    personalContact: "个人联系方式",
    languagesKnown: "语言能力",
    addToContact: "添加到通讯录",
    languages: { km: "高棉语", en: "英语", zh: "中文" },
  },
};

type Props = {
  employee: Employee;
  company: CompanySettings;
  departmentName: string;
};

function ContactIcon({ type }: { type: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };

  if (type === "phone") {
    return (
      <svg {...common}>
        <path
          d="M6.5 4.5h3l1.2 3-1.8 1.8a12 12 0 005.8 5.8l1.8-1.8 3 1.2v3A2 2 0 0117.5 20 13.5 13.5 0 014 6.5a2 2 0 012.5-2z"
          stroke="#D4AF37"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "telegram") {
    return (
      <svg {...common}>
        <path
          d="M21 4L3 11.5l6 2.2L17 8l-6.8 7.4 6.3 3.3L21 4z"
          stroke="#D4AF37"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg {...common}>
        <path
          d="M14 9h2.5V6H14a4 4 0 00-4 4v2H8v3h2v7h3v-7h2.2L16 12h-3v-1a1 1 0 011-1z"
          fill="#D4AF37"
        />
      </svg>
    );
  }
  if (type === "tiktok") {
    return (
      <svg {...common}>
        <path
          d="M14 4v9.2a3.3 3.3 0 11-2.4-3.2V7.2A5.7 5.7 0 0014 8V4h3.2A5.4 5.4 0 0120 7.5V10a8.2 8.2 0 01-6-2.4V18a5.5 5.5 0 11-5.5-5.5h.8V15h-.8a2.8 2.8 0 100 5.6A2.8 2.8 0 0014 17.8V4z"
          fill="#D4AF37"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M7 9.5A4.5 4.5 0 0111.5 5H14a4 4 0 010 8h-2M17 14.5A4.5 4.5 0 0112.5 19H10a4 4 0 010-8h2"
        stroke="#D4AF37"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NameCard({ employee, company, departmentName }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const t = labels[lang];

  const contacts = useMemo(
    () =>
      [
        employee.phone
          ? { type: "phone", label: employee.phone, href: ensureExternalHref(employee.phone, "phone") }
          : null,
        employee.telegram
          ? {
              type: "telegram",
              label: employee.telegram,
              href: ensureExternalHref(employee.telegram, "url"),
            }
          : null,
        employee.facebook
          ? {
              type: "facebook",
              label: employee.facebook,
              href: ensureExternalHref(employee.facebook, "url"),
            }
          : null,
        employee.tiktok
          ? {
              type: "tiktok",
              label: employee.tiktok,
              href: ensureExternalHref(employee.tiktok, "url"),
            }
          : null,
        employee.linkedin
          ? {
              type: "linkedin",
              label: employee.linkedin,
              href: ensureExternalHref(employee.linkedin, "url"),
            }
          : null,
      ].filter(Boolean) as { type: string; label: string; href: string }[],
    [employee],
  );

  const infoRows = [
    { label: t.name, value: employee.name },
    { label: t.position, value: employee.position },
    { label: t.department, value: departmentName },
    { label: t.email, value: employee.email },
  ];

  const sloganParts = company.slogan.trim().split(/\s+/);
  const firstWord = sloganParts[0] || "";
  const restSlogan = sloganParts.slice(1).join(" ");

  return (
    <div
      lang={lang === "zh" ? "zh" : lang}
      className="namecard mx-auto w-full max-w-[430px] overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.28)] bg-[#050505] text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
    >
      {/* Header */}
      <section className="relative bg-white px-6 pb-8 pt-7 text-center text-[#111]">
        <div className="mx-auto mb-5 flex flex-col items-center">
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-16 w-16 object-contain"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111] text-[#D4AF37]">
              {company.name.slice(0, 1)}
            </div>
          )}
          <p className="mt-2 text-[13px] font-bold tracking-[0.22em] text-[#1a1a1a]">
            {company.name}
          </p>
        </div>

        <div className="mx-auto mb-5 h-[128px] w-[128px] overflow-hidden rounded-full border-[3px] border-[#D4AF37] bg-[#f3f3f3] shadow-[0_10px_30px_rgba(212,175,55,0.25)]">
          {employee.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={employee.photoUrl}
              alt={employee.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#2a2a2a,#D4AF37)] text-[34px] font-bold text-black">
              {employee.name
                .split(" ")
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? "")
                .join("")}
            </div>
          )}
        </div>

        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-[#111]">
          {t.hello} {employee.name}.
        </h1>
        <p className="mx-auto mt-3 max-w-[320px] text-[14px] leading-relaxed text-[#444]">
          {employee.bio || `${employee.position} · ${company.name}`}
        </p>
      </section>

      {/* Dark info band with angled top */}
      <section className="relative -mt-1 bg-[linear-gradient(160deg,#0a0a0a_0%,#171717_55%,#0d0d0d_100%)] px-5 pb-8 pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-8 h-16 bg-[linear-gradient(160deg,#0a0a0a_0%,#171717_100%)]"
          style={{ clipPath: "polygon(0 55%, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"
        />

        <div className="relative space-y-3">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm"
            >
              <span className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-[#D4AF37]">
                {row.label}
              </span>
              <span className="truncate text-right text-[14px] font-medium text-white/95">
                {row.value}
              </span>
            </div>
          ))}

          {employee.spokenLanguages.length > 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#D4AF37]">
                {t.languagesKnown}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {employee.spokenLanguages.map((code) => (
                  <span
                    key={code}
                    className="rounded-full border border-[#D4AF37]/35 bg-black/35 px-3 py-1 text-[12px] font-medium text-[#F0D78C]"
                  >
                    {spokenLanguageLabel(code)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Slogan */}
      <section className="relative bg-[#f7f7f7] px-6 py-10 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #111 1px, transparent 1px), linear-gradient(225deg, #111 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <p className="relative text-[22px] font-extrabold uppercase leading-snug tracking-[0.04em] text-[#111]">
          <span className="text-[#D4AF37]">{firstWord}</span>
          {restSlogan ? ` ${restSlogan}` : ""}
        </p>
      </section>

      {/* Personal contacts */}
      <section className="bg-[linear-gradient(180deg,#111_0%,#050505_100%)] px-5 pb-6 pt-8">
        <h2 className="mb-4 text-center text-[15px] font-bold tracking-[0.16em] text-white">
          {t.personalContact}
        </h2>
        <div className="space-y-2.5">
          {contacts.length === 0 ? (
            <p className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-[13px] text-white/50">
              No personal contacts yet
            </p>
          ) : (
            contacts.map((item) => (
              <a
                key={`${item.type}-${item.label}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-3 py-2.5 transition hover:border-[#D4AF37]/50 hover:bg-white/12"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-black/40">
                  <ContactIcon type={item.type} />
                </span>
                <span className="truncate text-[13px] text-white/90">{item.label}</span>
              </a>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {(Object.keys(labels) as Lang[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                lang === code
                  ? "bg-[#D4AF37] text-black"
                  : "border border-white/15 bg-white/5 text-white/70 hover:border-[#D4AF37]/40"
              }`}
            >
              {t.languages[code]}
            </button>
          ))}
        </div>

        <a
          href={`/card/${employee.slug}/vcard`}
          className="mt-5 flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#F0D78C_0%,#D4AF37_50%,#A88720_100%)] px-5 py-3.5 text-[15px] font-bold text-black shadow-[0_12px_28px_rgba(212,175,55,0.35)] transition hover:brightness-105"
        >
          {t.addToContact}
        </a>
      </section>
    </div>
  );
}
