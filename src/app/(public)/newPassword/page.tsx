import { redirect } from "next/navigation";

export default function PageNewPassword() {
  redirect("/reset-password");
}
