import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { Toaster } from 'sonner';
import App from "./App.tsx";
import OrgPage from "./pages/OrgPage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Login from './pages/LoginPage.tsx';
import OrgSignup from './pages/SignupOrgPage.tsx';
import MemberSignup from './pages/SignupMemberPage.tsx';

const router = createBrowserRouter([
  { path: '/', element: <App />, errorElement: <ErrorPage/>},
  { path: '/org', element: <OrgPage />, errorElement: <ErrorPage/>},
  { path: '/login', element: <Login />, errorElement: <ErrorPage/>},
  { path: '/org-signup', element: <OrgSignup />, errorElement: <ErrorPage/>},
  { path: '/member-signup', element: <MemberSignup />, errorElement: <ErrorPage/>},
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>,
)
