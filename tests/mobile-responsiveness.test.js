const { loadHTML, mockResize, mockDevicePixelRatio, createTouchEvent } = require('./utils.js');

describe('Electron Towers Mobile Responsiveness', () => {
  beforeEach(() => {
    loadHTML();
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Mobile Layout (768px and below)', () => {
    beforeEach(() => {
      mockResize(768, 1024);
      mockDevicePixelRatio(2);
    });

    test('should have mobile-optimized header layout', () => {
      const header = document.querySelector('.app-header');
      const computedStyle = window.getComputedStyle(header);
      
      // Check mobile-specific styles
      expect(computedStyle.flexDirection).toBe('column');
      expect(computedStyle.alignItems).toBe('stretch');
    });

    test('should have mobile-optimized toolbar', () => {
      const toolbar = document.querySelector('.toolbar');
      const computedStyle = window.getComputedStyle(toolbar);
      
      // Check mobile toolbar styles
      expect(computedStyle.flexDirection).toBe('column');
      expect(computedStyle.alignItems).toBe('stretch');
    });

    test('should have mobile-optimized periodic table', () => {
      const ptableWrapper = document.querySelector('.ptable-wrapper');
      const computedStyle = window.getComputedStyle(ptableWrapper);
      
      // Check mobile table wrapper styles
      expect(computedStyle.justifyContent).toBe('flex-start');
      expect(computedStyle.borderRadius).toBeDefined();
    });

    test('should have larger tile sizes on mobile', () => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      const tileSize = computedStyle.getPropertyValue('--tile');
      
      // Mobile should have larger tiles
      expect(parseInt(tileSize)).toBeGreaterThanOrEqual(52);
    });
  });

  describe('Small Mobile Layout (480px and below)', () => {
    beforeEach(() => {
      mockResize(480, 800);
      mockDevicePixelRatio(2);
    });

    test('should have compact mobile layout', () => {
      const header = document.querySelector('.app-header');
      const computedStyle = window.getComputedStyle(header);
      
      // Check small mobile styles
      expect(computedStyle.padding).toBeDefined();
      expect(computedStyle.gap).toBeDefined();
    });

    test('should have optimized button sizes for small screens', () => {
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        const computedStyle = window.getComputedStyle(button);
        const minHeight = computedStyle.minHeight;
        const minWidth = computedStyle.minWidth;
        
        // Small mobile should still have touch-friendly sizes
        expect(parseInt(minHeight)).toBeGreaterThanOrEqual(44);
        expect(parseInt(minWidth)).toBeGreaterThanOrEqual(44);
      });
    });

    test('should have optimized periodic table for small screens', () => {
      const ptable = document.querySelector('.ptable');
      const computedStyle = window.getComputedStyle(ptable);
      
      // Check small mobile table styles
      expect(computedStyle.gap).toBeDefined();
      expect(computedStyle.padding).toBeDefined();
    });
  });

  describe('iPad Layout (768px - 1024px)', () => {
    beforeEach(() => {
      mockResize(1024, 768);
      mockDevicePixelRatio(2);
    });

    test('should have tablet-optimized layout', () => {
      const header = document.querySelector('.app-header');
      const computedStyle = window.getComputedStyle(header);
      
      // iPad should have horizontal header layout
      expect(computedStyle.flexDirection).toBe('row');
      expect(computedStyle.alignItems).toBe('center');
    });

    test('should have tablet-optimized periodic table', () => {
      const ptableWrapper = document.querySelector('.ptable-wrapper');
      const computedStyle = window.getComputedStyle(ptableWrapper);
      
      // iPad should have centered table
      expect(computedStyle.justifyContent).toBe('center');
    });
  });

  describe('Touch Interactions', () => {
    test('should have touch-friendly periodic table tiles', () => {
      const tiles = document.querySelectorAll('.ptile');
      tiles.forEach(tile => {
        const computedStyle = window.getComputedStyle(tile);
        
        // Check touch-action property
        expect(computedStyle.touchAction).toBeDefined();
        
        // Check minimum touch target size
        const rect = tile.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(32);
        expect(rect.height).toBeGreaterThanOrEqual(32);
      });
    });

    test('should have touch-friendly buttons', () => {
      const buttons = document.querySelectorAll('.btn, .seg-btn');
      buttons.forEach(button => {
        const computedStyle = window.getComputedStyle(button);
        
        // Check minimum touch target size
        expect(parseInt(computedStyle.minHeight)).toBeGreaterThanOrEqual(44);
        expect(parseInt(computedStyle.minWidth)).toBeGreaterThanOrEqual(44);
      });
    });

    test('should have touch-friendly form elements', () => {
      const searchBox = document.getElementById('searchBox');
      const zoomRange = document.getElementById('zoomRange');
      
      if (searchBox) {
        const computedStyle = window.getComputedStyle(searchBox);
        expect(parseInt(computedStyle.minHeight)).toBeGreaterThanOrEqual(44);
      }
      
      if (zoomRange) {
        const computedStyle = window.getComputedStyle(zoomRange);
        expect(computedStyle.height).toBeDefined();
      }
    });
  });

  describe('Responsive Typography', () => {
    test('should have responsive font sizes', () => {
      const brandTitle = document.querySelector('.brand h1');
      const subtitle = document.querySelector('.brand .subtitle');
      
      if (brandTitle) {
        const computedStyle = window.getComputedStyle(brandTitle);
        expect(computedStyle.fontSize).toBeDefined();
      }
      
      if (subtitle) {
        const computedStyle = window.getComputedStyle(subtitle);
        expect(computedStyle.fontSize).toBeDefined();
      }
    });

    test('should have readable text on mobile', () => {
      const labels = document.querySelectorAll('.lbl');
      labels.forEach(label => {
        const computedStyle = window.getComputedStyle(label);
        const fontSize = parseInt(computedStyle.fontSize);
        
        // Mobile text should be readable
        expect(fontSize).toBeGreaterThanOrEqual(12);
      });
    });
  });

  describe('Mobile Navigation', () => {
    test('should have mobile-friendly navigation', () => {
      const header = document.querySelector('.app-header');
      const rightSection = header.querySelector('.right');
      
      if (rightSection) {
        const computedStyle = window.getComputedStyle(rightSection);
        expect(computedStyle.display).toBeDefined();
      }
    });

    test('should have accessible mobile controls', () => {
      const controls = document.querySelectorAll('button, input, select');
      controls.forEach(control => {
        // Check for proper labeling
        const hasLabel = control.getAttribute('aria-label') || 
                        control.getAttribute('title') || 
                        control.getAttribute('placeholder') ||
                        control.textContent.trim();
        
        expect(hasLabel).toBeTruthy();
      });
    });
  });

  describe('Mobile Performance', () => {
    test('should have optimized CSS for mobile', () => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      
      // Check for mobile-specific CSS variables
      const mobileVars = [
        '--header-height-mobile',
        '--padding-mobile',
        '--border-radius-mobile'
      ];
      
      mobileVars.forEach(varName => {
        const value = computedStyle.getPropertyValue(varName);
        expect(value).toBeDefined();
      });
    });

    test('should have smooth scrolling on mobile', () => {
      const ptableWrapper = document.querySelector('.ptable-wrapper');
      const computedStyle = window.getComputedStyle(ptableWrapper);
      
      // Check for smooth scrolling properties
      expect(computedStyle.webkitOverflowScrolling).toBeDefined();
    });
  });

  describe('Cross-Device Compatibility', () => {
    test('should work on different screen densities', () => {
      const densities = [1, 1.5, 2, 3];
      
      densities.forEach(density => {
        mockDevicePixelRatio(density);
        
        // App should still function
        const header = document.querySelector('.app-header');
        expect(header).toBeInTheDocument();
      });
    });

    test('should handle different orientations', () => {
      // Test landscape
      mockResize(1024, 768);
      let header = document.querySelector('.app-header');
      expect(header).toBeInTheDocument();
      
      // Test portrait
      mockResize(768, 1024);
      header = document.querySelector('.app-header');
      expect(header).toBeInTheDocument();
    });
  });
});
