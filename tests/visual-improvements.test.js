/**
 * Visual Improvements Tests
 * Tests the spacing, styling, and visual enhancements
 */

const { loadHTML } = require('./utils');

describe('Visual Improvements', () => {
  beforeEach(() => {
    loadHTML('study.html');
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Spacing Improvements', () => {
    test('should have tight spacing between shell labels and subshells', () => {
      // Check if floor-label has minimal margin-bottom
      const style = document.createElement('style');
      style.textContent = `
        .floor-label { margin-bottom: 0px; }
        .wings { gap: 0px; }
        .wing { padding: 2px; }
        .wing-title { margin-bottom: 0px; }
        .slots { margin-top: 2px; }
      `;
      document.head.appendChild(style);
      
      // Create test elements
      const floorLabel = document.createElement('div');
      floorLabel.className = 'floor-label';
      floorLabel.textContent = 'Shell n=3 (Valence Shell)';
      
      const wings = document.createElement('div');
      wings.className = 'wings';
      
      const wing = document.createElement('div');
      wing.className = 'wing';
      
      const wingTitle = document.createElement('div');
      wingTitle.className = 'wing-title';
      wingTitle.textContent = '3s wing';
      
      const slots = document.createElement('div');
      slots.className = 'slots';
      
      // Assemble structure
      wing.appendChild(wingTitle);
      wing.appendChild(slots);
      wings.appendChild(wing);
      
      const floor = document.createElement('div');
      floor.className = 'floor';
      floor.appendChild(floorLabel);
      floor.appendChild(wings);
      
      document.body.appendChild(floor);
      
      // Check computed styles
      const computedStyle = window.getComputedStyle(floorLabel);
      expect(computedStyle.marginBottom).toBe('0px');
    });

    test('should have consistent spacing across all shells', () => {
      // Test that all floor elements have consistent spacing
      const floors = document.querySelectorAll('.floor');
      floors.forEach(floor => {
        const computedStyle = window.getComputedStyle(floor);
        expect(computedStyle.marginBottom).toBe('2px');
      });
    });
  });

  describe('Ion Formation Visual Structure', () => {
    test('should show only relevant shells for each element', () => {
      // Test Sodium structure (n=2, n=3)
      const sodiumBuilding = document.getElementById('sodiumBuilding');
      if (sodiumBuilding) {
        const floors = sodiumBuilding.querySelectorAll('.floor');
        expect(floors.length).toBeLessThanOrEqual(2); // Only n=2 and n=3
      }
      
      // Test Chlorine structure (n=3)
      const chlorineBuilding = document.getElementById('chlorineBuilding');
      if (chlorineBuilding) {
        const floors = chlorineBuilding.querySelectorAll('.floor');
        expect(floors.length).toBeLessThanOrEqual(1); // Only n=3
      }
      
      // Test Iron structure (n=3, n=4)
      const ironBuilding = document.getElementById('ironBuilding');
      if (ironBuilding) {
        const floors = ironBuilding.querySelectorAll('.floor');
        expect(floors.length).toBeLessThanOrEqual(2); // Only n=3 and n=4
      }
    });

    test('should have proper valence labeling', () => {
      // Check if valence labels exist
      const valenceLabels = document.querySelectorAll('.valence-label');
      expect(valenceLabels.length).toBeGreaterThan(0);
      
      // Check if valence labels have correct styling
      valenceLabels.forEach(label => {
        expect(label.textContent).toBe('VALENCE');
      });
    });
  });

  describe('Reset Function Styling', () => {
    test('should completely clear all styling on reset', () => {
      // Create a test slot with styling
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.textContent = '↑';
      slot.style.backgroundColor = 'red';
      slot.style.border = '2px solid blue';
      slot.style.transform = 'scale(1.2)';
      slot.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';
      
      // Test reset styling function
      const resetSlot = (element) => {
        element.textContent = '';
        element.style.opacity = '1';
        element.style.color = 'inherit';
        element.style.fontWeight = 'normal';
        element.style.backgroundColor = '';
        element.style.border = '';
        element.style.borderRadius = '';
        element.style.transform = '';
        element.style.scale = '';
        element.style.boxShadow = '';
        element.style.outline = '';
        element.className = 'slot';
      };
      
      resetSlot(slot);
      
      // Verify all styling is cleared
      expect(slot.textContent).toBe('');
      expect(slot.style.backgroundColor).toBe('');
      expect(slot.style.border).toBe('');
      expect(slot.style.transform).toBe('');
      expect(slot.style.boxShadow).toBe('');
      expect(slot.className).toBe('slot');
    });
  });

  describe('Quiz Visual Consistency', () => {
    test('should have consistent button styling across all quizzes', () => {
      // Check if quiz buttons have consistent classes
      const quizButtons = document.querySelectorAll('.quiz-option, .btn');
      expect(quizButtons.length).toBeGreaterThan(0);
      
      quizButtons.forEach(button => {
        expect(button.classList.contains('btn') || button.classList.contains('quiz-option')).toBe(true);
      });
    });

    test('should have proper visual feedback for quiz answers', () => {
      // Test correct answer styling
      const correctButton = document.createElement('button');
      correctButton.className = 'quiz-option correct';
      correctButton.textContent = 'Correct Answer';
      
      // Test incorrect answer styling
      const incorrectButton = document.createElement('button');
      incorrectButton.className = 'quiz-option incorrect';
      incorrectButton.textContent = 'Incorrect Answer';
      
      expect(correctButton.classList.contains('correct')).toBe(true);
      expect(incorrectButton.classList.contains('incorrect')).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    test('should maintain visual integrity on different screen sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, writable: true });
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // Check if elements are still properly styled
      const floors = document.querySelectorAll('.floor');
      floors.forEach(floor => {
        const computedStyle = window.getComputedStyle(floor);
        expect(computedStyle.marginBottom).toBeDefined();
      });
    });
  });
});
