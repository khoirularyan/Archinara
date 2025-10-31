export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Project Detail</h1>
      <p className="text-slate-600">Project ID: {params.id}</p>
    </div>
  );
}
