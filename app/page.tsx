import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Syntari HR - Login",
  description: "Login to your company HR portal",
}

export default function Home() {
  redirect("/auth/register")
  return null
}
