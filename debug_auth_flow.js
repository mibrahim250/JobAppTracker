// =====================================================
// DEBUG AUTHENTICATION FLOW
// =====================================================
// Run this in your browser console to debug the auth flow

// Test 1: Check Supabase Auth Settings
async function checkAuthSettings() {
  console.log('🔍 Checking Supabase Auth Settings...');
  
  try {
    // Try to sign up a test user
    const { data, error } = await supabase.auth.signUp({
      email: 'test-debug@example.com',
      password: 'testpassword123',
      options: {
        data: {
          username: 'testuser'
        }
      }
    });
    
    if (error) {
      console.log('❌ Signup error:', error);
      return;
    }
    
    console.log('✅ Signup successful:', data);
    console.log('📧 Email confirmed at:', data.user?.email_confirmed_at);
    console.log('🔐 User ID:', data.user?.id);
    
    // Check if email confirmation is required
    if (data.user && !data.user.email_confirmed_at) {
      console.log('⚠️ Email confirmation is required');
    } else {
      console.log('❌ Email confirmation is NOT required - this is the problem!');
    }
    
  } catch (error) {
    console.error('❌ Error in auth test:', error);
  }
}

// Test 2: Check current user verification status
async function checkCurrentUser() {
  console.log('🔍 Checking current user...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('📧 Email confirmed at:', user.email_confirmed_at);
      console.log('🔐 User ID:', user.id);
      console.log('📝 User metadata:', user.user_metadata);
      
      if (user.email_confirmed_at) {
        console.log('✅ Email is verified');
      } else {
        console.log('❌ Email is NOT verified');
      }
    } else {
      console.log('❌ No user found');
    }
  } catch (error) {
    console.error('❌ Error getting user:', error);
  }
}

// Test 3: Check Supabase project settings
function checkProjectSettings() {
  console.log('🔧 Supabase Project Settings Check:');
  console.log('1. Go to Supabase Dashboard > Authentication > Settings');
  console.log('2. Make sure "Confirm email" is ENABLED');
  console.log('3. Set Site URL to: http://localhost:3000');
  console.log('4. Check if "Enable email confirmations" is ON');
  console.log('5. Check if "Secure email change" is ON');
}

// Test 4: Test email verification flow
async function testEmailVerificationFlow() {
  console.log('🔍 Testing email verification flow...');
  
  try {
    // Step 1: Sign up
    const { data, error } = await supabase.auth.signUp({
      email: 'test-verification@example.com',
      password: 'testpassword123',
      options: {
        data: {
          username: 'testverification'
        }
      }
    });
    
    if (error) {
      console.log('❌ Signup error:', error);
      return;
    }
    
    console.log('✅ Signup successful');
    console.log('📧 Email confirmed at:', data.user?.email_confirmed_at);
    
    // Step 2: Try to sign in immediately
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test-verification@example.com',
      password: 'testpassword123'
    });
    
    if (signInError) {
      console.log('❌ Sign in error:', signInError);
      console.log('✅ This is expected - email verification is working!');
    } else {
      console.log('⚠️ Sign in successful without email verification');
      console.log('❌ This means email verification is NOT working properly');
    }
    
  } catch (error) {
    console.error('❌ Error in verification test:', error);
  }
}

// Run all tests
async function runDebugTests() {
  console.log('🚀 Starting Authentication Debug Tests...\n');
  
  await checkCurrentUser();
  console.log('');
  
  await checkAuthSettings();
  console.log('');
  
  await testEmailVerificationFlow();
  console.log('');
  
  checkProjectSettings();
  console.log('\n✅ Debug tests completed!');
}

// Export functions for manual testing
window.debugAuth = {
  checkAuthSettings,
  checkCurrentUser,
  checkProjectSettings,
  testEmailVerificationFlow,
  runDebugTests
};

console.log('📝 Debug functions available:');
console.log('- debugAuth.checkAuthSettings()');
console.log('- debugAuth.checkCurrentUser()');
console.log('- debugAuth.testEmailVerificationFlow()');
console.log('- debugAuth.runDebugTests()');
