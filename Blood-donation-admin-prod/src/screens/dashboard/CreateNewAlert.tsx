import { useState, useEffect, useMemo } from "react";
import { MdBloodtype, MdLocalHospital, MdLocationCity } from "react-icons/md";
import { FiList, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BsHash } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import FormInput from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import { bloodTypeOptions } from "../../utils/bloodTypeTranslation";

import useAlerts from "../../hooks/useAlerts";
import useHospitals from "../../hooks/useHospitals";
import type { RootState } from "../../state/store";

export default function CreateNewAlert() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createAlert } = useAlerts();
  const { getHospitals } = useHospitals();
  const adminId = useSelector((state: RootState) => state.auth.adminId);

  const [hospitals, setHospitals] = useState<any[]>([]);

  const [bloodType, setBloodType] = useState("");
  const [hospitalService, setHospitalService] = useState("");
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [urgency, setUrgency] = useState<"low" | "medium" | "urgent" | "">("");
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data.data || data || []);
      } catch (err) {
        console.error("Failed to fetch hospitals", err);
      }
    };
    fetchHospitals();
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    hospitals.forEach((h) => {
      const c = (h?.city ?? "").trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    if (!city) return hospitals;
    return hospitals.filter((h) => (h?.city ?? "").trim() === city);
  }, [hospitals, city]);

  useEffect(() => {
    if (hospital && !filteredHospitals.some((h) => String(h.hospitalId) === hospital)) {
      setHospital("");
    }
  }, [filteredHospitals, hospital]);

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!adminId) {
      setError(t("auth.sessionMissing"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createAlert(adminId, {
        hospitalId: hospital ? Number(hospital) : undefined,
        bloodGroup: bloodType,
        quantityUnits: unitsNeeded,
        urgencyLevel: urgency as "low" | "medium" | "urgent",
        description: hospitalService,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setBloodType("");
      setHospitalService("");
      setUnitsNeeded(1);
      setUrgency("");
      setCity("");
      setHospital("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? err?.message ?? t("common.error"),
      );
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
            onClick={() => navigate("/alerts-list")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors mb-4"
          >
            <FiArrowLeft /> {t("nav.alerts")}
          </button>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight text-center">
            {t("alerts.newAlertTitle")}
          </h2>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl text-green-600 font-bold flex items-center justify-center gap-3 animate-bounce">
            <FiCheckCircle size={20} />
            {t("common.success") || "Alert Created Successfully!"}
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 font-bold text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-8" onSubmit={handleOnSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label={t("donors.city")}
              icon={<MdLocationCity />}
              name="city"
              value={city}
              as="select"
              onChange={(e) => setCity(e.target.value)}
              options={[
                { value: "", label: t("donors.city") },
                ...cities.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={t("nav.hospitals")}
              icon={<MdLocalHospital />}
              name="hospital"
              value={hospital}
              as="select"
              onChange={(e) => setHospital(e.target.value)}
              options={[
                { value: "", label: t("nav.hospitals") },
                ...filteredHospitals.map((h) => ({
                  value: String(h.hospitalId),
                  label: h.name,
                })),
              ]}
            />

            <FormInput
              label={t("alerts.bloodGroup")}
              icon={<MdBloodtype />}
              name="bloodType"
              value={bloodType}
              as="select"
              onChange={(e) => setBloodType(e.target.value)}
              options={bloodTypeOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label={t("alerts.donors")}
              icon={<BsHash />}
              name="unitsNeeded"
              type="number"
              value={String(unitsNeeded)}
              min={1}
              max={20}
              onChange={(e) => setUnitsNeeded(Number(e.target.value))}
              onNumberChange={setUnitsNeeded}
            />

            <FormInput
              label={t("alerts.status")}
              icon={<FiList />}
              name="urgency"
              value={urgency}
              as="select"
              onChange={(e) => setUrgency(e.target.value as any)}
              options={[
                { value: "", label: t("alerts.status") },
                { value: "low", label: t("alerts.low") },
                { value: "medium", label: t("alerts.medium") },
                { value: "urgent", label: t("alerts.urgent") },
              ]}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-red-600/30"
              title={
                loading
                  ? t("common.loading")
                  : t("common.create") || "Create Alert"
              }
            />
          </div>
        </form>
      </section>
    </div>
  );
}
