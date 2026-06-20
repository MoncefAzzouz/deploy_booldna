import { useState, type ChangeEvent, type FormEvent } from "react";
import { FiUser, FiMail, FiPhone, FiKey, FiCheckCircle, FiShield, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormInput from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import useAdmins from "../../hooks/useAdmins";

type AdminForm = {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
};

export default function CreateNewAdmin() {
  const { t } = useTranslation();
  const { createAdmin } = useAdmins();
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminForm>({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AdminForm, string>>
  >({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGeneralError(null);
  };

  const mapErrorsToForm = (errs: Record<string, string>) => {
    const mapped: Partial<Record<keyof AdminForm, string>> = {};

    for (const key in errs) {
      const message = errs[key];

      switch (key) {
        case "fullName":
          mapped.full_name = message;
          break;
        case "email":
          mapped.email = message;
          break;
        case "phone":
          mapped.phone = message;
          break;
        case "role":
          mapped.role = message;
          break;
        case "passwordHash":
          mapped.password = message;
          break;
        default:
          setGeneralError((prev) => (prev ? `${prev} ${message}` : message));
      }
    }

    return mapped;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setSuccessMessage(null);

    try {
      await createAdmin({
        fullName: form.full_name,
        email: form.email,
        passwordHash: form.password,
        phone: form.phone || undefined,
        role: form.role,
      });

      setSuccessMessage(t("common.success") || "Admin created successfully!");
      setForm({
        full_name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      });
      setErrors({});
    } catch (err: any) {
      if (err?.validationErrors) {
        setErrors(mapErrorsToForm(err.validationErrors));
      } else if (err?.response?.data?.errors) {
        setErrors(mapErrorsToForm(err.response.data.errors));
        if (err.response.data.message) {
          setGeneralError(err.response.data.message);
        }
      } else {
        setGeneralError(t("common.error") || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 flex justify-center items-start pt-20 transition-colors duration-300">
      <section className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-red-500/5 border border-slate-100 dark:border-slate-800 p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 dark:bg-red-600/10 rounded-bl-[10rem] -mr-16 -mt-16 pointer-events-none" />

        <div className="relative mb-12">
          <button
            onClick={() => navigate("/admins")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors mb-4"
          >
            <FiArrowLeft /> {t("nav.admins")}
          </button>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
            {t("admins.newAdminTitle")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-center">{t("admins.subtitle")}</p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 font-medium flex items-center gap-3">
            <FiShield /> {generalError}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl text-green-600 font-bold flex items-center justify-center gap-3 animate-bounce">
            <FiCheckCircle size={20} />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <FormInput
            label={t("admins.fullName")}
            icon={<FiUser />}
            name="full_name"
            value={form.full_name}
            placeholder={t("admins.fullName")}
            onChange={handleChange}
            error={errors.full_name}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={t("admins.email")}
              icon={<FiMail />}
              name="email"
              type="email"
              value={form.email}
              placeholder={t("admins.email")}
              onChange={handleChange}
              error={errors.email}
            />

            <FormInput
              label={t("admins.phone")}
              icon={<FiPhone />}
              name="phone"
              value={form.phone}
              placeholder={t("admins.phone")}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={t("admins.role")}
              icon={<FiShield />}
              name="role"
              as="select"
              value={form.role}
              onChange={handleChange}
              options={[
                { value: "", label: t("admins.role") },
                { value: "admin", label: t("admins.admin") },
                { value: "super_admin", label: t("admins.superAdmin") },
              ]}
              error={errors.role}
            />

            <FormInput
              label={t("admins.password")}
              icon={<FiKey />}
              name="password"
              type="password"
              value={form.password}
              placeholder={t("admins.password")}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-red-600/30"
              title={loading ? t("common.loading") : t("common.create") || "Create Admin"}
            />
          </div>
        </form>
      </section>
    </div>
  );
}
