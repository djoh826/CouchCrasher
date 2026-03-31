"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function HostCreate() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    maxguests: 1,
    numbedrooms: 1,
    numbathrooms: 1,
    description: "",
    cancelperiod: "24_hours",
    refundrate: 0.5,
    nightlyfee: 0,
    cleaningfee: 0,
    servicefee: 0,
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    latitude: 0,
    longitude: 0,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return <p>You must be logged in to create a listing.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    const numericFields = [
      "maxguests",
      "numbedrooms",
      "numbathrooms",
      "refundrate",
      "nightlyfee",
      "cleaningfee",
      "servicefee",
      "latitude",
      "longitude",
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create listing");
      } else {
        router.push(`/properties/${data.pid}`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.hostCreate}>
      <h2>Create a New Listing</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          {
            label: "Property Name",
            name: "name",
            type: "text",
            required: true,
          },
          {
            label: "Description",
            name: "description",
            type: "textarea",
            required: true,
          },
          {
            label: "Max Guests",
            name: "maxguests",
            type: "number",
            required: true,
            min: 1,
          },
          {
            label: "Bedrooms",
            name: "numbedrooms",
            type: "number",
            required: true,
            min: 0,
          },
          {
            label: "Bathrooms",
            name: "numbathrooms",
            type: "number",
            required: true,
            min: 0,
          },
          { label: "Cancellation Period", name: "cancelperiod", type: "text" },
          {
            label: "Refund Rate",
            name: "refundrate",
            type: "number",
            min: 0,
            max: 1,
            step: 0.01,
          },
          {
            label: "Nightly Fee",
            name: "nightlyfee",
            type: "number",
            required: true,
            min: 0,
          },
          {
            label: "Cleaning Fee",
            name: "cleaningfee",
            type: "number",
            min: 0,
          },
          { label: "Service Fee", name: "servicefee", type: "number", min: 0 },
          { label: "Street", name: "street", type: "text" },
          { label: "City", name: "city", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Zipcode", name: "zipcode", type: "text" },
          { label: "Country", name: "country", type: "text" },
          { label: "Latitude", name: "latitude", type: "number", step: "any" },
          {
            label: "Longitude",
            name: "longitude",
            type: "number",
            step: "any",
          },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required={field.required}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                step={field.step}
                required={field.required}
              />
            )}
          </div>
        ))}

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </section>
  );
}
