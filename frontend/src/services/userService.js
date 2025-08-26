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
              email: user.email
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
