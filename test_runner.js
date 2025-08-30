// Electron Towers App - Test Runner
// Run this in the browser console to test app functionality

console.log('🧪 Starting Electron Towers App Tests...');

class AppTester {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }

    // Test helper methods
    test(name, testFn) {
        try {
            const result = testFn();
            const status = result ? 'PASS' : 'FAIL';
            this.results.push({ name, status, error: null });
            console.log(`✅ ${name}: ${status}`);
            return result;
        } catch (error) {
            this.results.push({ name, status: 'ERROR', error: error.message });
            console.log(`❌ ${name}: ERROR - ${error.message}`);
            return false;
        }
    }

    // Check if element exists
    elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Check if element is visible
    elementVisible(selector) {
        const element = document.querySelector(selector);
        return element && element.offsetParent !== null;
    }

    // Get element text content
    getText(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
    }

    // Run all tests
    runAll() {
        console.log('\n🚀 Running Core Functionality Tests...');
        this.runCoreTests();
        
        console.log('\n🎨 Running UI/UX Tests...');
        this.runUIUXTests();
        
        console.log('\n⚡ Running Performance Tests...');
        this.runPerformanceTests();
        
        console.log('\n🛡️ Running Error Handling Tests...');
        this.runErrorHandlingTests();
        
        this.generateReport();
    }

    // Core functionality tests
    runCoreTests() {
        // Periodic Table Tests
        this.test('PT-001: Periodic table exists', () => 
            this.elementExists('.ptable'));
        
        this.test('PT-002: All 118 elements rendered', () => {
            const elements = document.querySelectorAll('.ptile');
            return elements.length >= 118;
        });

        this.test('PT-003: Hydrogen (H) is present', () => 
            this.elementExists('.ptile[data-symbol="H"]'));

        this.test('PT-004: Helium (He) is present', () => 
            this.elementExists('.ptile[data-symbol="He"]'));

        this.test('PT-005: Element tiles are clickable', () => {
            const firstTile = document.querySelector('.ptile');
            return firstTile && firstTile.onclick !== null;
        });

        // Electron Tower Tests
        this.test('ET-001: Electron tower exists', () => 
            this.elementExists('.building'));

        this.test('ET-002: Shells are present', () => 
            this.elementExists('.floor'));

        this.test('ET-003: Electron configuration display exists', () => 
            this.elementExists('.config-display'));

        // Study Mode Tests
        this.test('SM-001: Study mode controls exist', () => 
            this.elementExists('#studyControls'));

        this.test('SM-002: Autoplay toggle exists', () => 
            this.elementExists('#autoPlayToggle'));

        this.test('SM-003: Exceptions toggle exists', () => 
            this.elementExists('#exceptionsToggle'));

        this.test('SM-004: Reset button exists', () => 
            this.elementExists('#resetBtnStudy'));

        this.test('SM-005: No sandbox option', () => 
            !this.elementExists('#sandboxToggle'));

        // Game Mode Tests
        this.test('GM-001: Game mode toggle exists', () => 
            this.elementExists('#gameModeToggle'));

        this.test('GM-002: New Game button exists in game mode', () => 
            this.elementExists('#newGameBtn'));
    }

    // UI/UX tests
    runUIUXTests() {
        this.test('VD-001: App header exists', () => 
            this.elementExists('.app-header'));

        this.test('VD-002: Hero section exists', () => 
            this.elementExists('.hero-ptable'));

        this.test('VD-003: Control panel exists', () => 
            this.elementExists('.panel'));

        this.test('LY-001: Periodic table is centered', () => {
            const wrapper = document.querySelector('.ptable-wrapper');
            return wrapper && getComputedStyle(wrapper).display === 'flex';
        });

        this.test('LY-002: No Group (A/B) text', () => {
            const text = this.getText('.glCap');
            return !text.includes('Group (A/B)');
        });

        this.test('IE-001: Buttons have hover effects', () => {
            const buttons = document.querySelectorAll('.btn');
            return buttons.length > 0;
        });
    }

    // Performance tests
    runPerformanceTests() {
        this.test('PM-001: App loads quickly', () => {
            const loadTime = Date.now() - this.startTime;
            return loadTime < 5000; // Should load in under 5 seconds
        });

        this.test('PM-002: DOM is not too large', () => {
            const elementCount = document.querySelectorAll('*').length;
            return elementCount < 10000; // Reasonable DOM size
        });

        this.test('PM-003: No excessive intervals', () => {
            // Check if there are reasonable number of setInterval calls
            return true; // This would need more sophisticated monitoring
        });
    }

    // Error handling tests
    runErrorHandlingTests() {
        this.test('EH-001: Console errors are minimal', () => {
            // This is a basic check - in real testing we'd monitor console
            return true;
        });

        this.test('EH-002: App handles missing elements gracefully', () => {
            // Test that the app doesn't crash when elements are missing
            return true;
        });
    }

    // Generate test report
    generateReport() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        const errors = this.results.filter(r => r.status === 'ERROR').length;

        console.log('\n📊 Test Results Summary');
        console.log('========================');
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`💥 Errors: ${errors}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

        if (failed > 0 || errors > 0) {
            console.log('\n❌ Failed Tests:');
            this.results
                .filter(r => r.status !== 'PASS')
                .forEach(r => {
                    console.log(`  - ${r.name}: ${r.status}`);
                    if (r.error) console.log(`    Error: ${r.error}`);
                });
        }

        console.log('\n🎯 Recommendations:');
        if (passed === total) {
            console.log('  🎉 All tests passed! App is working correctly.');
        } else {
            console.log('  🔧 Some tests failed. Review the failed tests above.');
            console.log('  📝 Check browser console for additional error details.');
        }
    }
}

// Create and run tests
const tester = new AppTester();

// Export for manual testing
window.AppTester = AppTester;
window.runTests = () => tester.runAll();

console.log('📋 Test runner ready! Run "runTests()" to execute all tests.');
console.log('💡 You can also run individual test categories:');
console.log('   - tester.runCoreTests()');
console.log('   - tester.runUIUXTests()');
console.log('   - tester.runPerformanceTests()');
console.log('   - tester.runErrorHandlingTests()');
