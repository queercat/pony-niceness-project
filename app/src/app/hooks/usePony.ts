import { Pony } from "@/generated/prisma";
import { useEffect, useState } from "react";

export const usePony = () => {
  const api = "/api/ponies";

  const [pony, setPony] = useState<Pick<Pony, "derpiUrl" | "id" | "name">>();
  const [isLoading, setIsLoading] = useState(true);
  const [allDone, setAllDone] = useState(false)

  const fetchPony = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500))
    try {
      const response = await fetch(api);
      if (response.status === 404) {
        setAllDone(true);
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch pony");
      }
      const data = await response.json();
      setPony(data.pony);
    } catch (error) {
      console.error("Error fetching pony:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPony();
  }, [])


  return { pony, isLoading, fetchPony, allDone };
};
