import { useEffect, useState } from "react";

export const useHasAcceptedDataPolicy = () => {
  const [hasAccepted, setHasAccepted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchDataPolicyStatus = async () => {
    try {
      const response = await fetch("/api/data-policy");
      const data = await response.json();
      setHasAccepted(data.agreed);
    } catch (error) {
      console.error("Failed to fetch data policy status:", error);
      setHasAccepted(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataPolicyStatus();
  }, []);

  return { hasAccepted, isLoading, fetchDataPolicyStatus };
};
