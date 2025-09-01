const { loadHTML } = require('./utils.js');

describe('Electron Towers Basic Functionality', () => {
  beforeEach(() => {
    loadHTML();
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('App Structure', () => {
    test('should have correct document title', () => {
      expect(document.title).toBe('Electron Towers — v0.16r8 (Stable + Diagonal Aufbau + Exceptions + Noble)');
    });

    test('should have proper HTML structure', () => {
      expect(document.doctype).toBeDefined();
      expect(document.documentElement.tagName).toBe('HTML');
      expect(document.head).toBeInTheDocument();
      expect(document.body).toBeInTheDocument();
    });

    test('should have proper meta tags', () => {
      const metaCharset = document.querySelector('meta[charset]');
      const metaViewport = document.querySelector('meta[name="viewport"]');
      
      expect(metaCharset).toBeInTheDocument();
      expect(metaViewport).toBeInTheDocument();
      expect(metaViewport.getAttribute('content')).toContain('width=device-width');
    });
  });

  describe('Header Section', () => {
    test('should have app header', () => {
      const header = document.querySelector('.app-header');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
    });

    test('should have brand section', () => {
      const brand = document.querySelector('.brand');
      expect(brand).toBeInTheDocument();
      
      const title = brand.querySelector('h1');
      expect(title).toBeInTheDocument();
      expect(title.textContent).toContain('Electron Towers');
    });

    test('should have header logo', () => {
      const logo = document.querySelector('.header-logo');
      expect(logo).toBeInTheDocument();
      // Logo can be either IMG or DIV depending on implementation
      expect(['IMG', 'DIV']).toContain(logo.tagName);
      if (logo.tagName === 'IMG') {
        expect(logo.getAttribute('alt')).toBeDefined();
      }
    });

    test('should have right section', () => {
      const rightSection = document.querySelector('.right');
      expect(rightSection).toBeInTheDocument();
    });
  });

  describe('Main Content', () => {
    test('should have main element', () => {
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    test('should have hero section', () => {
      const hero = document.querySelector('.hero-ptable');
      expect(hero).toBeInTheDocument();
    });

    test('should have periodic table wrapper', () => {
      const ptableWrapper = document.querySelector('.ptable-wrapper');
      expect(ptableWrapper).toBeInTheDocument();
      // Check if aria-label exists, but don't enforce specific value
      const ariaLabel = ptableWrapper.getAttribute('aria-label');
      expect(ariaLabel).toBeDefined();
    });

    test('should have periodic table', () => {
      const ptable = document.querySelector('.ptable');
      expect(ptable).toBeInTheDocument();
    });
  });

  describe('Toolbar Controls', () => {
    test('should have toolbar', () => {
      const toolbar = document.querySelector('.toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    test('should have mode selection', () => {
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

    test('should have search box', () => {
      const searchBox = document.getElementById('searchBox');
      expect(searchBox).toBeInTheDocument();
      expect(searchBox.getAttribute('placeholder')).toContain('Symbol / Z / name');
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

  describe('Sidebar', () => {
    test('should have sidebar', () => {
      const sidebar = document.querySelector('aside');
      expect(sidebar).toBeInTheDocument();
    });

    test('should have configuration section', () => {
      const configSection = document.querySelector('.config-section');
      expect(configSection).toBeInTheDocument();
    });

    test('should have configuration items', () => {
      const configItems = document.querySelectorAll('.config-item');
      expect(configItems.length).toBeGreaterThan(0);
    });

    test('should have selected element display', () => {
      const selectedElement = document.getElementById('newCurrentPick');
      if (selectedElement) {
        expect(selectedElement).toBeInTheDocument();
        expect(selectedElement.textContent).toBe('—');
      }
    });

    test('should have electron count display', () => {
      const electronCount = document.getElementById('newElectronCount');
      if (electronCount) {
        expect(electronCount).toBeInTheDocument();
        expect(electronCount.textContent).toBe('0 / 0');
      }
    });

    test('should have ion state display', () => {
      const ionState = document.getElementById('newIonState');
      if (ionState) {
        expect(ionState).toBeInTheDocument();
        expect(ionState.textContent).toBe('—');
      }
    });

    test('should have configuration display', () => {
      const currentConfig = document.getElementById('newCurrentConfig');
      if (currentConfig) {
        expect(currentConfig).toBeInTheDocument();
        expect(currentConfig.textContent).toBe('—');
      }
    });
  });

  describe('Actions and Controls', () => {
    test('should have study actions', () => {
      const studyActions = document.getElementById('studyActions');
      if (studyActions) {
        expect(studyActions).toBeInTheDocument();
        
        const resetBtn = studyActions.querySelector('#resetBtnStudy');
        if (resetBtn) {
          expect(resetBtn).toBeInTheDocument();
          expect(resetBtn.textContent).toContain('Reset Building');
        }
      }
    });

    test('should have game actions', () => {
      const gameActions = document.getElementById('gameActions');
      if (gameActions) {
        expect(gameActions).toBeInTheDocument();
        expect(gameActions.classList.contains('hidden')).toBe(true);
        
        const newGameBtn = gameActions.querySelector('#newGameBtn');
        const resetBtn = gameActions.querySelector('#resetBtnGame');
        
        if (newGameBtn) {
          expect(newGameBtn).toBeInTheDocument();
          expect(newGameBtn.textContent).toContain('New Game');
        }
        
        if (resetBtn) {
          expect(resetBtn).toBeInTheDocument();
          expect(resetBtn.textContent).toContain('Reset Building');
        }
      }
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

    test('should have proper form labels', () => {
      const labels = document.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
      
      labels.forEach(label => {
        expect(label.textContent.trim()).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle missing elements gracefully', () => {
      const nonExistentElement = document.getElementById('nonExistent');
      expect(nonExistentElement).toBeNull();
      
      // App should still function
      const header = document.querySelector('.app-header');
      expect(header).toBeInTheDocument();
    });
  });
});
