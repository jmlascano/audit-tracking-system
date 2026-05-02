import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import { supabase } from './lib/supabase';
import './index.css';

axios.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
import { Toaster } from 'sonner';
import BatisLandingPage from './pages/BatisLandingPage.tsx'; // BatisLandingPage
import OrgPage from './pages/OrgPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Login from './pages/LoginPage.tsx';
import OrgSignup from './pages/SignupOrgPage.tsx';
import MemberSignup from './pages/SignupMemberPage.tsx';
import MemberPage from './pages/MemberPage.tsx';

const router = createBrowserRouter([
  { path: '/', element: <BatisLandingPage />, errorElement: <ErrorPage/> }, // Changed from App to BatisLandingPage
   { path: '/member', element: <MemberPage />, errorElement: <ErrorPage/> },
  { path: '/org', element: <OrgPage />, errorElement: <ErrorPage/> },
  { path: '/login', element: <Login />, errorElement: <ErrorPage/> },
  { path: '/org-signup', element: <OrgSignup />, errorElement: <ErrorPage/> },
  { path: '/member-signup', element: <MemberSignup />, errorElement: <ErrorPage/> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster 
      toastOptions={{
        className: '!bg-purple-800 !text-white !font-bold',
      }}
    />
    <RouterProvider router={router} />
  </StrictMode>,
);