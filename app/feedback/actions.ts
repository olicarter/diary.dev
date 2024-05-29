"use server";

import { type Enums } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createFeedback(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { error } = await supabase.from("feedback").insert({
    content: formData.get("content") as string,
    recipient: formData.get("recipient") as string,
    visibility: formData.get(
      "visibility",
    ) as Enums<"visibility">,
  });
  if (error) throw error;
  redirect("/feedback");
}
