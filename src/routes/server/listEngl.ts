import { listBlog } from "~/server";
import path from "path";

export function GET() {
  const blogDir = path.join(process.cwd(), "src", "routes", "engl");
  return listBlog(blogDir);
}
