// =====================================================
// TEST EMAIL VERIFICATION SETUP
// =====================================================
// Run this in your browser console to test email verification

// Test 1: Check if Supabase is connected
console.log('🔍 Testing Supabase Connection...');
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL || 'https://vigsbugdoluldgwcqkac.supabase.co');

// Test 2: Check current user
async function testCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('📧 Email confirmed at:', user.email_confirmed_at);
      console.log('🔐 User ID:', user.id);
      return user;
    } else {
      console.log('❌ No user found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return null;
  }
}

// Test 3: Check email verification status
async function testEmailVerification() {
  try {
    const user = await testCurrentUser();
    if (!user) return;

    // Check auth.users table
    const { data: authUser } = await supabase
      .from('auth.users')
      .select('email_confirmed_at')
      .eq('id', user.id)
      .single();

    console.log('📧 Auth email confirmed:', authUser?.email_confirmed_at);

    // Check public.users table
    const { data: publicUser } = await supabase
      .from('users')
      .select('email_verified')
      .eq('id', user.id)
      .single();

    console.log('✅ Public email verified:', publicUser?.email_verified);

    return {
      authConfirmed: !!authUser?.email_confirmed_at,
      publicVerified: publicUser?.email_verified
    };
  } catch (error) {
    console.error('❌ Error checking verification:', error);
  }
}

// Test 4: Send test verification email
async function testSendVerification() {
  try {
    const user = await testCurrentUser();
    if (!user) {
      console.log('❌ No user to send verification to');
      return;
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email
    });

    if (error) {
      console.error('❌ Error sending verification:', error);
    } else {
      console.log('✅ Verification email sent to:', user.email);
    }
  } catch (error) {
    console.error('❌ Error in test send verification:', error);
  }
}

// Test 5: Check Supabase Auth settings
function checkAuthSettings() {
  console.log('🔧 Auth Settings Check:');
  console.log('1. Go to Supabase Dashboard > Authentication > Settings');
  console.log('2. Make sure "Confirm email" is ENABLED');
  console.log('3. Set Site URL to: http://localhost:3000');
  console.log('4. Check Email Templates are configured');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Email Verification Tests...\n');
  
  await testCurrentUser();
  console.log('');
  
  await testEmailVerification();
  console.log('');
  
  await testSendVerification();
  console.log('');
  
  checkAuthSettings();
  console.log('\n✅ Tests completed!');
}

// Export functions for manual testing
window.testEmailVerification = {
  testCurrentUser,
  testEmailVerification,
  testSendVerification,
  checkAuthSettings,
  runAllTests
};

console.log('📝 Test functions available:');
console.log('- testEmailVerification.testCurrentUser()');
console.log('- testEmailVerification.testEmailVerification()');
console.log('- testEmailVerification.testSendVerification()');
console.log('- testEmailVerification.runAllTests()');
