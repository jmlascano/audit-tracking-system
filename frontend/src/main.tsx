import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from "./App.tsx";
import OrgMemberMgt from "./pages/OrgMemberMgt.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Login from './pages/Login.tsx';
import OrgSignup from './pages/OrgSignup.tsx';
import StudentSignup from './pages/StudentSignUp.tsx';

const router = createBrowserRouter([
  { path: '/', element: <App />, errorElement: <ErrorPage/>},
  { path: '/org-member-mgt', element: <OrgMemberMgt />, errorElement: <ErrorPage/>},
  { path: '/login', element: <Login />, errorElement: <ErrorPage/>},
  { path: '/org-signup', element: <OrgSignup />, errorElement: <ErrorPage/>},
  { path: '/student-signup', element: <StudentSignup />, errorElement: <ErrorPage/>},
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
