import toast from 'react-hot-toast';

import { languageData } from '@/constants';

import { SupabaseTableNames } from './queries';
import { supabaseClient } from './supabaseService';

export async function getProfilesByProjectId(projectId: string) {
  try {
    const { data: profiles, error } = await supabaseClient
      .from(SupabaseTableNames.pdfProfile)
      .select('*')
      .eq('project_id', projectId)
      .order('id', { ascending: true });

    if (error) {
      toast.error(error.message);
    }

    return profiles;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
}
