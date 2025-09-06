// Test utilities for Electron Towers app

/**
 * Load the HTML file and set up the DOM
 */
function loadHTML(filename = 'study.html') {
  const fs = require('fs');
  const path = require('path');
  
  const htmlPath = path.join(__dirname, '..', filename);
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  document.documentElement.innerHTML = html;
  
  // Execute JavaScript from the HTML file with proper isolation
  const scripts = document.querySelectorAll('script');
  let scriptContent = '';
  
  scripts.forEach(script => {
    scriptContent += script.textContent + '\n';
  });
  
  // Execute all scripts in a single context to avoid redeclaration issues
  try {
    // Wrap in IIFE to avoid global conflicts
    const wrappedScript = `
      (function() {
        ${scriptContent}
      })();
    `;
    
    // Use eval in a controlled way for testing
    eval(wrappedScript);
  } catch (error) {
    console.warn('Script execution warning:', error.message);
  }
  
  // Trigger DOMContentLoaded
  const event = new Event('DOMContentLoaded');
  document.dispatchEvent(event);
}

/**
 * Wait for a condition to be true
 */
function waitFor(condition, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (condition()) {
        resolve();
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
        return;
      }
      
      setTimeout(check, 10);
    };
    
    check();
  });
}

/**
 * Mock touch events
 */
function createTouchEvent(type, x, y) {
  return new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 1,
    touches: [{
      identifier: 1,
      target: document.elementFromPoint(x, y),
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 10,
      force: 0.5,
    }],
    targetTouches: [],
    changedTouches: [],
  });
}

/**
 * Mock drag and drop events
 */
function createDragEvent(type, dataTransfer = {}) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  event.dataTransfer = {
    setData: jest.fn(),
    getData: jest.fn(),
    setDragImage: jest.fn(),
    ...dataTransfer,
  };
  return event;
}

/**
 * Get element by test ID
 */
function getByTestId(testId) {
  return document.querySelector(`[data-testid="${testId}"]`);
}

/**
 * Mock window resize
 */
function mockResize(width, height) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
}

/**
 * Mock device pixel ratio
 */
function mockDevicePixelRatio(ratio) {
  Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: ratio,
  });
}

/**
 * Create a mock periodic table element
 */
function createMockElement(atomicNumber, symbol, block) {
  const element = document.createElement('div');
  element.className = `ptile ${block}`;
  element.setAttribute('data-z', atomicNumber);
  element.innerHTML = `
    <div class="z">${atomicNumber}</div>
    <div class="sym">${symbol}</div>
  `;
  return element;
}

// Export all functions
module.exports = {
  loadHTML,
  waitFor,
  createTouchEvent,
  createDragEvent,
  getByTestId,
  mockResize,
  mockDevicePixelRatio,
  createMockElement
};
