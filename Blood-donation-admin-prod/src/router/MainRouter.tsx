import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import { Route, Routes } from "react-router-dom";
import SignIn from "../screens/auth/SignIn";
import AlertsList from "../screens/dashboard/AlertsList";
import CreateNewAdmin from "../screens/dashboard/CreateNewAdmin";
import CreateNewAlert from "../screens/dashboard/CreateNewAlert";
import DonorsList from "../screens/dashboard/DonorsList";
import Home from "../screens/dashboard/Home";
import DonorsDetails from "../screens/dashboard/DonorsDetails";
import AdminsList from "../screens/dashboard/AdminsList";
import HospitalsList from "../screens/dashboard/HospitalsList";
import HospitalForm from "../screens/dashboard/HospitalForm";

export default function MainRouter() {
  const { isSignedIn, role } = useSelector((s: RootState) => s.auth);

  return (
    <Routes>
      {!isSignedIn && (
        <>
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<SignIn />} />
        </>
      )}

      {isSignedIn && role === "super_admin" && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/alerts-list" element={<AlertsList />} />
          <Route path="/new-admin" element={<CreateNewAdmin />} />
          <Route path="/new-alert" element={<CreateNewAlert />} />

          <Route path="/dons" element={<DonorsList />} />
          <Route path="/alerts/:id/donations" element={<DonorsDetails />} />

          <Route path="/admins" element={<AdminsList />} />
          <Route path="/hospitals" element={<HospitalsList />} />
          <Route path="/new-hospital" element={<HospitalForm />} />
          <Route path="/hospitals/:id/edit" element={<HospitalForm />} />
          <Route path="*" element={<Home />} />
        </>
      )}

      {isSignedIn && role === "admin_cts" && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/alerts-list" element={<AlertsList />} />
          <Route path="/new-alert" element={<CreateNewAlert />} />
          <Route path="/dons" element={<DonorsList />} />
          <Route path="/alerts/:id/donations" element={<DonorsDetails />} />
          <Route path="/hospitals" element={<HospitalsList />} />
          <Route path="*" element={<Home />} />
        </>
      )}
    </Routes>
  );
}
