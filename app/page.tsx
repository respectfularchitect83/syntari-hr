import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Syntari HR - Welcome",
  description: "Welcome to Syntari HR. Sign up or log in to your company HR portal.",
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Syntari HR</h1>
        <p className="mb-6 text-gray-600">Modern HR for your organization.</p>
        <Link href="/auth/register" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mb-2">Sign up</Link>
        <div className="mt-4">
          <span className="text-gray-500">Already have an account? </span>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">Log in</Link>
        </div>
        <div className="mt-8">
          <button
            className="text-red-600 underline text-sm"
            onClick={() => {
              const pw = prompt("Enter admin password:")
              if (pw === "0811278404") {
                window.location.href = "/admin/delete-companies"
              } else if (pw !== null) {
                alert("Incorrect password.")
              }
            }}
            type="button"
          >
            Danger Zone (Admin)
          </button>
        </div>
      </div>
    </main>
  )
}
