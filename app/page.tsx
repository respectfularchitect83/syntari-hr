import type { Metadata } from "next"
import LoginPage from "@/components/login-page"

export const metadata: Metadata = {
  title: "Syntari HR - Login",
  description: "Login to your company HR portal",
}

export default function Home() {
  return <LoginPage />
}
