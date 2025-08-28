// =====================================================
// DEBUG SILENT FAILURE - NO CONSOLE ERRORS BUT NO DATA
// =====================================================
// Run this in your browser console to debug silent failures

// Test 1: Check if the save function is actually being called
async function testSaveFunctionCall() {
  console.log('🔍 Testing if save function is being called...');
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ No authenticated user found');
      return false;
    }
    
    console.log('✅ User found:', user.email);
    
    // Test the actual save function
    const testData = {
      company: 'Silent Test Company',
      role: 'Silent Test Role',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      notes: 'Testing silent failure'
    };
    
    console.log('📝 Attempting to save:', testData);
    
    const { data, error } = await supabase
      .rpc('add_job_application', {
        user_email: user.email,
        company_name: testData.company,
        role_name: testData.role,
        status_name: testData.status,
        applied_date_val: testData.applied_date,
        notes_text: testData.notes
      });
    
    if (error) {
      console.error('❌ RPC call failed:', error);
      return false;
    }
    
    console.log('✅ RPC call successful, returned ID:', data);
    return data;
  } catch (error) {
    console.error('❌ Exception in save function:', error);
    return false;
  }
}

// Test 2: Check if data actually exists in database
async function checkDataInDatabase() {
  console.log('🗄️ Checking if data exists in database...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ No user to check');
      return;
    }
    
    // Check users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    if (userError) {
      console.error('❌ Error checking users table:', userError);
    } else {
      console.log('✅ User found in database:', userData);
    }
    
    // Check job_applications table
    const { data: appsData, error: appsError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (appsError) {
      console.error('❌ Error checking job_applications table:', appsError);
    } else {
      console.log('✅ Job applications found:', appsData?.length || 0);
      if (appsData && appsData.length > 0) {
        console.log('📋 Latest applications:', appsData.slice(0, 3));
      }
    }
  } catch (error) {
    console.error('❌ Error in checkDataInDatabase:', error);
  }
}

// Test 3: Check if the frontend is actually calling the save function
function monitorSaveFunction() {
  console.log('👀 Monitoring save function calls...');
  
  // Override the addJobApplicationByEmail function to add logging
  const originalFunction = window.addJobApplicationByEmail;
  
  window.addJobApplicationByEmail = async function(email, applicationData) {
    console.log('🎯 Save function called with:', { email, applicationData });
    
    try {
      const result = await originalFunction(email, applicationData);
      console.log('✅ Save function returned:', result);
      return result;
    } catch (error) {
      console.error('❌ Save function failed:', error);
      throw error;
    }
  };
  
  console.log('✅ Monitoring active - try saving a job application now');
}

// Test 4: Check if the RPC function exists and is callable
async function testRPCFunctionExists() {
  console.log('🔧 Testing if RPC function exists...');
  
  try {
    // Try to call with invalid data to see if function exists
    const { data, error } = await supabase
      .rpc('add_job_application', {
        user_email: 'nonexistent@test.com',
        company_name: 'Test',
        role_name: 'Test',
        status_name: 'Applied',
        applied_date_val: null,
        notes_text: 'Test'
      });
    
    if (error) {
      if (error.message.includes('function') || error.message.includes('does not exist')) {
        console.error('❌ RPC function does not exist:', error.message);
        return false;
      } else {
        console.log('✅ RPC function exists (expected error for non-existent user):', error.message);
        return true;
      }
    }
    
    console.log('✅ RPC function exists and works');
    return true;
  } catch (error) {
    console.error('❌ Error testing RPC function:', error);
    return false;
  }
}

// Test 5: Check if the frontend is using the right function
function checkFrontendCode() {
  console.log('🔍 Checking frontend code...');
  
  // Check if the userService is properly imported
  if (typeof window.addJobApplicationByEmail === 'function') {
    console.log('✅ addJobApplicationByEmail function is available');
  } else {
    console.log('❌ addJobApplicationByEmail function not found');
  }
  
  // Check if supabase client is available
  if (typeof supabase !== 'undefined') {
    console.log('✅ Supabase client is available');
  } else {
    console.log('❌ Supabase client not found');
  }
}

// Main debugging function
async function debugSilentFailure() {
  console.log('🚀 Starting Silent Failure Debug...\n');
  
  // Test 1: Check frontend code
  checkFrontendCode();
  console.log('');
  
  // Test 2: Check if RPC function exists
  const rpcExists = await testRPCFunctionExists();
  console.log('');
  
  // Test 3: Monitor save function
  monitorSaveFunction();
  console.log('');
  
  // Test 4: Check current data in database
  await checkDataInDatabase();
  console.log('');
  
  // Test 5: Try a test save
  console.log('💾 Attempting test save...');
  const saveResult = await testSaveFunctionCall();
  console.log('');
  
  // Test 6: Check if test data appeared
  if (saveResult) {
    console.log('🔄 Checking if test data appeared...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await checkDataInDatabase();
  }
  
  console.log('\n🔍 Debug complete!');
  console.log('💡 If you see "Save function called" but no data appears, the issue is in the database');
  console.log('💡 If you don\'t see "Save function called", the issue is in the frontend');
}

// Export functions for manual testing
window.debugSilentFailure = {
  testSaveFunctionCall,
  checkDataInDatabase,
  monitorSaveFunction,
  testRPCFunctionExists,
  checkFrontendCode,
  debugSilentFailure
};

console.log('📝 Debug functions available:');
console.log('- debugSilentFailure.debugSilentFailure()');
console.log('- debugSilentFailure.testSaveFunctionCall()');
console.log('- debugSilentFailure.checkDataInDatabase()');
console.log('- debugSilentFailure.monitorSaveFunction()');
