import type { APIEvent } from "@solidjs/start/server";
import { listBlog } from "~/server";
import path from "path";

export function GET({ params }: APIEvent) {
  const blogDir = path.join(process.cwd(), "src", "routes", "engl");
  return listBlog(blogDir).find((e) => e.slug.toLowerCase() === params.slug.toLowerCase()) || {}
}
