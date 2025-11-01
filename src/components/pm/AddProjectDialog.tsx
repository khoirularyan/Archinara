"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddProjectDialogProps {
  trigger?: React.ReactNode
  onProjectAdded?: () => void
}

export function AddProjectDialog({ trigger, onProjectAdded }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    deadline: "",
    budget: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement API call to create project
      console.log("Creating project:", formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form and close dialog
      setFormData({
        name: "",
        client: "",
        description: "",
        deadline: "",
        budget: "",
      })
      setOpen(false)
      
      // Callback to refresh project list
      if (onProjectAdded) {
        onProjectAdded()
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Proyek
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Tambah Proyek Baru</DialogTitle>
            <DialogDescription>
              Isi informasi proyek baru. Klik simpan ketika selesai.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Nama Proyek */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nama Proyek <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Contoh: Renovasi Villa Bali"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Nama Klien */}
            <div className="grid gap-2">
              <Label htmlFor="client">
                Nama Klien <span className="text-red-500">*</span>
              </Label>
              <Input
                id="client"
                name="client"
                placeholder="Contoh: PT. Bali Resort"
                value={formData.client}
                onChange={handleChange}
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Deskripsi singkat tentang proyek..."
                value={formData.description}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Deadline dan Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline">
                  Deadline <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budget">Budget (Rp)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="0"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Proyek"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
