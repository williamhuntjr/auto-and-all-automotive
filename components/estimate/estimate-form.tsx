"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";
import { submitEstimate, type EstimateState } from "@/app/(main)/contact/actions";
import { ESTIMATE_SERVICES } from "@/common/lib/estimate-services";
import { PhotoPicker } from "./photo-picker";
import { usePhotoAttachments } from "./use-photo-attachments";

const initialState: EstimateState = { status: "idle" };

export function EstimateForm() {
  const [state, action, pending] = useActionState(submitEstimate, initialState);
  const photoState = usePhotoAttachments();

  // The chosen (already resized) photos are added at submit time.
  const submit = (formData: FormData) => {
    formData.delete("photos");
    photoState.photos.forEach((photo) => formData.append("photos", photo.file));
    return action(formData);
  };

  if (state.status === "success") {
    return (
      <div className="estimateBox estimateSuccess" role="status">
        <CheckCircle2Icon size={44} aria-hidden="true" />
        <h2>Request sent</h2>
        <p>
          Thanks — your estimate request is on its way to the shop. We’ll
          review the details and get back to you using the phone number or
          email you provided.
        </p>
        <Link className="primary" href="/">
          Back to home <span>↗</span>
        </Link>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const invalid = (field: keyof typeof errors) =>
    errors[field] ? { "aria-invalid": true, "aria-describedby": `${field}-error` } : {};
  const fieldError = (field: keyof typeof errors) =>
    errors[field] && (
      <p className="fieldError" id={`${field}-error`}>
        {errors[field]}
      </p>
    );

  return (
    <form className="estimateBox" action={submit} noValidate>
      {state.status === "error" && state.message && (
        <p className="formNotice" role="alert">
          {state.message}
        </p>
      )}

      <label htmlFor="name">Your name</label>
      <input
        id="name"
        name="name"
        placeholder="Full name"
        autoComplete="name"
        maxLength={100}
        required
        defaultValue={values.name}
        {...invalid("name")}
      />
      {fieldError("name")}

      <label htmlFor="contact">Phone or email</label>
      <input
        id="contact"
        name="contact"
        placeholder="Best way to reach you"
        autoComplete="email"
        maxLength={150}
        required
        defaultValue={values.contact}
        {...invalid("contact")}
      />
      {fieldError("contact")}

      <label htmlFor="vehicle">Vehicle</label>
      <input
        id="vehicle"
        name="vehicle"
        placeholder="Year, make and model"
        maxLength={150}
        required
        defaultValue={values.vehicle}
        {...invalid("vehicle")}
      />
      {fieldError("vehicle")}

      <label htmlFor="service">Service needed</label>
      <select
        id="service"
        name="service"
        defaultValue={values.service ?? ESTIMATE_SERVICES[0]}
        {...invalid("service")}
      >
        {ESTIMATE_SERVICES.map((service) => (
          <option key={service}>{service}</option>
        ))}
      </select>
      {fieldError("service")}

      <label htmlFor="details">What should we know?</label>
      <textarea
        id="details"
        name="details"
        placeholder="Describe the damage, symptoms or project..."
        maxLength={5000}
        required
        defaultValue={values.details}
        {...invalid("details")}
      />
      {fieldError("details")}

      <PhotoPicker
        photos={photoState.photos}
        busy={photoState.busy}
        error={photoState.error ?? errors.photos ?? null}
        onAdd={photoState.add}
        onRemove={photoState.remove}
      />

      {/* Honeypot: hidden from people, but bots tend to fill it in. */}
      <div className="hpField" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="primary" type="submit" disabled={pending || photoState.busy}>
        {pending ? "Sending…" : "Send request"} <span>↗</span>
      </button>
    </form>
  );
}
