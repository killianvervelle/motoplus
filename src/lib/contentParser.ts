import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import path from "path";

const contentPath = "src/content";

// Helper function to read file content
const readFile = (filePath: string) => {
  return fs.readFileSync(filePath, "utf-8");
};

// Helper function to parse frontmatter
const parseFrontmatter = (frontmatter: any) => {
  const frontmatterString = JSON.stringify(frontmatter);
  return JSON.parse(frontmatterString);
};

// get list page data, ex: _index.md
export const getListPage = (filePath: string) => {
  const pageDataPath = path.join(contentPath, filePath);

  if (!fs.existsSync(pageDataPath)) {
    notFound();
  }

  const pageData = readFile(pageDataPath);
  const { content, data: frontmatter } = matter(pageData);

  return {
    frontmatter: parseFrontmatter(frontmatter),
    content,
  };
};

// get all single pages, ex: blog/post.md
// Adjust if your content root differs
const contentRoot = path.join(process.cwd(), 'src', 'content');

// Case-insensitive directory resolver (handles Windows vs Linux)
function resolveDirInsensitive(parent: string, target: string) {
  if (!fs.existsSync(parent)) return null;
  const entries = fs.readdirSync(parent, { withFileTypes: true });
  const match = entries.find(
    (e) => e.isDirectory() && e.name.toLowerCase() === target.toLowerCase()
  );
  return match ? path.join(parent, match.name) : path.join(parent, target);
}

export type RegularPage = {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
};

export const getSinglePage = (folder: string): RegularPage[] => {
  // Resolve folder in a case-insensitive way
  const folderPath = resolveDirInsensitive(contentRoot, folder);
  if (!folderPath || !fs.existsSync(folderPath)) {
    // Return empty list instead of throwing 404 here.
    // The route will decide whether to notFound().
    return [];
  }

  // Read .md and .mdx files
  const files = fs
    .readdirSync(folderPath)
    .filter((f) => /^(?!_).*\.(md|mdx)$/i.test(f));

  const pages = files.map((filename) => {
    const filePath = path.join(folderPath, filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(raw);

    // frontmatter.url can be `"/terms-services"` or `"terms-services"`
    const fmUrl = (data?.url || '').toString().replace(/^\/+/, '');
    const slug = fmUrl || filename.replace(/\.(md|mdx)$/i, '');

    return {
      frontmatter: data || {},
      slug,
      content,
    };
  });

  return pages;
};
