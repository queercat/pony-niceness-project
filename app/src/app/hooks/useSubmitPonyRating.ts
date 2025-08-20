import { useState } from "react";

export const useSubmitPonyRating = () => {
  const api = "/api/ratings";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const submitRating = async (id: number, rating: number) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: {
            id,
            rating,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed submitting your pony rating!");
      }

      return await response.json();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error ocurred."
      );
      throw(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRating, isSubmitting, error };
};
