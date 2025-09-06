/**
 * Ion Formation Tests
 * Tests the Ion Formation demos and reset functionality
 */

const { loadHTML, createTouchEvent } = require('./utils');

describe('Ion Formation Demos', () => {
  beforeEach(() => {
    loadHTML('study.html');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Sodium Cation Demo', () => {
    test('should have resetSodiumDemo function', () => {
      expect(typeof window.resetSodiumDemo).toBe('function');
    });

    test('should have showSodiumCation function', () => {
      expect(typeof window.showSodiumCation).toBe('function');
    });

    test('should populate correct electron configuration on reset', () => {
      // Call reset function
      window.resetSodiumDemo();
      
      // Check if 3s orbital has 1 electron
      const slot3s1 = document.querySelector('[data-orbital="3s-1"]');
      expect(slot3s1).toBeTruthy();
      expect(slot3s1.textContent).toBe('↑');
      
      // Check if 2s orbitals are filled
      const slot2s1 = document.querySelector('[data-orbital="2s-1"]');
      const slot2s2 = document.querySelector('[data-orbital="2s-2"]');
      expect(slot2s1.textContent).toBe('↑');
      expect(slot2s2.textContent).toBe('↓');
      
      // Check if 2p orbitals are filled
      const slot2p1 = document.querySelector('[data-orbital="2p-1"]');
      const slot2p2 = document.querySelector('[data-orbital="2p-2"]');
      expect(slot2p1.textContent).toBe('↑');
      expect(slot2p2.textContent).toBe('↓');
    });

    test('should clear all styling on reset', () => {
      // First add some styling
      const slot = document.querySelector('[data-orbital="3s-1"]');
      if (slot) {
        slot.style.backgroundColor = 'red';
        slot.style.border = '2px solid blue';
        slot.className = 'slot filled';
      }
      
      // Reset
      window.resetSodiumDemo();
      
      // Check styling is cleared
      expect(slot.style.backgroundColor).toBe('');
      expect(slot.style.border).toBe('');
      expect(slot.className).toBe('slot');
    });
  });

  describe('Chlorine Anion Demo', () => {
    test('should have resetChlorineDemo function', () => {
      expect(typeof window.resetChlorineDemo).toBe('function');
    });

    test('should have showChlorineAnion function', () => {
      expect(typeof window.showChlorineAnion).toBe('function');
    });

    test('should populate correct electron configuration on reset', () => {
      window.resetChlorineDemo();
      
      // Check 3s orbital (2 electrons)
      const slot3s1 = document.querySelector('[data-orbital="3s-1"]');
      const slot3s2 = document.querySelector('[data-orbital="3s-2"]');
      expect(slot3s1.textContent).toBe('↑');
      expect(slot3s2.textContent).toBe('↓');
      
      // Check 3p orbitals (5 electrons)
      const slot3p1 = document.querySelector('[data-orbital="3p-1"]');
      const slot3p2 = document.querySelector('[data-orbital="3p-2"]');
      const slot3p3 = document.querySelector('[data-orbital="3p-3"]');
      const slot3p4 = document.querySelector('[data-orbital="3p-4"]');
      const slot3p5 = document.querySelector('[data-orbital="3p-5"]');
      
      expect(slot3p1.textContent).toBe('↑');
      expect(slot3p2.textContent).toBe('↓');
      expect(slot3p3.textContent).toBe('↑');
      expect(slot3p4.textContent).toBe('↓');
      expect(slot3p5.textContent).toBe('↑');
    });
  });

  describe('Iron Cation Demo', () => {
    test('should have resetIronDemo function', () => {
      expect(typeof window.resetIronDemo).toBe('function');
    });

    test('should have showIronCation function', () => {
      expect(typeof window.showIronCation).toBe('function');
    });

    test('should populate correct electron configuration on reset', () => {
      window.resetIronDemo();
      
      // Check 4s orbital (2 electrons)
      const slot4s1 = document.querySelector('[data-orbital="4s-1"]');
      const slot4s2 = document.querySelector('[data-orbital="4s-2"]');
      expect(slot4s1.textContent).toBe('↑');
      expect(slot4s2.textContent).toBe('↓');
      
      // Check 3d orbitals (6 electrons)
      const slot3d1 = document.querySelector('[data-orbital="3d-1"]');
      const slot3d2 = document.querySelector('[data-orbital="3d-2"]');
      const slot3d3 = document.querySelector('[data-orbital="3d-3"]');
      const slot3d4 = document.querySelector('[data-orbital="3d-4"]');
      const slot3d5 = document.querySelector('[data-orbital="3d-5"]');
      const slot3d6 = document.querySelector('[data-orbital="3d-6"]');
      
      expect(slot3d1.textContent).toBe('↑');
      expect(slot3d2.textContent).toBe('↓');
      expect(slot3d3.textContent).toBe('↑');
      expect(slot3d4.textContent).toBe('↓');
      expect(slot3d5.textContent).toBe('↑');
      expect(slot3d6.textContent).toBe('↓');
    });
  });

  describe('Progress Tracking Integration', () => {
    test('should track progress when demos are used', () => {
      // Mock the updateProgress function
      const mockUpdateProgress = jest.fn();
      window.updateProgress = mockUpdateProgress;
      
      // Call a demo function
      window.showSodiumCation();
      
      // Check if progress was tracked
      expect(mockUpdateProgress).toHaveBeenCalledWith(
        'ionFormation', 
        'interactiveDemo', 
        expect.any(Number), 
        expect.any(Number), 
        expect.any(Number)
      );
    });
  });

  describe('Quiz Functionality', () => {
    test('should have checkIonVocabQuiz function', () => {
      expect(typeof window.checkIonVocabQuiz).toBe('function');
    });

    test('should have showIonQuizResults function', () => {
      expect(typeof window.showIonQuizResults).toBe('function');
    });

    test('should have resetIonUnderstanding function', () => {
      expect(typeof window.resetIonUnderstanding).toBe('function');
    });
  });
});
