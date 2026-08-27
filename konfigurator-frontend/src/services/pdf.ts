import toast from 'react-hot-toast';

import { languageData } from '@/constants';

import { SupabaseTableNames } from './queries';
import { supabaseClient } from './supabaseService';

export const uploadPdfFile = async (pdfBlob: Blob): Promise<string | null> => {
  try {
    // Convert the PDF blob to a File object
    const pdfFile = new File([pdfBlob], `sample.pdf`, {
      type: 'application/pdf',
    });

    // Upload the file to Supabase storage
    const { data, error } = await supabaseClient.storage
      .from(SupabaseTableNames.project)
      .upload(`/project/pdf/sample${Math.floor(Math.random() * 100)}.pdf`, pdfFile, {
        contentType: 'application/pdf',
      });

    if (error) {
      toast.error(error.message);
      return null;
    }

    // Return the URL of the uploaded file
    return (data as any)?.fullPath ?? null;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
    return null;
  }
};

export async function getPdfByProjectId(projectId: string) {
  try {
    const { data: profiles, error } = await supabaseClient
      .from(SupabaseTableNames.pdf)
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      toast.error(error.message);
    }

    return profiles ? profiles[0] : undefined;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
}
