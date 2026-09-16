"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TourForm } from "@/components/admin/TourForm";
import { DepartureEditor, DepartureDraftList } from "@/components/admin/DepartureEditor";
import { PriceTiersEditor, RoomTypesEditor } from "@/components/admin/PricingOptionsEditor";
import { AddOnsEditor } from "@/components/admin/AddOnsEditor";
import { TourImagesEditor } from "@/components/admin/TourImagesEditor";
import { TourVisibilityEditor } from "@/components/admin/TourVisibilityEditor";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAdminTour, useCreateTour, useUpdateTour } from "@/hooks/admin/useTours";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import { proxyApi } from "@/lib/api-proxy-client";
import type { TourFormValues, DepartureFormValues } from "@/lib/schemas/tour";

export default function AdminTourEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = params.id === "new";
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [draftDepartures, setDraftDepartures] = useState<DepartureFormValues[]>([]);

  const {
    data: tour,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useAdminTour(params.id);
  const createTour = useCreateTour();
  const updateTour = useUpdateTour(params.id);

  useEffect(() => {
    const departureErrors = searchParams.get("departureErrors");
    if (departureErrors) {
      setError(`${t("admin.tourForm.savedWithDepartureErrors")}: ${departureErrors}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(values: TourFormValues) {
    setError(null);
    setSaved(false);
    try {
      if (isNew) {
        const created = await createTour.mutateAsync(values);
        const failedDepartures: string[] = [];
        for (const departure of draftDepartures) {
          try {
            await proxyApi.post(`admin/tours/${created.id}/departures`, departure);
          } catch (departureError) {
            failedDepartures.push(
              `${departure.departureDate} (${
                departureError instanceof ApiError
                  ? departureError.message
                  : t("common.networkError")
              })`
            );
          }
        }
        const query =
          failedDepartures.length > 0
            ? `?departureErrors=${encodeURIComponent(failedDepartures.join("; "))}`
            : "";
        router.push(`/admin/tours/${created.id}${query}`);
      } else {
        await updateTour.mutateAsync(values);
        setSaved(true);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full rounded-xl2" />;
  if (!isNew && (isError || !tour)) {
    return (
      <ErrorMessage
        message={fetchError instanceof ApiError ? fetchError.message : t("common.networkError")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">
        {isNew ? t("admin.tourForm.titleNew") : t("admin.tourForm.titleEdit")}
      </h1>
      {error && <p className="text-sm text-danger">{error}</p>}
      {saved && <p className="text-sm text-success">{t("admin.tourForm.savedSuccess")}</p>}
      <TourForm
        defaultValues={tour ?? undefined}
        isSubmitting={createTour.isPending || updateTour.isPending}
        onSubmit={handleSubmit}
      />
      {isNew ? (
        <DepartureDraftList value={draftDepartures} onChange={setDraftDepartures} />
      ) : (
        tour && <DepartureEditor tourId={tour.id} departures={tour.departures} />
      )}
      {!isNew && tour && (
        <PriceTiersEditor tourId={tour.id} priceTiers={tour.priceTiers ?? []} />
      )}
      {!isNew && tour && <RoomTypesEditor tourId={tour.id} roomTypes={tour.roomTypes ?? []} />}
      {!isNew && tour && <AddOnsEditor tourId={tour.id} addOns={tour.addOns ?? []} />}
      {!isNew && tour && <TourImagesEditor tourId={tour.id} images={tour.images ?? []} />}
      {!isNew && tour && <TourVisibilityEditor tour={tour} />}
    </div>
  );
}