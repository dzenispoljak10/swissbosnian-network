import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BlogEditor from '@/components/admin/BlogEditor'

type Props = { params: Promise<{ id: string }> }

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Beitrag bearbeiten</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <BlogEditor
          initialPost={{
            id: post.id,
            titleDe: post.titleDe,
            titleBs: post.titleBs ?? '',
            slug: post.slug,
            contentDe: post.contentDe,
            contentBs: post.contentBs ?? '',
            excerptDe: post.excerptDe ?? '',
            excerptBs: post.excerptBs ?? '',
            coverImage: post.coverImage ?? '',
            category: post.category ?? '',
            tags: post.tags ?? '',
            metaTitleDe: post.metaTitleDe ?? '',
            metaDescDe: post.metaDescDe ?? '',
            published: post.published,
          }}
        />
      </div>
    </div>
  )
}
