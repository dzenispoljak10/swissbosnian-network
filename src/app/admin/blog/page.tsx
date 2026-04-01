import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import BlogToggleButton from '@/components/admin/BlogToggleButton'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="bg-brand-blue text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Neuer Beitrag
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>Noch keine Blogbeiträge</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Titel</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden md:table-cell">Kategorie</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider hidden lg:table-cell">Datum</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-4 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm text-neutral-900 line-clamp-1">{post.titleDe}</p>
                    {post.titleBs && (
                      <p className="text-xs text-gray-400 line-clamp-1">{post.titleBs}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {post.category && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <BlogToggleButton postId={post.id} published={post.published} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-brand-blue hover:text-brand-blue-dark transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
