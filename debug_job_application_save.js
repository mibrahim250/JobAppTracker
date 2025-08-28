// =====================================================
// DEBUG JOB APPLICATION SAVE ISSUES
// =====================================================
// Run this in your browser console to debug job application saves

// Test 1: Check Supabase Connection
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    console.log('✅ Supabase connection successful');
    console.log('📊 Session data:', data);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

// Test 2: Check Current User
async function testCurrentUser() {
  console.log('👤 Testing Current User...');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
    
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('🔐 User ID:', user.id);
      console.log('📧 Email confirmed:', user.email_confirmed_at);
      return user;
    } else {
      console.log('❌ No authenticated user found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error in testCurrentUser:', error);
    return null;
  }
}

// Test 3: Check if RPC function exists
async function testRPCFunction() {
  console.log('🔧 Testing RPC Function...');
  
  try {
    // Try to call the function with dummy data
    const { data, error } = await supabase
      .rpc('add_job_application', {
        user_email: 'test@example.com',
        company_name: 'Test Company',
        role_name: 'Test Role',
        status_name: 'Applied',
        applied_date_val: null,
        notes_text: 'Test notes'
      });
    
    if (error) {
      console.error('❌ RPC function error:', error);
      console.log('💡 This might mean:');
      console.log('   • The function does not exist');
      console.log('   • The function parameters are wrong');
      console.log('   • The user does not exist in the database');
      return false;
    }
    
    console.log('✅ RPC function exists and is callable');
    return true;
  } catch (error) {
    console.error('❌ RPC function test failed:', error);
    return false;
  }
}

// Test 4: Check if user exists in database
async function testUserInDatabase(userEmail) {
  console.log('🗄️ Testing User in Database...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (error) {
      console.error('❌ Error checking user in database:', error);
      if (error.code === 'PGRST116') {
        console.log('💡 User does not exist in users table');
        console.log('💡 This is likely the issue!');
        return false;
      }
      return false;
    }
    
    console.log('✅ User found in database:', data);
    return true;
  } catch (error) {
    console.error('❌ Error in testUserInDatabase:', error);
    return false;
  }
}

// Test 5: Check if job_applications table exists
async function testJobApplicationsTable() {
  console.log('📋 Testing Job Applications Table...');
  
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing job_applications table:', error);
      console.log('💡 This might mean:');
      console.log('   • The table does not exist');
      console.log('   • RLS policies are blocking access');
      console.log('   • The table name is wrong');
      return false;
    }
    
    console.log('✅ job_applications table exists and is accessible');
    return true;
  } catch (error) {
    console.error('❌ Error in testJobApplicationsTable:', error);
    return false;
  }
}

// Test 6: Simulate actual job application save
async function testJobApplicationSave(userEmail) {
  console.log('💾 Testing Job Application Save...');
  
  try {
    const testData = {
      company: 'Debug Test Company',
      role: 'Debug Test Role',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      notes: 'This is a test application for debugging'
    };
    
    console.log('📝 Test data:', testData);
    
    const { data, error } = await supabase
      .rpc('add_job_application', {
        user_email: userEmail,
        company_name: testData.company,
        role_name: testData.role,
        status_name: testData.status,
        applied_date_val: testData.applied_date,
        notes_text: testData.notes
      });
    
    if (error) {
      console.error('❌ Job application save failed:', error);
      console.log('💡 Error details:', error);
      return false;
    }
    
    console.log('✅ Job application saved successfully!');
    console.log('🆔 Application ID:', data);
    return data;
  } catch (error) {
    console.error('❌ Error in testJobApplicationSave:', error);
    return false;
  }
}

// Test 7: Check RLS policies
async function testRLSPolicies() {
  console.log('🔒 Testing RLS Policies...');
  
  try {
    // Try to read from job_applications table
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ RLS policy error:', error);
      console.log('💡 This might mean RLS policies are blocking access');
      return false;
    }
    
    console.log('✅ RLS policies allow access');
    console.log('📊 Found applications:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Error in testRLSPolicies:', error);
    return false;
  }
}

// Main debugging function
async function debugJobApplicationSave() {
  console.log('🚀 Starting Job Application Save Debug...\n');
  
  // Test 1: Supabase Connection
  const connectionOk = await testSupabaseConnection();
  if (!connectionOk) {
    console.log('\n❌ STOPPING: Supabase connection failed');
    return;
  }
  console.log('');
  
  // Test 2: Current User
  const user = await testCurrentUser();
  if (!user) {
    console.log('\n❌ STOPPING: No authenticated user');
    return;
  }
  console.log('');
  
  // Test 3: RPC Function
  const rpcOk = await testRPCFunction();
  if (!rpcOk) {
    console.log('\n❌ STOPPING: RPC function not working');
    return;
  }
  console.log('');
  
  // Test 4: User in Database
  const userInDb = await testUserInDatabase(user.email);
  if (!userInDb) {
    console.log('\n❌ ISSUE FOUND: User not in database!');
    console.log('💡 Solution: Run the user setup SQL scripts');
    return;
  }
  console.log('');
  
  // Test 5: Job Applications Table
  const tableOk = await testJobApplicationsTable();
  if (!tableOk) {
    console.log('\n❌ STOPPING: Job applications table not accessible');
    return;
  }
  console.log('');
  
  // Test 6: RLS Policies
  const rlsOk = await testRLSPolicies();
  if (!rlsOk) {
    console.log('\n❌ ISSUE FOUND: RLS policies blocking access');
    return;
  }
  console.log('');
  
  // Test 7: Actual Save
  const saveResult = await testJobApplicationSave(user.email);
  if (saveResult) {
    console.log('\n✅ SUCCESS: Job application save is working!');
    console.log('💡 The issue might be in the frontend code or user interface');
  } else {
    console.log('\n❌ ISSUE FOUND: Job application save failed');
  }
  
  console.log('\n🔍 Debug complete!');
}

// Export functions for manual testing
window.debugJobApplication = {
  testSupabaseConnection,
  testCurrentUser,
  testRPCFunction,
  testUserInDatabase,
  testJobApplicationsTable,
  testJobApplicationSave,
  testRLSPolicies,
  debugJobApplicationSave
};

console.log('📝 Debug functions available:');
console.log('- debugJobApplication.debugJobApplicationSave()');
console.log('- debugJobApplication.testCurrentUser()');
console.log('- debugJobApplication.testRPCFunction()');
console.log('- debugJobApplication.testUserInDatabase(email)');
