// Simple test to check congratulations modal
console.log('🧪 Simple Congratulations Test');

// Check if modal exists
const modal = document.getElementById('congratulationsModal');
if (modal) {
    console.log('✅ Modal found');
    console.log('Modal classes:', modal.className);
    console.log('Modal display:', getComputedStyle(modal).display);
    console.log('Modal visibility:', getComputedStyle(modal).visibility);
    console.log('Modal opacity:', getComputedStyle(modal).opacity);
} else {
    console.log('❌ Modal not found');
}

// Check if showCongratulations function exists
if (typeof window.showCongratulations === 'function') {
    console.log('✅ showCongratulations function exists');
    
    // Try to call it
    console.log('🎯 Calling showCongratulations...');
    try {
        window.showCongratulations();
        console.log('✅ Function called successfully');
        
        // Check modal state after call
        setTimeout(() => {
            if (modal) {
                console.log('🔍 After function call:');
                console.log('Modal classes:', modal.className);
                console.log('Modal display:', getComputedStyle(modal).display);
                console.log('Modal visibility:', getComputedStyle(modal).visibility);
                console.log('Modal opacity:', getComputedStyle(modal).opacity);
                
                if (modal.classList.contains('hidden')) {
                    console.log('⚠️ Modal still has hidden class');
                } else {
                    console.log('✅ Modal hidden class removed');
                }
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error calling function:', error);
    }
} else {
    console.log('❌ showCongratulations function not found');
}

// Check game state
if (window.state) {
    console.log('📊 Game State:');
    console.log('  - Target Z:', window.state.targetZ);
    console.log('  - Mode:', window.state.mode);
    console.log('  - Queue length:', window.state.queue.length);
} else {
    console.log('❌ No game state');
}
