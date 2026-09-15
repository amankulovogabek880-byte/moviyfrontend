"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Gallery } from "@/components/b2c/Gallery";
import { DepartureList } from "@/components/b2c/DepartureList";
import { BookingContactForm } from "@/components/b2c/BookingContactForm";
import { TravelerBookingForm } from "@/components/b2c/TravelerBookingForm";
import { WaitlistForm } from "@/components/b2c/WaitlistForm";
import { ReviewsSection } from "@/components/b2c/ReviewsSection";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/shared/Button";
import { useTour } from "@/hooks/b2c/useTour";
import { useCreateBooking } from "@/hooks/b2c/useBooking";
import { t } from "@/lib/i18n";
import { formatUsd } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import { storeBookingContact } from "@/lib/booking-contact";
import type { BookingContactFormValues, TravelerBookingFormValues } from "@/lib/schemas/booking";

export default function TourDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: tour, isLoading, isError, error, refetch } = useTour(params.slug);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const createBooking = useCreateBooking();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="aspect-[16/9] w-full rounded-xl2" />
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ErrorMessage
          message={error instanceof ApiError ? error.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const selectedDeparture = tour.departures.find((d) => d.id === selectedDepartureId) ?? null;
  const hasPricingOptions =
    (tour.priceTiers?.length ?? 0) > 0 || (tour.roomTypes?.length ?? 0) > 0;

  async function handleSimpleSubmit(values: BookingContactFormValues) {
    if (!selectedDeparture) return;
    if (values.paxCount > selectedDeparture.remainingSeats) {
      setFormError(t("b2c.tourDetail.notEnoughSeats"));
      return;
    }
    setFormError(null);
    try {
      const result = await createBooking.mutateAsync({
        tourDepartureId: selectedDeparture.id,
        paxCount: values.paxCount,
        addOnIds: values.addOnIds,
        contact: { fullName: values.fullName, phone: values.phone, email: values.email },
      });
      // Stash the contact used so the status page (which the person lands
      // on next) can call the public lookup endpoint without asking again.
      storeBookingContact(result.bookingNumber, values.email || values.phone);
      router.push(`/booking/${result.bookingNumber}`);
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  async function handleAdvancedSubmit(values: TravelerBookingFormValues) {
    if (!selectedDeparture) return;
    if (values.adultCount + values.childCount > selectedDeparture.remainingSeats) {
      setFormError(t("b2c.tourDetail.notEnoughSeats"));
      return;
    }
    setFormError(null);
    try {
      const result = await createBooking.mutateAsync({
        tourDepartureId: selectedDeparture.id,
        adultCount: values.adultCount,
        childCount: values.childCount,
        childAges: values.childAges,
        roomTypeId: values.roomTypeId || undefined,
        addOnIds: values.addOnIds,
        contact: { fullName: values.fullName, phone: values.phone, email: values.email },
      });
      storeBookingContact(result.bookingNumber, values.email || values.phone);
      router.push(`/booking/${result.bookingNumber}`);
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Gallery images={tour.images} alt={tour.title} />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            {tour.destination}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold">{tour.title}</h1>
          <p className="mt-4 text-muted">{tour.description}</p>

          {tour.itinerary.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl font-bold">
                {t("b2c.tourDetail.itinerary")}
              </h2>
              <ol className="flex flex-col gap-4">
                {tour.itinerary.map((day) => (
                  <li key={day.day} className="rounded-xl2 border border-border p-4">
                    <p className="text-sm font-semibold text-accent">
                      {day.day}-{t("b2c.tourDetail.day")}: {day.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">{day.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <ReviewsSection slug={tour.slug} />
        </div>

        <div className="h-fit rounded-xl2 border border-border p-5">
          <p className="text-2xl font-bold">{formatUsd(tour.basePrice)}</p>
          <p className="mb-4 text-sm text-muted">
            {tour.durationDays} {t("common.days")}
          </p>

          <h3 className="mb-2 text-sm font-semibold">{t("b2c.tourDetail.departures")}</h3>
          <DepartureList
            departures={tour.departures}
            basePrice={tour.basePrice}
            selectedId={selectedDepartureId}
            onSelect={(id) => {
              setSelectedDepartureId(id);
              setShowForm(true);
              setFormError(null);
            }}
          />

          {showForm && selectedDeparture && (
            <div className="mt-6 border-t border-border pt-6">
              {formError && <p className="mb-3 text-sm text-danger">{formError}</p>}
              {selectedDeparture.remainingSeats <= 0 ? (
                <WaitlistForm departureId={selectedDeparture.id} />
              ) : hasPricingOptions ? (
                <TravelerBookingForm
                  departureId={selectedDeparture.id}
                  roomTypes={tour.roomTypes ?? []}
                  addOns={tour.addOns ?? []}
                  isSubmitting={createBooking.isPending}
                  onSubmit={handleAdvancedSubmit}
                />
              ) : (
                <BookingContactForm
                  maxPax={selectedDeparture.remainingSeats}
                  addOns={tour.addOns ?? []}
                  isSubmitting={createBooking.isPending}
                  onSubmit={handleSimpleSubmit}
                />
              )}
            </div>
          )}

          {!showForm && (
            <Button
              className="mt-6 w-full"
              disabled={!selectedDeparture}
              onClick={() => setShowForm(true)}
            >
              {t("b2c.tourDetail.bookNow")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}