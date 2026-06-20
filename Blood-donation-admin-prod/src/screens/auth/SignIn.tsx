import { FiMail, FiLock } from "react-icons/fi";
import { BsDropletFill } from "react-icons/bs";
import React, { useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { setSession } from "../../state/auth/authSlice";
import { loginAdmin } from "../../services/loginServices";
import FormInput from "../../components/ui/FormField";
// import CheckboxItem from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState<"admin_cts" | "super_admin">("admin_cts");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleRoleChange = () => {
  //   setRole(role === "admin_cts" ? "super_admin" : "admin_cts");
  // };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginAdmin({ email, password });

      const session = {
        adminId: data.data.resAdmin.adminId,
        username: data.data.resAdmin.fullName,
        email: data.data.resAdmin.email,
        role: data.data.resAdmin.role,
        token: data.data.token,
      };
      dispatch(setSession(session));
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ ...session, isSignedIn: true }),
      );

      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <section className="flex flex-col w-full max-w-md p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-fadeIn relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 dark:bg-red-600/10 rounded-bl-[5rem] -mr-8 -mt-8" />

        <div className="flex justify-center mb-6 relative">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-3xl shadow-inner">
            <BsDropletFill className="text-red-600 text-5xl" />
          </div>
        </div>

        <h2 className="text-4xl font-black text-slate-800 dark:text-white text-center mb-2 tracking-tight">
          {t("auth.signIn")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-10 font-medium">{t("auth.subtitle")}</p>

        <form className="flex flex-col gap-6 relative" onSubmit={handleOnSubmit}>
          <FormInput
            icon={<FiMail />}
            name="email"
            value={email}
            placeholder={t("auth.email")}
            type="email"
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
              setEmail(e.target.value)
            }
          />

          <FormInput
            icon={<FiLock />}
            name="password"
            value={password}
            placeholder={t("auth.password")}
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
              setPassword(e.target.value)
            }
          />

          <div className="pt-2">
            <Button
              type="submit"
              title={loading ? t("auth.signIning") : t("auth.signInButton")}
              className="w-full py-4 text-lg font-black shadow-red-600/30"
            />
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/50 rounded-2xl text-center text-sm text-red-600 font-bold animate-shake">
            {error}
          </div>
        )}

      </section>
    </div>
  );
}
