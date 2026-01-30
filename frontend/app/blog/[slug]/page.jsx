import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'
import BlogPostClient from '@/components/BlogPostClient'

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'content/blog')
    if (!fs.existsSync(postsDirectory)) return []

    const filenames = fs.readdirSync(postsDirectory)
    return filenames.map((filename) => ({
        slug: filename.replace('.mdx', ''),
    }))
}

async function getPost(slug) {
    const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    return { data, content }
}

export default async function BlogPostPage({ params }) {
    const { slug } = params
    const { data, content } = await getPost(slug)

    return (
        <BlogPostClient data={data}>
            <MDXRemote source={content} components={mdxComponents} />
        </BlogPostClient>
    )
}
