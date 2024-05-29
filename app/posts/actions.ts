"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { error } = await supabase.from("posts").insert({
    content: formData.get("content") as string,
  });
  if (error) throw error;
  redirect("/posts");
}
