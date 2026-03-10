import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "posts")

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory)

  return filenames
    .filter(name => name.endsWith(".md") || name.endsWith(".mdx"))
    .map(filename => {
      const slug = filename.replace(/\.mdx?$/, "")
      const fullPath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)

      return {
        slug,
        ...data,
      }
    })
}

export function getPostBySlug(slug) {
  const mdPath = path.join(postsDirectory, `${slug}.md`)
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`)

  let fullPath

  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath
  } else {
    throw new Error(`Post not found: ${slug}`)
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  return { data, content }
}