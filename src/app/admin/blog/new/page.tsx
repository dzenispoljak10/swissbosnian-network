import BlogEditor from '@/components/admin/BlogEditor'

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Neuer Blogbeitrag</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <BlogEditor />
      </div>
    </div>
  )
}
