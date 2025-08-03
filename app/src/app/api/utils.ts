import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  return (
    cookieStore.get("sessionId")?.value ??
    cookieStore
      .set({ name: "sessionId", value: crypto.randomUUID(), httpOnly: true })
      .get("sessionId")!.value
  );
};
