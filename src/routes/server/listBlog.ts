import { listBlog } from "~/server";

export function GET() {
  return listBlog();
}
