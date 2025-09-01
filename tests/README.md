# Electron Towers - Testing Suite

This directory contains comprehensive automated tests for the Electron Towers application.

## 🧪 Test Coverage

### **Core Functionality Tests** (`core-functionality.test.js`)
- App initialization and loading
- Periodic table structure and elements
- Toolbar controls and functionality
- Game area components
- Responsive design implementation
- Touch and mobile support
- Accessibility features
- Error handling

### **Mobile Responsiveness Tests** (`mobile-responsiveness.test.js`)
- Mobile layout (768px and below)
- Small mobile layout (480px and below)
- iPad layout (768px - 1024px)
- Touch interactions and touch-friendly elements
- Responsive typography
- Mobile navigation
- Mobile performance optimizations
- Cross-device compatibility

### **Electron Tower Tests** (`electron-tower.test.js`)
- Building area structure
- Energy levels (floors)
- Electron lobby functionality
- Electron units and slots
- Game mechanics and scoring
- Configuration display
- Actions and controls
- Responsive building layout
- Accessibility features

## 🚀 Running Tests

### **Install Dependencies**
```bash
npm install
```

### **Run All Tests**
```bash
npm test
```

### **Run Specific Test Suites**
```bash
# Core functionality only
npm run test:core

# Mobile responsiveness only
npm run test:mobile

# Electron tower only
npm run test:tower
```

### **Watch Mode (Development)**
```bash
npm run test:watch
```

### **Generate Coverage Report**
```bash
npm run test:coverage
```

## 🛠️ Test Configuration

### **Jest Configuration** (`jest.config.js`)
- **Environment**: jsdom (DOM simulation)
- **Test Timeout**: 10 seconds
- **Coverage Reports**: Text, HTML, and LCOV formats
- **Test Matching**: `tests/**/*.test.js`

### **Test Setup** (`setup.js`)
- Browser API mocks (ResizeObserver, IntersectionObserver)
- Local storage and session storage mocks
- Match media mocks for responsive testing
- Touch event support
- Console output suppression

### **Test Utilities** (`utils.js`)
- HTML loading and DOM setup
- Touch event creation
- Drag and drop event simulation
- Window resize mocking
- Device pixel ratio mocking
- Element creation helpers

## 📱 Mobile Testing Features

### **Responsive Breakpoints**
- **Desktop**: 1024px+
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: <480px

### **Touch Testing**
- Touch event simulation
- Touch-friendly element validation
- Minimum touch target sizes (44px)
- Touch action properties

### **Device Simulation**
- Screen size mocking
- Device pixel ratio simulation
- Orientation testing (portrait/landscape)
- Density testing

## 🔍 Test Validation

### **UI Elements**
- Element presence and structure
- CSS properties and styling
- Responsive behavior
- Touch-friendly dimensions

### **Functionality**
- Button interactions
- Form validation
- Game mechanics
- Configuration updates

### **Accessibility**
- ARIA labels
- Semantic HTML
- Color contrast
- Keyboard navigation

### **Performance**
- CSS variable usage
- Responsive breakpoints
- Touch optimizations
- Smooth scrolling

## 📊 Coverage Reports

After running `npm run test:coverage`, you'll get:

- **Text Report**: Console output with coverage summary
- **HTML Report**: Detailed coverage in `coverage/lcov-report/index.html`
- **LCOV Report**: Coverage data for CI/CD integration

## 🐛 Troubleshooting

### **Common Issues**

1. **jsdom Environment**: Tests run in a simulated DOM environment
2. **Async Operations**: Use `waitFor()` utility for async conditions
3. **CSS Computed Styles**: Some CSS properties may not be fully simulated
4. **Browser APIs**: Complex browser APIs are mocked

### **Debug Mode**
```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test -- tests/core-functionality.test.js

# Run single test
npm test -- --testNamePattern="should load the app successfully"
```

## 🔄 Continuous Integration

### **GitHub Actions Example**
```yaml
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 📝 Adding New Tests

### **Test Structure**
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    loadHTML(); // Load fresh HTML for each test
  });

  afterEach(() => {
    document.documentElement.innerHTML = ''; // Clean up
  });

  test('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

### **Best Practices**
- Use descriptive test names
- Test one thing per test case
- Use proper setup and teardown
- Mock external dependencies
- Test both success and failure cases
- Include accessibility testing
- Test responsive behavior

## 🎯 Test Goals

- **100% Core Functionality Coverage**
- **Comprehensive Mobile Testing**
- **Accessibility Compliance**
- **Performance Validation**
- **Cross-Device Compatibility**
- **Error Handling Verification**

---

**Note**: These tests are designed to run in a Node.js environment with jsdom simulation. For full browser testing, consider using Puppeteer or Playwright for end-to-end testing.
