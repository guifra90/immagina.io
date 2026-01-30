'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BlogList({ posts }) {
    const listRef = useRef(null)

    useGSAP(() => {
        gsap.from('.blog-card', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: listRef.current,
                start: "top 80%"
            }
        })
    }, { scope: listRef })

    return (
        <div ref={listRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group blog-card block">
                    <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col">
                        <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono uppercase border border-white/10">
                                {post.category}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex justify-between items-center text-xs text-muted font-mono mb-4">
                                <span>{post.date}</span>
                                <span>{post.author}</span>
                            </div>

                            <h2 className="text-2xl font-display font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center text-primary text-sm font-bold uppercase tracking-wide group/btn">
                                Read Article <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </div>
                        </div>
                    </article>
                </Link>
            ))}
        </div>
    )
}
