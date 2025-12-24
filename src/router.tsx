import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "@/views/loginView";
import RegisterView from "@/views/registerView";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
        </Route>
        <Route element={<AppLayout />} path="/admin">
          <Route index={true} element={<LinkTreeView />} />
          <Route path="profile" element={<ProfileView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
