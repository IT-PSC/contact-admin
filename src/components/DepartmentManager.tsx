"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Department } from "@/lib/types";
import { EmptyState } from "./EmptyState";

export function DepartmentManager({
  departments,
  employeeCounts,
}: {
  departments: Department[];
  employeeCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function createDepartment(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(id: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this department?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr]">
      <form onSubmit={createDepartment} className="surface animate-rise h-fit space-y-4 p-6">
        <div>
          <h2 className="type-section">
            Add department
          </h2>
          <p className="type-helper mt-1 text-[var(--muted)]">
            Keep departments short and clear so employee forms stay easy to scan.
          </p>
        </div>
        <label className="block space-y-2">
          <span className="type-label text-[var(--muted)]">Department name</span>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marketing"
            required
          />
        </label>
        {error ? (
          <p className="type-body rounded-xl bg-[#fff5f4] px-4 py-3 text-[var(--danger)]">{error}</p>
        ) : null}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving..." : "Add department"}
        </button>
      </form>

      <div className="space-y-3">
        {departments.length === 0 ? (
          <EmptyState
            title="No departments yet"
            description="Create departments first, then assign them when adding employees."
          />
        ) : (
          <div className="stagger space-y-3">
            {departments.map((department) => {
              const count = employeeCounts[department.id] ?? 0;
              const isEditing = editingId === department.id;
              return (
                <article key={department.id} className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <input
                        className="field"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <h3 className="type-card-title">
                          {department.name}
                        </h3>
                        <p className="type-helper mt-1 text-[var(--muted)]">
                          {count} {count === 1 ? "employee" : "employees"}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={busy}
                          onClick={() => saveEdit(department.id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            setEditingId(department.id);
                            setEditingName(department.name);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={busy}
                          onClick={() => remove(department.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
