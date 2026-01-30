import { projects } from '@/data/projects'
import ProjectDetailClient from './ProjectDetailClient'

// Required for static export
export async function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }))
}

export default function ProjectDetailPage({ params }) {
    return <ProjectDetailClient params={params} />
}
