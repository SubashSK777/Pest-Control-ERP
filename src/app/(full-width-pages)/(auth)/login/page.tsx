import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Login Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Login Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
