"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/schemas/booking";
import { useBooking, useSubmitReview } from "@/hooks/b2c/useBooking";
import { useBookingContact } from "@/hooks/b2c/useBookingContact";
import { BookingContactGate } from "@/components/b2c/BookingContactGate";
import { StarRating } from "@/components/shared/StarRating";
import { Textarea } from "@/components/shared/Textarea";
import { Button } from "@/components/shared/Button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { Skeleton } from "@/components/shared/Skeleton";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";

export default function LeaveReviewPage() {
  const params = useParams<{ bookingNumber: string }>();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contact, setContact, hydrated } = useBookingContact(
    params.bookingNumber,
    searchParams.get("contact")
  );
  const {
    data: booking,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useBooking(params.bookingNumber, contact);
  const submitReview = useSubmitReview(params.bookingNumber);

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 5, comment: "" },
  });
  const rating = watch("rating");

  async function onSubmit(values: ReviewFormValues) {
    setError(null);
    try {
      await submitReview.mutateAsync(values);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("common.networkError"));
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <Skeleton className="h-64 w-full rounded-xl2" />
      </div>
    );
  }

  if (!contact) {
    return <BookingContactGate onSubmit={setContact} />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <Skeleton className="h-64 w-full rounded-xl2" />
      </div>
    );
  }

  if (isError || !booking) {
    const isNotFound = fetchError instanceof ApiError && fetchError.status === 404;
    if (isNotFound) {
      return <BookingContactGate onSubmit={setContact} error={t("b2c.booking.contactGateNotFound")} />;
    }
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <ErrorMessage
          message={fetchError instanceof ApiError ? fetchError.message : t("common.networkError")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h1 className="mt-4 font-display text-xl font-bold">{t("b2c.reviews.thankYouTitle")}</h1>
        <p className="mt-2 text-muted">{t("b2c.reviews.thankYouBody")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-2 font-display text-xl font-bold">{t("b2c.reviews.formTitle")}</h1>
      <p className="mb-6 text-sm text-muted">{booking.tour.title}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm font-medium">{t("b2c.reviews.ratingLabel")}</p>
          <StarRating value={rating} onChange={(v) => setValue("rating", v)} size="lg" />
          {errors.rating && <p className="mt-1 text-xs text-danger">{errors.rating.message}</p>}
        </div>
        <Textarea
          label={t("b2c.reviews.commentLabel")}
          error={errors.comment?.message}
          {...register("comment")}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" isLoading={submitReview.isPending} size="lg">
          {submitReview.isPending ? t("b2c.reviews.submitting") : t("b2c.reviews.submit")}
        </Button>
      </form>
    </div>
  );
}