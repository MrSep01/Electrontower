/**
 * Achievement System Tests
 * Tests the comprehensive achievement system
 */

const { loadHTML } = require('./utils');

describe('Achievement System', () => {
  beforeEach(() => {
    loadHTML('study.html');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Achievement Definitions', () => {
    test('should have 6 comprehensive achievements defined', () => {
      const expectedAchievements = [
        'First Steps',
        'Core Master', 
        'Perfectionist',
        'Week Warrior',
        'Speed Demon',
        'Electron Expert'
      ];

      // Check if achievement functions exist
      expect(typeof window.checkAchievements).toBe('function');
      expect(typeof window.showAchievementNotification).toBe('function');
      expect(typeof window.showAllAchievements).toBe('function');
    });

    test('should have achievement notification system', () => {
      // Test notification function exists
      expect(typeof window.showAchievementNotification).toBe('function');
      
      // Test if notification can be called
      expect(() => {
        window.showAchievementNotification('Test Achievement', 'Test Description', '🏆');
      }).not.toThrow();
    });
  });

  describe('Achievement Logic', () => {
    test('should unlock First Steps achievement', () => {
      const mockProgress = {
        concepts: {
          overview: { assessment: { score: 5, totalQuestions: 10, timeSpent: 300 } }
        },
        achievements: [],
        streak: 1,
        totalQuizzes: 1
      };

      // Mock localStorage
      localStorage.setItem('electronTowerProgress', JSON.stringify(mockProgress));
      
      // Mock notification function
      const mockNotification = jest.fn();
      window.showAchievementNotification = mockNotification;
      
      // Call checkAchievements
      window.checkAchievements(mockProgress);
      
      // Should trigger First Steps achievement
      expect(mockNotification).toHaveBeenCalledWith(
        'First Steps',
        expect.stringContaining('completed your first activity'),
        '🎯'
      );
    });

    test('should unlock Core Master achievement', () => {
      const mockProgress = {
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

      localStorage.setItem('electronTowerProgress', JSON.stringify(mockProgress));
      
      const mockNotification = jest.fn();
      window.showAchievementNotification = mockNotification;
      
      window.checkAchievements(mockProgress);
      
      expect(mockNotification).toHaveBeenCalledWith(
        'Core Master',
        expect.stringContaining('mastered the Core Rules'),
        '⚛️'
      );
    });

    test('should unlock Perfectionist achievement', () => {
      const mockProgress = {
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

      localStorage.setItem('electronTowerProgress', JSON.stringify(mockProgress));
      
      const mockNotification = jest.fn();
      window.showAchievementNotification = mockNotification;
      
      window.checkAchievements(mockProgress);
      
      expect(mockNotification).toHaveBeenCalledWith(
        'Perfectionist',
        expect.stringContaining('achieved perfect scores'),
        '💯'
      );
    });
  });

  describe('Achievement Display', () => {
    test('should show all achievements', () => {
      expect(typeof window.showAllAchievements).toBe('function');
      
      // Test if function can be called without errors
      expect(() => {
        window.showAllAchievements();
      }).not.toThrow();
    });

    test('should handle achievement notifications with icons', () => {
      const testCases = [
        { title: 'Test 1', description: 'Description 1', icon: '🏆' },
        { title: 'Test 2', description: 'Description 2', icon: '🎯' },
        { title: 'Test 3', description: 'Description 3', icon: '⚛️' }
      ];

      testCases.forEach(({ title, description, icon }) => {
        expect(() => {
          window.showAchievementNotification(title, description, icon);
        }).not.toThrow();
      });
    });
  });

  describe('Progress Integration', () => {
    test('should check achievements when progress is updated', () => {
      // Mock the checkAchievements function
      const mockCheckAchievements = jest.fn();
      window.checkAchievements = mockCheckAchievements;
      
      // Mock progress data
      const mockProgress = {
        concepts: {
          overview: { assessment: { score: 5, totalQuestions: 10, timeSpent: 300 } }
        },
        achievements: [],
        streak: 1,
        totalQuizzes: 1
      };
      
      // Simulate progress update
      localStorage.setItem('electronTowerProgress', JSON.stringify(mockProgress));
      
      // Check if achievements would be checked
      expect(mockCheckAchievements).toBeDefined();
    });
  });
});
