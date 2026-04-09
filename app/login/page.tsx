import { getDictionary } from "@/app/utils/i18n";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const dict = await getDictionary();
  
  return <LoginForm dict={dict.loginPage} />;
}
