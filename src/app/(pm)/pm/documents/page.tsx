"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Document = {
  id: string
  name: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  projectId: string
  uploadedAt: string
  uploadedBy: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  project: {
    id: string
    name: string
  }
}

type Project = {
  id: string
  name: string
}

export default function DocumentsPage() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [documentName, setDocumentName] = useState<string>("")

  useEffect(() => {
    fetchDocuments()
    fetchProjects()
  }, [])

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/pm/documents')
      const data = await res.json()
      if (res.ok) {
        setDocuments(data.documents)
      } else {
        toast.error(data.error || 'Gagal memuat dokumen')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat dokumen')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (res.ok) {
        // API /api/projects returns { projects: [...] }
        setProjects(data.projects || [])
        console.log('Projects loaded:', data.projects?.length || 0)
      } else {
        console.error('Failed to fetch projects:', data.error)
        toast.error('Gagal memuat daftar proyek')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Terjadi kesalahan saat memuat proyek')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!documentName) {
        setDocumentName(file.name)
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !selectedProjectId) {
      toast.error('Pilih file dan proyek terlebih dahulu')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('projectId', selectedProjectId)
      formData.append('name', documentName || selectedFile.name)

      const res = await fetch('/api/pm/documents', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Dokumen berhasil diupload')
        setDocuments([data.document, ...documents])
        setIsDialogOpen(false)
        resetForm()
      } else {
        toast.error(data.error || 'Gagal mengupload dokumen')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupload dokumen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      return
    }

    try {
      const res = await fetch(`/api/pm/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Dokumen berhasil dihapus')
        setDocuments(documents.filter(doc => doc.id !== documentId))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Gagal menghapus dokumen')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus dokumen')
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setSelectedProjectId("")
    setDocumentName("")
  }

  const getFileType = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return 'PDF'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel'
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Word'
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'ZIP'
    if (mimeType.includes('dwg') || mimeType.includes('autocad')) return 'AutoCAD'
    if (mimeType.includes('image')) return 'Image'
    return 'File'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    const type = getFileType(mimeType)
    switch (type) {
      case "PDF":
        return (
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        )
      case "Excel":
        return (
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )
      case "Word":
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )
      case "ZIP":
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )
      case "AutoCAD":
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
        )
    }
  }

  const [selectedProject, setSelectedProject] = useState<string>("All")

  const filteredDocuments =
    selectedProject === "All"
      ? documents
      : documents.filter((doc) => doc.project.id === selectedProject)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dokumen</h1>
          <p className="text-lg text-slate-600 mt-2">
            Kelola semua dokumen proyek
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload Dokumen
        </Button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Dokumen</DialogTitle>
            <DialogDescription>
              Upload dokumen proyek ke Supabase Storage
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Proyek *</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih proyek" />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-slate-500">
                      Tidak ada proyek tersedia
                    </div>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {projects.length === 0 && (
                <p className="text-xs text-amber-600">
                  ⚠️ Belum ada proyek. Buat proyek terlebih dahulu untuk upload dokumen.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
              />
              {selectedFile && (
                <p className="text-sm text-slate-500">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Dokumen</Label>
              <Input
                id="name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Nama dokumen (opsional)"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
                disabled={isUploading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Mengupload..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedProject === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedProject("All")}
        >
          Semua Proyek
        </Button>
        {projects.map((project) => (
          <Button
            key={project.id}
            variant={selectedProject === project.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}
          </Button>
        ))}
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-slate-500">Memuat dokumen...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getFileIcon(doc.mimeType)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-700">
                            {getFileType(doc.mimeType)}
                          </Badge>
                          <span className="text-sm text-slate-500">{doc.fileName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Proyek</p>
                        <p className="text-sm font-medium text-slate-900">
                          {doc.project.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Ukuran</p>
                        <p className="text-sm font-medium text-slate-900">
                          {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Diupload oleh</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={doc.uploadedBy.image || undefined} />
                            <AvatarFallback className="text-xs">
                              {doc.uploadedBy.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium text-slate-900">
                            {doc.uploadedBy.name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Tanggal Upload</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(doc.uploadedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </Button>
                        {(session?.user?.role === 'ADMIN' || 
                          session?.user?.role === 'MANAGER' || 
                          session?.user?.id === doc.uploadedBy.id) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-slate-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Tidak ada dokumen
            </h3>
            <p className="text-slate-600 mb-4">
              Belum ada dokumen dalam kategori ini
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
