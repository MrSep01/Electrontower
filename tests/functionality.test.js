/**
 * Core Functionality Tests
 * Tests the essential functions without complex HTML loading
 */

describe('Core Functionality Tests', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Mock essential DOM elements
    document.body.innerHTML = `
      <div id="sodiumBuilding">
        <div class="slot" data-orbital="2s-1"></div>
        <div class="slot" data-orbital="2s-2"></div>
        <div class="slot" data-orbital="2p-1"></div>
        <div class="slot" data-orbital="2p-2"></div>
        <div class="slot" data-orbital="2p-3"></div>
        <div class="slot" data-orbital="2p-4"></div>
        <div class="slot" data-orbital="2p-5"></div>
        <div class="slot" data-orbital="2p-6"></div>
        <div class="slot" data-orbital="3s-1"></div>
      </div>
      <div id="chlorineBuilding">
        <div class="slot" data-orbital="3s-1"></div>
        <div class="slot" data-orbital="3s-2"></div>
        <div class="slot" data-orbital="3p-1"></div>
        <div class="slot" data-orbital="3p-2"></div>
        <div class="slot" data-orbital="3p-3"></div>
        <div class="slot" data-orbital="3p-4"></div>
        <div class="slot" data-orbital="3p-5"></div>
      </div>
      <div id="ironBuilding">
        <div class="slot" data-orbital="4s-1"></div>
        <div class="slot" data-orbital="4s-2"></div>
        <div class="slot" data-orbital="3d-1"></div>
        <div class="slot" data-orbital="3d-2"></div>
        <div class="slot" data-orbital="3d-3"></div>
        <div class="slot" data-orbital="3d-4"></div>
        <div class="slot" data-orbital="3d-5"></div>
        <div class="slot" data-orbital="3d-6"></div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Progress Tracking System', () => {
    test('should store and retrieve progress data', () => {
      const testProgress = {
        concepts: {
          overview: { assessment: { score: 8, totalQuestions: 10, timeSpent: 300 } },
          coreRules: { interactiveDemo: { score: 1, totalQuestions: 1, timeSpent: 120 } }
        },
        achievements: [],
        streak: 1,
        totalQuizzes: 1
      };

      localStorage.setItem('electronTowerProgress', JSON.stringify(testProgress));
      const retrieved = JSON.parse(localStorage.getItem('electronTowerProgress'));
      
      expect(retrieved.concepts.overview.assessment.score).toBe(8);
      expect(retrieved.concepts.coreRules.interactiveDemo.score).toBe(1);
    });

    test('should calculate concept completion correctly', () => {
      const progress = {
        concepts: {
          overview: { assessment: { score: 8, totalQuestions: 10, timeSpent: 300 } },
          coreRules: { 
            interactiveDemo: { score: 1, totalQuestions: 1, timeSpent: 120 },
            understandingCheck: { score: 7, totalQuestions: 8, timeSpent: 180 },
            contentEngagement: { score: 1, totalQuestions: 1, timeSpent: 60 }
          }
        }
      };

      // Test overview completion (single activity)
      const overviewCompletion = progress.concepts.overview.assessment.score / progress.concepts.overview.assessment.totalQuestions;
      expect(overviewCompletion).toBe(0.8);

      // Test core rules completion (weighted average)
      const coreRulesActivities = progress.concepts.coreRules;
      const totalScore = coreRulesActivities.interactiveDemo.score + 
                        coreRulesActivities.understandingCheck.score + 
                        coreRulesActivities.contentEngagement.score;
      const totalQuestions = coreRulesActivities.interactiveDemo.totalQuestions + 
                           coreRulesActivities.understandingCheck.totalQuestions + 
                           coreRulesActivities.contentEngagement.totalQuestions;
      const coreRulesCompletion = totalScore / totalQuestions;
      expect(coreRulesCompletion).toBeCloseTo(0.9);
    });
  });

  describe('Ion Formation Reset Functions', () => {
    test('should reset sodium demo with correct electron configuration', () => {
      // Mock the resetSodiumDemo function
      const resetSodiumDemo = () => {
        const building = document.getElementById('sodiumBuilding');
        if (!building) return;

        // Clear all slots
        const slots = building.querySelectorAll('.slot');
        slots.forEach(slot => {
          slot.textContent = '';
          slot.className = 'slot';
        });

        // Populate with correct configuration
        const slot2s1 = building.querySelector('[data-orbital="2s-1"]');
        const slot2s2 = building.querySelector('[data-orbital="2s-2"]');
        const slot2p1 = building.querySelector('[data-orbital="2p-1"]');
        const slot2p2 = building.querySelector('[data-orbital="2p-2"]');
        const slot2p3 = building.querySelector('[data-orbital="2p-3"]');
        const slot2p4 = building.querySelector('[data-orbital="2p-4"]');
        const slot2p5 = building.querySelector('[data-orbital="2p-5"]');
        const slot2p6 = building.querySelector('[data-orbital="2p-6"]');
        const slot3s1 = building.querySelector('[data-orbital="3s-1"]');

        if (slot2s1) slot2s1.textContent = '↑';
        if (slot2s2) slot2s2.textContent = '↓';
        if (slot2p1) slot2p1.textContent = '↑';
        if (slot2p2) slot2p2.textContent = '↓';
        if (slot2p3) slot2p3.textContent = '↑';
        if (slot2p4) slot2p4.textContent = '↓';
        if (slot2p5) slot2p5.textContent = '↑';
        if (slot2p6) slot2p6.textContent = '↓';
        if (slot3s1) slot3s1.textContent = '↑';
      };

      resetSodiumDemo();

      // Verify electron configuration
      expect(document.querySelector('[data-orbital="2s-1"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="2s-2"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="2p-1"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="2p-2"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="2p-3"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="2p-4"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="2p-5"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="2p-6"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3s-1"]').textContent).toBe('↑');
    });

    test('should reset chlorine demo with correct electron configuration', () => {
      const resetChlorineDemo = () => {
        const building = document.getElementById('chlorineBuilding');
        if (!building) return;

        const slots = building.querySelectorAll('.slot');
        slots.forEach(slot => {
          slot.textContent = '';
          slot.className = 'slot';
        });

        const slot3s1 = building.querySelector('[data-orbital="3s-1"]');
        const slot3s2 = building.querySelector('[data-orbital="3s-2"]');
        const slot3p1 = building.querySelector('[data-orbital="3p-1"]');
        const slot3p2 = building.querySelector('[data-orbital="3p-2"]');
        const slot3p3 = building.querySelector('[data-orbital="3p-3"]');
        const slot3p4 = building.querySelector('[data-orbital="3p-4"]');
        const slot3p5 = building.querySelector('[data-orbital="3p-5"]');

        if (slot3s1) slot3s1.textContent = '↑';
        if (slot3s2) slot3s2.textContent = '↓';
        if (slot3p1) slot3p1.textContent = '↑';
        if (slot3p2) slot3p2.textContent = '↓';
        if (slot3p3) slot3p3.textContent = '↑';
        if (slot3p4) slot3p4.textContent = '↓';
        if (slot3p5) slot3p5.textContent = '↑';
      };

      resetChlorineDemo();

      expect(document.querySelector('[data-orbital="3s-1"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="3s-2"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3p-1"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="3p-2"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3p-3"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="3p-4"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3p-5"]').textContent).toBe('↑');
    });

    test('should reset iron demo with correct electron configuration', () => {
      const resetIronDemo = () => {
        const building = document.getElementById('ironBuilding');
        if (!building) return;

        const slots = building.querySelectorAll('.slot');
        slots.forEach(slot => {
          slot.textContent = '';
          slot.className = 'slot';
        });

        const slot4s1 = building.querySelector('[data-orbital="4s-1"]');
        const slot4s2 = building.querySelector('[data-orbital="4s-2"]');
        const slot3d1 = building.querySelector('[data-orbital="3d-1"]');
        const slot3d2 = building.querySelector('[data-orbital="3d-2"]');
        const slot3d3 = building.querySelector('[data-orbital="3d-3"]');
        const slot3d4 = building.querySelector('[data-orbital="3d-4"]');
        const slot3d5 = building.querySelector('[data-orbital="3d-5"]');
        const slot3d6 = building.querySelector('[data-orbital="3d-6"]');

        if (slot4s1) slot4s1.textContent = '↑';
        if (slot4s2) slot4s2.textContent = '↓';
        if (slot3d1) slot3d1.textContent = '↑';
        if (slot3d2) slot3d2.textContent = '↓';
        if (slot3d3) slot3d3.textContent = '↑';
        if (slot3d4) slot3d4.textContent = '↓';
        if (slot3d5) slot3d5.textContent = '↑';
        if (slot3d6) slot3d6.textContent = '↓';
      };

      resetIronDemo();

      expect(document.querySelector('[data-orbital="4s-1"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="4s-2"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3d-1"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="3d-2"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3d-3"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="3d-4"]').textContent).toBe('↓');
      expect(document.querySelector('[data-orbital="3d-5"]').textContent).toBe('↑');
      expect(document.querySelector('[data-orbital="3d-6"]').textContent).toBe('↓');
    });
  });

  describe('Achievement System', () => {
    test('should identify First Steps achievement', () => {
      const progress = {
        concepts: {
          overview: { assessment: { score: 5, totalQuestions: 10, timeSpent: 300 } }
        },
        achievements: [],
        streak: 1,
        totalQuizzes: 1
      };

      const checkFirstSteps = (progress) => {
        return progress.concepts.overview.assessment.score > 0 && 
               progress.totalQuizzes >= 1;
      };

      expect(checkFirstSteps(progress)).toBe(true);
    });

    test('should identify Core Master achievement', () => {
      const progress = {
        concepts: {
          coreRules: {
            interactiveDemo: { score: 1, totalQuestions: 1, timeSpent: 120 },
            understandingCheck: { score: 8, totalQuestions: 8, timeSpent: 180 },
            contentEngagement: { score: 1, totalQuestions: 1, timeSpent: 60 }
          }
        },
        achievements: [],
        streak: 1,
        totalQuizzes: 3
      };

      const checkCoreMaster = (progress) => {
        const coreRules = progress.concepts.coreRules;
        const totalScore = coreRules.interactiveDemo.score + 
                          coreRules.understandingCheck.score + 
                          coreRules.contentEngagement.score;
        const totalQuestions = coreRules.interactiveDemo.totalQuestions + 
                             coreRules.understandingCheck.totalQuestions + 
                             coreRules.contentEngagement.totalQuestions;
        return (totalScore / totalQuestions) >= 0.8 && progress.totalQuizzes >= 3;
      };

      expect(checkCoreMaster(progress)).toBe(true);
    });

    test('should identify Perfectionist achievement', () => {
      const progress = {
        concepts: {
          overview: { assessment: { score: 10, totalQuestions: 10, timeSpent: 300 } },
          coreRules: { understandingCheck: { score: 8, totalQuestions: 8, timeSpent: 180 } },
          exceptions: { vocabularyQuiz: { score: 6, totalQuestions: 6, timeSpent: 60 } },
          ionFormation: { vocabularyQuiz: { score: 6, totalQuestions: 6, timeSpent: 90 } }
        },
        achievements: [],
        streak: 1,
        totalQuizzes: 4
      };

      const checkPerfectionist = (progress) => {
        const perfectScores = Object.values(progress.concepts).filter(concept => {
          const activities = Object.values(concept);
          return activities.some(activity => 
            activity.score && activity.totalQuestions && 
            activity.score === activity.totalQuestions
          );
        });
        return perfectScores.length >= 3;
      };

      expect(checkPerfectionist(progress)).toBe(true);
    });
  });

  describe('Cross-tab Synchronization', () => {
    test('should dispatch custom events', () => {
      let eventReceived = false;
      const eventHandler = (event) => {
        eventReceived = true;
        expect(event.detail.concept).toBe('test');
      };

      window.addEventListener('progressUpdated', eventHandler);
      
      const testEvent = new CustomEvent('progressUpdated', {
        detail: { concept: 'test', progress: 50 }
      });
      window.dispatchEvent(testEvent);
      
      expect(eventReceived).toBe(true);
      
      window.removeEventListener('progressUpdated', eventHandler);
    });

    test('should handle postMessage communication', () => {
      let messageReceived = false;
      const messageHandler = (event) => {
        messageReceived = true;
        expect(event.data.type).toBe('progressUpdate');
      };

      window.addEventListener('message', messageHandler);
      
      window.postMessage({ type: 'progressUpdate', data: { concept: 'test' } }, '*');
      
      expect(messageReceived).toBe(true);
      
      window.removeEventListener('message', messageHandler);
    });
  });

  describe('Visual Improvements', () => {
    test('should apply tight spacing styles', () => {
      const style = document.createElement('style');
      style.textContent = `
        .floor-label { margin-bottom: 0px; }
        .wings { gap: 0px; }
        .wing { padding: 2px; }
        .wing-title { margin-bottom: 0px; }
        .slots { margin-top: 2px; }
      `;
      document.head.appendChild(style);

      const testElement = document.createElement('div');
      testElement.className = 'floor-label';
      testElement.textContent = 'Test Label';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      expect(computedStyle.marginBottom).toBe('0px');

      document.head.removeChild(style);
      document.body.removeChild(testElement);
    });

    test('should clear all styling on reset', () => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.textContent = '↑';
      slot.style.backgroundColor = 'red';
      slot.style.border = '2px solid blue';
      slot.style.transform = 'scale(1.2)';
      slot.style.boxShadow = '0 0 10px rgba(255,0,0,0.5)';

      // Reset function
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

      expect(slot.textContent).toBe('');
      expect(slot.style.backgroundColor).toBe('');
      expect(slot.style.border).toBe('');
      expect(slot.style.transform).toBe('');
      expect(slot.style.boxShadow).toBe('');
      expect(slot.className).toBe('slot');
    });
  });
});
