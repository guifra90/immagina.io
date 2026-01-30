import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import BlogList from '@/components/BlogList'

// Note: In Next.js App Router, we fetch data in Server Components usually.
async function getBlogPosts() {
    const postsDirectory = path.join(process.cwd(), 'content/blog')
    // Ensure directory exists in production
    if (!fs.existsSync(postsDirectory)) return []

    const filenames = fs.readdirSync(postsDirectory)

    const posts = filenames.map(filename => {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data } = matter(fileContents)

        return {
            slug: filename.replace('.mdx', ''),
            ...data
        }
    })

    return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export default async function BlogPage() {
    const posts = await getBlogPosts()

    return (
        <main className="bg-background min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">
                <header className="mb-20">
                    <h1 className="text-[12vw] leading-[0.85] font-display font-bold uppercase tracking-tight">
                        Insights<br />
                        <span className="text-primary ml-[5vw]">& Thoughts</span>
                    </h1>
                </header>

                <BlogList posts={posts} />
            </div>
        </main>
    )
}
