"use client"

import React from "react"

export default function DeleteCompaniesPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded shadow-md text-center border border-red-300">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Danger Zone: Delete Companies</h1>
        <p className="mb-6 text-red-600 font-semibold">This is a temporary admin page. Here you will be able to delete subscribed companies.<br/>This page is not secure and should be removed before production.</p>
        <div className="text-gray-500">(Deletion functionality coming soon...)</div>
      </div>
    </main>
  )
} 