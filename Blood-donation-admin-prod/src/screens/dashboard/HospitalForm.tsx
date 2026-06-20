import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiHash,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { MdLocalHospital, MdLocationCity } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import useHospitals from "../../hooks/useHospitals";
import { useToast } from "../../components/ToastProvider";

type HospitalFormState = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
};

const emptyForm: HospitalFormState = {
  name: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
};

export default function HospitalForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const hospitalId = id ? Number(id) : null;
  const isEdit = hospitalId !== null && !Number.isNaN(hospitalId);

  const { createHospital, updateHospital, getHospitalById } = useHospitals();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<HospitalFormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEdit || hospitalId === null) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getHospitalById(hospitalId);
        const h = res?.data ?? res;
        if (cancelled || !h) return;
        setForm({
          name: h.name ?? "",
          address: h.address ?? "",
          city: h.city ?? "",
          postalCode: h.postalCode ?? "",
          phone: h.phone ?? "",
          email: h.email ?? "",
        });
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.message ?? t("common.error"));
      } finally {
        if (!cancelled) setFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEdit && hospitalId !== null) {
        await updateHospital(hospitalId, form);
        toast.success(t("hospitals.updateSuccess"));
      } else {
        await createHospital(form);
        toast.success(t("hospitals.successMessage"));
      }
      setSuccess(true);
      setTimeout(() => navigate("/hospitals"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 flex justify-center items-start pt-20 transition-colors duration-300">
      <section className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-red-500/5 border border-slate-100 dark:border-slate-800 p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 dark:bg-red-600/10 rounded-bl-[10rem] -mr-16 -mt-16 pointer-events-none" />

        <div className="relative mb-12">
          <button
            type="button"
            onClick={() => navigate("/hospitals")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded"
          >
            <FiArrowLeft aria-hidden="true" /> {t("nav.hospitals")}
          </button>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
            {isEdit ? t("hospitals.editHospitalTitle") : t("hospitals.newHospitalTitle")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
            {t("hospitals.subtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 font-medium flex items-center gap-3 justify-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl text-green-600 font-bold flex items-center justify-center gap-3 animate-bounce">
            <FiCheckCircle size={20} aria-hidden="true" />
            {t("common.success")}
          </div>
        )}

        {fetching ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12 animate-pulse">
            {t("common.loading")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <FormInput
              label={t("hospitals.title")}
              icon={<MdLocalHospital />}
              name="name"
              value={form.name}
              placeholder={t("hospitals.title")}
              onChange={handleChange}
            />

            <FormInput
              label={t("donors.address") || "Address"}
              icon={<FiMapPin />}
              name="address"
              value={form.address}
              placeholder={t("donors.address") || "Address"}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label={t("donors.city")}
                icon={<MdLocationCity />}
                name="city"
                value={form.city}
                placeholder={t("donors.city")}
                onChange={handleChange}
              />
              <FormInput
                label={t("hospitals.postalCode")}
                icon={<FiHash />}
                name="postalCode"
                value={form.postalCode}
                placeholder={t("hospitals.postalCode")}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label={t("admins.phone")}
                icon={<FiPhone />}
                name="phone"
                value={form.phone}
                placeholder={t("admins.phone")}
                onChange={handleChange}
              />
              <FormInput
                label={t("admins.email")}
                icon={<FiMail />}
                name="email"
                type="email"
                value={form.email}
                placeholder={t("admins.email")}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-red-600/30"
                title={
                  loading
                    ? t("common.loading")
                    : isEdit
                      ? t("common.save")
                      : t("hospitals.addHospital")
                }
              />
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
