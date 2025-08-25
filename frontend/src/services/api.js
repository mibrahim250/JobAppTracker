import { supabase } from '../config/supabase';

export const fetchApplications = async () => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchApplication = async (id) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createApplication = async (applicationData) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('job_applications')
      .insert([{
        ...applicationData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateApplication = async (id, applicationData) => {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .update(applicationData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteApplication = async (id) => {
  try {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
