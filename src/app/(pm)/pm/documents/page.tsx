"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  const [documents] = useState([
    {
      id: 1,
      name: "Desain Arsitektur Villa.pdf",
      type: "PDF",
      size: "2.5 MB",
      category: "Design",
      project: "Renovasi Villa Bali",
      uploadedBy: "Siti Nurhaliza",
      uploadDate: "2024-12-10",
      version: "v2.0",
    },
    {
      id: 2,
      name: "RAB Proyek Villa Bali.xlsx",
      type: "Excel",
      size: "1.2 MB",
      category: "Budget",
      project: "Renovasi Villa Bali",
      uploadedBy: "Budi Santoso",
      uploadDate: "2024-12-15",
      version: "v1.5",
    },
    {
      id: 3,
      name: "Kontrak Klien Kantor Jakarta.pdf",
      type: "PDF",
      size: "850 KB",
      category: "Legal",
      project: "Pembangunan Kantor Jakarta",
      uploadedBy: "Budi Santoso",
      uploadDate: "2024-12-01",
      version: "v1.0",
    },
    {
      id: 4,
      name: "Foto Progress Week 1.zip",
      type: "ZIP",
      size: "15.3 MB",
      category: "Progress",
      project: "Renovasi Villa Bali",
      uploadedBy: "Eko Prasetyo",
      uploadDate: "2025-01-08",
      version: "v1.0",
    },
    {
      id: 5,
      name: "Spesifikasi Material Interior.docx",
      type: "Word",
      size: "450 KB",
      category: "Specification",
      project: "Interior Rumah Bandung",
      uploadedBy: "Ahmad Yani",
      uploadDate: "2025-01-05",
      version: "v1.2",
    },
    {
      id: 6,
      name: "Denah Lantai 1 Kantor.dwg",
      type: "AutoCAD",
      size: "3.8 MB",
      category: "Design",
      project: "Pembangunan Kantor Jakarta",
      uploadedBy: "Siti Nurhaliza",
      uploadDate: "2024-12-12",
      version: "v3.0",
    },
  ])

  const getFileIcon = (type: string) => {
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

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      Design: "bg-blue-100 text-blue-700",
      Budget: "bg-green-100 text-green-700",
      Legal: "bg-purple-100 text-purple-700",
      Progress: "bg-orange-100 text-orange-700",
      Specification: "bg-pink-100 text-pink-700",
    }

    return (
      <Badge className={`${colors[category] || "bg-gray-100 text-gray-700"} hover:${colors[category]}`}>
        {category}
      </Badge>
    )
  }

  const categories = ["All", "Design", "Budget", "Legal", "Progress", "Specification"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredDocuments =
    selectedCategory === "All"
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory)

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
        <Button>
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

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {getFileIcon(doc.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryBadge(doc.category)}
                        <span className="text-sm text-slate-500">{doc.version}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Proyek</p>
                      <p className="text-sm font-medium text-slate-900">
                        {doc.project}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Ukuran</p>
                      <p className="text-sm font-medium text-slate-900">{doc.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Diupload oleh</p>
                      <p className="text-sm font-medium text-slate-900">
                        {doc.uploadedBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tanggal Upload</p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(doc.uploadDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
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
                      <Button variant="outline" size="sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
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
