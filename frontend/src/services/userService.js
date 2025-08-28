import { supabase } from '../config/supabase';

export const registerUser = async (username, email, password) => {
  try {
    // Sign up the user with Supabase Auth
    // The trigger will automatically create the user profile in the users table
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Return the auth user data - the trigger will handle profile creation
    return authData.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUserData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user profile from our users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      // If user profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        const { data: newUserData, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              username: user.user_metadata?.username || user.email?.split('@')[0],
              email: user.email,
              email_verified: user.email_confirmed_at ? true : false
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return user;
        }
        return newUserData;
      }
      return user;
    }

    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_email', { user_email: email });

    if (error) {
      throw new Error(error.message);
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error(error.message);
  }
};

export const getApplicationsByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .rpc('get_applications_by_email', { user_email: email });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error getting applications by email:', error);
    throw new Error(error.message);
  }
};

export const addJobApplicationByEmail = async (email, applicationData) => {
  try {
    const { data, error } = await supabase
      .rpc('add_job_application', {
        user_email: email,
        company_name: applicationData.company,
        role_name: applicationData.role,
        status_name: applicationData.status,
        applied_date_val: applicationData.applied_date,
        notes_text: applicationData.notes || ''
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error adding job application:', error);
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
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

export const verifyUserEmail = async (token) => {
  try {
    const { data, error } = await supabase
      .rpc('verify_user_email', { verification_token: token });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw new Error(error.message);
  }
};

export const sendEmailVerification = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw new Error(error.message);
  }
};

export const checkEmailVerification = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if email is verified in auth
    if (user.email_confirmed_at) {
      // Update our users table to reflect verification
      await supabase
        .from('users')
        .update({ email_verified: true })
        .eq('id', user.id);
      
      return true;
    }

    // Also check our users table
    const { data: userData } = await supabase
      .from('users')
      .select('email_verified')
      .eq('id', user.id)
      .single();

    return userData?.email_verified || false;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
};

export const syncUserApplications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get applications from localStorage
    const savedApplications = localStorage.getItem('jobApplications');
    const localApplications = savedApplications ? JSON.parse(savedApplications) : [];
    
    // Filter applications for current user
    const userApplications = localApplications.filter(app => app.user_id === user.id);
    
    // Sync each application to database
    const syncedApplications = [];
    for (const app of userApplications) {
      try {
        const appId = await addJobApplicationByEmail(user.email, {
          company: app.company,
          role: app.role,
          status: app.status,
          applied_date: app.applied_date,
          notes: app.notes
        });
        
        syncedApplications.push({
          ...app,
          id: appId
        });
      } catch (error) {
        console.error('Error syncing application:', error);
      }
    }
    
    return syncedApplications;
  } catch (error) {
    console.error('Error syncing user applications:', error);
    return [];
  }
};
