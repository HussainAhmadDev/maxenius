import toast from 'react-hot-toast';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import PrivateWrapper from '@/auth/PrivateRoute';
import ProjectProtectionWrapper from '@/auth/ProjectProtection';
import { toastMessages } from '@/constants';
import DashboardLayout from '@/layouts/dashboard';
import EditorPDF from '@/pages/EditorPDF';
import EditorRoot from '@/pages/EditorRoot';
import FinishedProjects from '@/pages/FinishedProjects';
import OpenProjects from '@/pages/OpenProjects';
import Page404 from '@/pages/Page404';
import {
  getProjectById,
  getProjectDetailsById,
  getProjectsListing,
} from '@/services/projects';
import { supabaseClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';
import { useEditorStore } from '@/store/EditorStore';
import { ProjectResponse } from '@/types/Project';

import AllProjects from '../pages/AllProjects';
import AuthPage from '../pages/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: 'dashboard',
    element: (
      <PrivateWrapper>
        <DashboardLayout />
      </PrivateWrapper>
    ),
    loader: async () => {
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const jwt = jwtDecode(session.access_token) as any;
          const userRole = jwt.user_role;

          useAuthStore.setState({ session, loading: false, userRole });
        }
      });
      return null;
    },
    children: [
      { element: <Navigate to="/dashboard/all-projects" replace />, index: true },
      {
        path: 'all-projects',
        element: <AllProjects />,
        loader: async ({ request }) => {
          try {
            const result = (await getProjectsListing({ request })) as {
              totalRows: number;
              data: ProjectResponse[];
            };
            return result || null;
          } catch (error) {
            return null;
          }
        },
      },
      {
        path: 'open-projects',
        element: <OpenProjects />,
        loader: async ({ request }) => {
          try {
            const result = await getProjectsListing({ status: 'open', request });
            return result;
          } catch (error) {
            return null;
          }
        },
      },
      {
        path: 'finished-projects',
        element: <FinishedProjects />,
        loader: async ({ request }) => {
          try {
            const result = await getProjectsListing({ status: 'finished', request });
            return result;
          } catch (error) {
            return null;
          }
        },
      },
    ],
  },
  { path: 'auth', element: <AuthPage /> },
  {
    path: 'editor/:id',
    element: (
      <PrivateWrapper>
        <ProjectProtectionWrapper>
          <EditorRoot />
        </ProjectProtectionWrapper>
      </PrivateWrapper>
    ),
    loader: async ({ params: { id } }) => {
      const [result, projectDetails] = await Promise.all([
        getProjectById(id as string),
        getProjectDetailsById(id as string),
      ]);
      useEditorStore.setState({
        projectData: result,
        projectFile: result.file,
        projectDetails: projectDetails,
      });
      return result;
    },
  },
  {
    path: 'editor/:id/pdf',
    element: (
      <PrivateWrapper>
        <EditorPDF />
      </PrivateWrapper>
    ),
    loader: async ({ params: { id } }) => {
      const [project, projectDetails] = await Promise.all([
        getProjectById(id as string),
        getProjectDetailsById(id as string),
      ]);

      const pdf = project.file?.pdf[project?.file?.pdf.length - 1];
      if (!project.file) {
        toast.error(toastMessages.error.noPDF);
      }
      useEditorStore.setState({
        projectData: project,
        projectDetails: projectDetails,
        pdfForm: pdf?.formData ?? {
          stärke:
            parseFloat(project?.file?.default?.al?.toString())
              .toPrecision(2)
              .replace('.', ',') + ' mm',
          name: project.name,
        },
      });
      return project;
    },
  },
  { path: '*', element: <Navigate to="/404" replace /> },
  { path: '404', element: <Page404 /> },
]);
