// =====================================================
// LOCALSTORAGE CLEAR SCRIPT
// =====================================================
// Run this in your browser console to clear localStorage

console.log('🧹 Clearing localStorage...');

// Clear all job application related data
localStorage.removeItem('jobApplications');
localStorage.removeItem('onboardingCompleted');
localStorage.removeItem('theme');

// Clear any other potential data
localStorage.removeItem('user');
localStorage.removeItem('auth');
localStorage.removeItem('supabase.auth.token');

console.log('✅ localStorage cleared successfully!');

// Show what's left in localStorage
console.log('📋 Remaining localStorage items:');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(`  - ${key}: ${localStorage.getItem(key)}`);
}

// Reload the page to start fresh
console.log('🔄 Reloading page...');
setTimeout(() => {
    window.location.reload();
}, 1000);

// =====================================================
// ALTERNATIVE: Manual localStorage inspection
// =====================================================

// To manually check what's in localStorage, run this:
function inspectLocalStorage() {
    console.log('🔍 Current localStorage contents:');
    if (localStorage.length === 0) {
        console.log('  localStorage is empty');
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`  ${key}: ${value}`);
        }
    }
}

// To clear specific items only:
function clearJobData() {
    localStorage.removeItem('jobApplications');
    localStorage.removeItem('onboardingCompleted');
    console.log('✅ Job application data cleared');
}

// To backup localStorage before clearing:
function backupLocalStorage() {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backup[key] = localStorage.getItem(key);
    }
    console.log('💾 localStorage backup:', backup);
    return backup;
}

// =====================================================
// USAGE INSTRUCTIONS
// =====================================================

/*
To use this script:

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Copy and paste the entire script above
4. Press Enter to execute

Or run individual functions:

- inspectLocalStorage() - See what's in localStorage
- clearJobData() - Clear only job-related data
- backupLocalStorage() - Create a backup before clearing

The script will automatically reload the page after clearing localStorage.
*/

