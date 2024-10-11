import React from 'react'
import { Button } from "@/components/ui/button"

interface ActionPopupProps {
  title: string
  message: string
  onClose: () => void
}

export default function ActionPopup({ title, message, onClose }: ActionPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </div>
  )
}