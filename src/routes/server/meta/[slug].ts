import type { APIEvent } from "@solidjs/start/server";
import { listBlog } from "~/server";

export function GET({ params }: APIEvent) {
  return listBlog().find((e) => e.slug.toLowerCase() === params.slug.toLowerCase()) || {}
}
