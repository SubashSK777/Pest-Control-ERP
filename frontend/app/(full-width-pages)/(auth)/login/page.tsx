import SignInForm from "@/features/auth/components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A-Flick Login",
  description: "A Pest Management Company. A-Flick and It’s Gone!",
};

export default function SignIn() {
  return <SignInForm />;
}
