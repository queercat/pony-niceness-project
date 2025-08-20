import { useState } from "react";

export const useSubmitDataPolicy = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const submitDataPolicy = async (agreed: boolean) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      const response = await fetch("/api/data-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agreed }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data policy");
      }

      return await response.json();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const declineDataPolicy = async () => {
    await submitDataPolicy(false);
  };

  const acceptDataPolicy = async () => {
    await submitDataPolicy(true);
  };

  return { declineDataPolicy, acceptDataPolicy, isSubmitting, error };
};
