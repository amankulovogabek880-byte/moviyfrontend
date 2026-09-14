"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { PartnerTourDiscountsEditor } from "@/components/admin/PartnerTourDiscountsEditor";
import { PartnerPaymentTermsForm } from "@/components/admin/PartnerPaymentTermsForm";
import { PartnerUsersEditor } from "@/components/admin/PartnerUsersEditor";
import { BookingsTable } from "@/components/b2b/BookingsTable";
import { Button } from "@/components/shared/Button";
import { DownloadLink } from "@/components/shared/DownloadLink";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  useAdminPartner,
  useCreatePartner,
  useUpdatePartner,
  useSetPartnerActive,
} from "@/hooks/admin/usePartners";
import { useAdminBookings } from "@/hooks/admin/useBookings";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { PartnerFormValues } from "@/lib/schemas/partner";

export default function AdminPartnerDetailPage() {
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    data: partner,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useAdminPartner(params.id);
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner(params.id);
  const setActive = useSetPartnerActive(params.id);
  const bookings = useAdminBookings(isNew ? undefined : { partnerId: params.id });

  async function handleSubmit(values: PartnerFormValues) {
    setError(null);
    setSaved(false);
    try {
      if (isNew) {
        await createPartner.mutateAsync(values);
      } else {
        await updatePartner.mutateAsync(values);
        setSaved(true);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full rounded-xl2" />;
  if (!isNew && (isError || !partner)) {
    return (
      <ErrorMessage
        message={fetchError instanceof ApiError ? fetchError.message : t("common.networkError")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? t("admin.partnerForm.titleNew") : t("admin.partnerForm.titleEdit")}
        </h1>
        <div className="flex items-center gap-3">
          {!isNew && (
            <Link href={`/admin/partners/${params.id}/statement`} className="text-sm text-accent hover:underline">
              {t("admin.partnerForm.statementLink")}
            </Link>
          )}
          {!isNew && (
            <DownloadLink path={`admin/partners/${params.id}/contract`}>
              {t("admin.partnerForm.contractButton")}
            </DownloadLink>
          )}
          {!isNew && partner && (
            <Button
              variant={partner.isActive ? "danger" : "secondary"}
              isLoading={setActive.isPending}
              onClick={() => setActive.mutate(!partner.isActive)}
            >
              {partner.isActive ? t("admin.partnerForm.suspend") : t("admin.partnerForm.activate")}
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-success">{t("admin.tourForm.savedSuccess")}</p>}
      <PartnerForm
        isNew={isNew}
        defaultValues={partner ?? undefined}
        isSubmitting={createPartner.isPending || updatePartner.isPending}
        onSubmit={handleSubmit}
      />
      {!isNew && partner && <PartnerPaymentTermsForm partner={partner} />}
      {!isNew && partner && (
        <PartnerTourDiscountsEditor partnerId={partner.id} tourDiscounts={partner.tourDiscounts ?? []} />
      )}
      {!isNew && partner && <PartnerUsersEditor partnerId={partner.id} users={partner.users ?? []} />}
      {!isNew && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">{t("admin.partnerForm.bookingHistory")}</h2>
          {bookings.isLoading ? (
            <Skeleton className="h-48 w-full rounded-xl2" />
          ) : (
            <BookingsTable bookings={bookings.data?.items ?? []} />
          )}
        </div>
      )}
    </div>
  );
}
