"use client";

import { useMemo, useState } from "react";
import { useUpdateTourVisibility } from "@/hooks/admin/useTours";
import { useAdminPartners } from "@/hooks/admin/usePartners";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import type { Tour, TourVisibility } from "@/types/tour";

export function TourVisibilityEditor({ tour }: { tour: Tour }) {
  const [visibility, setVisibility] = useState<TourVisibility>(
    tour.visibility ?? "ALL_PARTNERS"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(tour.visiblePartnerIds ?? []);
  const [search, setSearch] = useState("");
  const { data: partners } = useAdminPartners();
  const updateVisibility = useUpdateTourVisibility(tour.id);

  const filteredPartners = useMemo(() => {
    const items = partners?.items ?? [];
    if (!search.trim()) return items;
    return items.filter((p) => p.companyName.toLowerCase().includes(search.toLowerCase()));
  }, [partners, search]);

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function save() {
    await updateVisibility.mutateAsync({
      visibility,
      partnerIds: visibility === "SELECTED_PARTNERS" ? selectedIds : [],
    });
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.visibility")}</h2>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={visibility === "ALL_PARTNERS"}
            onChange={() => setVisibility("ALL_PARTNERS")}
          />
          {t("admin.tourForm.visibilityAll")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={visibility === "SELECTED_PARTNERS"}
            onChange={() => setVisibility("SELECTED_PARTNERS")}
          />
          {t("admin.tourForm.visibilitySelected")}
        </label>

        {visibility === "SELECTED_PARTNERS" && (
          <div className="ml-6 flex flex-col gap-2">
            <Input
              placeholder={t("admin.tourForm.visibilitySearchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <div className="max-h-56 overflow-y-auto rounded-lg border border-border p-2">
              {filteredPartners.map((partner) => (
                <label
                  key={partner.id}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(partner.id)}
                    onChange={() => toggle(partner.id)}
                  />
                  {partner.companyName}
                </label>
              ))}
              {filteredPartners.length === 0 && (
                <p className="px-2 py-1.5 text-sm text-muted">{t("common.noResults")}</p>
              )}
            </div>
          </div>
        )}

        <Button
          className="self-start"
          isLoading={updateVisibility.isPending}
          onClick={save}
        >
          {t("admin.tourForm.saveVisibility")}
        </Button>
      </div>
    </section>
  );
}
