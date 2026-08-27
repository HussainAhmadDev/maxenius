import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

import { languageData } from '@/constants';
import { UserRoles } from '@/store/AuthStore';
import { useEditorStore } from '@/store/EditorStore';
import { ProjectResponse } from '@/types/Project';
import { extractSearchQuery } from '@/utils/param';

import { LIST_QUERY, PROJECT_DETAILS_QUERY, SupabaseTableNames } from './queries';
import { supabaseClient } from './supabaseService';

export const createProject = async (payload: any) => {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .insert([{ ...payload }])
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }
    useEditorStore.setState({
      allProjects: [...useEditorStore.getState().allProjects, ...data],
    });
    toast.success('Project created successfully');
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
};

export const getProjectById = async (id: string) => {
  if (typeof id !== 'string') {
    toast.error('Id muss eine Zeichenfolge sein');
  }
  try {
    const { data, error } = await supabaseClient
      .from(SupabaseTableNames.project)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error(error.message);
    }

    if (!data) {
      toast.error('Project not found');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
};
export const getProjectDetailsById = async (id: string) => {
  if (typeof id !== 'string') {
    toast.error('Id muss eine Zeichenfolge sein');
  }

  try {
    const { data, error } = await supabaseClient
      .from(SupabaseTableNames.project)
      .select(PROJECT_DETAILS_QUERY)
      .eq('id', id)
      .limit(1)
      .single();
    if (error) {
      toast.error(error.message);
    }
    if (!data) {
      toast.error(languageData.toastMessage.error.notFound);
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
};

export const getProjects = async (
  columns: string = '*',
  filter?: Record<string, any>,
): Promise<ProjectResponse[] | null> => {
  try {
    let query = supabaseClient.from(SupabaseTableNames.project).select(columns);

    // Apply filter if provided
    if (filter) {
      for (const key in filter) {
        query = query.eq(key, filter[key]);
      }
    }

    const { data, error }: any = await query;

    if (error) {
      return null;
    }

    return data as ProjectResponse[];
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
    return null;
  }
};

export const getProjectsListing = async ({
  status,
  request,
}: {
  status?: 'open' | 'finished';
  request: Request;
}) => {
  try {
    // Fetch search params
    const { per_page = 10, page = 1 } = extractSearchQuery(request?.url);

    let query = supabaseClient.from(SupabaseTableNames.project).select(LIST_QUERY);
    if (status) {
      query = query.eq('status', status);
    }

    // Inner-Sales-Agent check
    let innerSale = false;
    await supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const jwt = jwtDecode(session.access_token) as any;
        const userRole = jwt.user_role as UserRoles;
        if (userRole === 'inner_sales_agent') {
          innerSale = true;
        }
      }
    });
    if (innerSale) {
      query = query.or('created_by_role.not.eq.outer_sales_agent, locked.eq.true');
    }
    // Fetch count
    let countQuery = supabaseClient
      .from(SupabaseTableNames.project)
      .select('id', { count: 'exact' });
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (innerSale) {
      countQuery = countQuery.or(
        'created_by_role.not.eq.outer_sales_agent, locked.eq.true',
      );
    }
    const { count, error: countError } = await countQuery;
    if (countError) {
      return toast.error(countError.message);
    }
    const totalRows = count;

    // Apply pagination
    const offset = (Number(page) - 1) * Number(per_page);
    query = query.range(offset, offset + Number(per_page) - 1);
    const { data, error } = await query.order('id', { ascending: false });
    if (error) {
      return toast.error(error.message);
    }

    // Final data
    return { totalRows: totalRows, data: data } as unknown as {
      totalRows: number;
      data: ProjectResponse[];
    };
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
};

export const deleteProject = async (id: string) => {
  try {
    const { data, error } = await supabaseClient
      .from(SupabaseTableNames.project)
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      return toast.error(error.message);
    }
    toast.success(languageData.toastMessage.success.deleted);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error(languageData.toastMessage.error.common);
    }
  }
};

export const lockProject = async (id: string) => {
  try {
    const { data, error } = await supabaseClient
      .from(SupabaseTableNames.project)
      .update({ locked: true })
      .eq('id', id);

    if (error) {
      return toast.error(error.message);
    }
    toast.success(languageData.toastMessage.success.locked);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};
