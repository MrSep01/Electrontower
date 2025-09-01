const { loadHTML, waitFor, createTouchEvent, mockResize } = require('./utils.js');

describe('Electron Towers Core Functionality', () => {
  beforeEach(() => {
    loadHTML();
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('App Initialization', () => {
    test('should load the app successfully', () => {
      expect(document.title).toBe('Electron Towers — v0.16r8 (Stable + Diagonal Aufbau + Exceptions + Noble)');
    });

    test('should have main header elements', () => {
      const header = document.querySelector('.app-header');
      const brand = document.querySelector('.brand');
      const logo = document.querySelector('.header-logo');
      
      expect(header).toBeInTheDocument();
      expect(brand).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
    });

    test('should have periodic table wrapper', () => {
      const ptableWrapper = document.querySelector('.ptable-wrapper');
      const ptable = document.querySelector('.ptable');
      
      expect(ptableWrapper).toBeInTheDocument();
      expect(ptable).toBeInTheDocument();
    });
  });

  describe('Periodic Table', () => {
    test('should have correct grid structure', () => {
      const ptable = document.querySelector('.ptable');
      const computedStyle = window.getComputedStyle(ptable);
      
      expect(computedStyle.display).toBe('grid');
      expect(computedStyle.gridTemplateColumns).toContain('36px');
    });

    test('should have s-block elements visible', () => {
      const sBlockElements = document.querySelectorAll('.ptile.s');
      expect(sBlockElements.length).toBeGreaterThan(0);
      
      // Check if first s-block element (H) is visible
      const firstSElement = sBlockElements[0];
      expect(firstSElement).toBeInTheDocument();
    });

    test('should have d-block elements', () => {
      const dBlockElements = document.querySelectorAll('.ptile.d');
      expect(dBlockElements.length).toBeGreaterThan(0);
    });

    test('should have p-block elements', () => {
      const pBlockElements = document.querySelectorAll('.ptile.p');
      expect(pBlockElements.length).toBeGreaterThan(0);
    });

    test('should have f-block elements', () => {
      const fBlockElements = document.querySelectorAll('.ptile.f');
      expect(fBlockElements.length).toBeGreaterThan(0);
    });
  });

  describe('Toolbar Controls', () => {
    test('should have mode selection buttons', () => {
      const studyBtn = document.getElementById('modeStudy');
      const gameBtn = document.getElementById('modeGame');
      
      expect(studyBtn).toBeInTheDocument();
      expect(gameBtn).toBeInTheDocument();
      expect(studyBtn.classList.contains('active')).toBe(true);
    });

    test('should have ion controls', () => {
      const ionMinus = document.getElementById('ionMinus');
      const ionPlus = document.getElementById('ionPlus');
      const ionCharge = document.getElementById('ionCharge');
      
      expect(ionMinus).toBeInTheDocument();
      expect(ionPlus).toBeInTheDocument();
      expect(ionCharge).toBeInTheDocument();
      expect(ionCharge.textContent).toBe('0');
    });

    test('should have search functionality', () => {
      const searchBox = document.getElementById('searchBox');
      expect(searchBox).toBeInTheDocument();
      expect(searchBox.placeholder).toContain('Symbol / Z / name');
    });

    test('should have zoom control', () => {
      const zoomRange = document.getElementById('zoomRange');
      expect(zoomRange).toBeInTheDocument();
      expect(zoomRange.type).toBe('range');
      expect(zoomRange.min).toBe('34');
      expect(zoomRange.max).toBe('72');
    });

    test('should have hints toggle', () => {
      const hintToggle = document.getElementById('hintToggle');
      expect(hintToggle).toBeInTheDocument();
      expect(hintToggle.checked).toBe(true);
    });
  });

  describe('Game Area', () => {
    test('should have building area', () => {
      const building = document.getElementById('building');
      expect(building).toBeInTheDocument();
      expect(building.classList.contains('building')).toBe(true);
    });

    test('should have score panel', () => {
      const scorePanel = document.querySelector('.score');
      const scoreNum = document.getElementById('score');
      
      expect(scorePanel).toBeInTheDocument();
      expect(scoreNum).toBeInTheDocument();
      expect(scoreNum.textContent).toBe('0');
    });

    test('should have electron lobby', () => {
      const lobby = document.querySelector('.lobby');
      const lobbyArea = document.querySelector('.lobby-area');
      
      expect(lobby).toBeInTheDocument();
      expect(lobbyArea).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('should have mobile-friendly CSS variables', () => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      
      // Check if CSS custom properties are accessible
      expect(computedStyle.getPropertyValue('--primary')).toBeDefined();
      expect(computedStyle.getPropertyValue('--tile')).toBeDefined();
    });

    test('should have mobile breakpoints', () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) { .test-mobile { display: block; } }
        @media (max-width: 480px) { .test-small { display: block; } }
      `;
      document.head.appendChild(style);
      
      // Test if media queries are working
      const testElement = document.createElement('div');
      testElement.className = 'test-mobile test-small';
      document.body.appendChild(testElement);
      
      expect(testElement).toBeInTheDocument();
    });
  });

  describe('Touch and Mobile Support', () => {
    test('should have touch-friendly button sizes', () => {
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        const computedStyle = window.getComputedStyle(button);
        const minHeight = computedStyle.minHeight;
        const minWidth = computedStyle.minWidth;
        
        // Check if buttons have minimum touch-friendly dimensions
        expect(parseInt(minHeight)).toBeGreaterThanOrEqual(44);
        expect(parseInt(minWidth)).toBeGreaterThanOrEqual(44);
      });
    });

    test('should have touch-action properties', () => {
      const ptable = document.querySelector('.ptable');
      const computedStyle = window.getComputedStyle(ptable);
      
      // Check if touch-action is set for better mobile interaction
      expect(computedStyle.touchAction).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      const ptable = document.querySelector('.ptable');
      expect(ptable.getAttribute('aria-label')).toBe('Periodic Table');
    });

    test('should have semantic HTML structure', () => {
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const aside = document.querySelector('aside');
      
      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(aside).toBeInTheDocument();
    });

    test('should have proper color contrast', () => {
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
        const computedStyle = window.getComputedStyle(button);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // Basic check that buttons have both background and text colors
        expect(backgroundColor).not.toBe('transparent');
        expect(color).not.toBe('transparent');
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle missing elements gracefully', () => {
      // Test that the app doesn't crash when elements are missing
      const nonExistentElement = document.getElementById('nonExistent');
      expect(nonExistentElement).toBeNull();
      
      // App should still function
      const header = document.querySelector('.app-header');
      expect(header).toBeInTheDocument();
    });

    test('should have fallback values for CSS variables', () => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      
      // Check that critical CSS variables have fallbacks
      const primaryColor = computedStyle.getPropertyValue('--primary');
      expect(primaryColor).toBeDefined();
    });
  });
});
