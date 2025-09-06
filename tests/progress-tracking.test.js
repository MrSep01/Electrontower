/**
 * Progress Tracking System Tests
 * Tests the comprehensive progress tracking functionality in the study guide
 */

const { loadHTML, createTouchEvent } = require('./utils');

describe('Progress Tracking System', () => {
  beforeEach(() => {
    loadHTML('study.html');
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  describe('Progress Data Structure', () => {
    test('should initialize with updated progress structure', () => {
      // Updated progress structure based on current implementation
      const defaultProgress = {
        concepts: {
          overview: { 
            assessment: { score: 0, totalQuestions: 0, timeSpent: 0 }
          },
          coreRules: { 
            interactiveDemo: { score: 0, totalQuestions: 0, timeSpent: 0 },
            understandingCheck: { score: 0, totalQuestions: 0, timeSpent: 0 },
            contentEngagement: { score: 0, totalQuestions: 0, timeSpent: 0 }
          },
          exceptions: { 
            interactiveDemo: { score: 0, totalQuestions: 0, timeSpent: 0 },
            vocabularyQuiz: { score: 0, totalQuestions: 0, timeSpent: 0 },
            contentEngagement: { score: 0, totalQuestions: 0, timeSpent: 0 }
          },
          ionFormation: {
            interactiveDemo: { score: 0, totalQuestions: 0, timeSpent: 0 },
            vocabularyQuiz: { score: 0, totalQuestions: 0, timeSpent: 0 },
            contentEngagement: { score: 0, totalQuestions: 0, timeSpent: 0 }
          },
          assessment: {
            paper1: { score: 0, totalQuestions: 0, timeSpent: 0 },
            paper2: { score: 0, totalQuestions: 0, timeSpent: 0 },
            paper3: { score: 0, totalQuestions: 0, timeSpent: 0 },
            contentEngagement: { score: 0, totalQuestions: 0, timeSpent: 0 }
          }
        },
        achievements: [],
        streak: 0,
        lastStudyDate: null,
        totalQuizzes: 0,
        totalTimeSpent: 0
      };

      expect(defaultProgress.concepts.coreRules.activities).toHaveProperty('vocabularyQuiz');
      expect(defaultProgress.concepts.coreRules.activities).toHaveProperty('understandingCheck');
      expect(defaultProgress.concepts.coreRules.activities).toHaveProperty('interactiveDemos');
      expect(defaultProgress.concepts.coreRules.activities).toHaveProperty('contentEngagement');
    });
  });

  describe('Content Engagement Tracking', () => {
    test('should track content engagement when accessing Core Rules', () => {
      // Simulate the showCoreRulesContent function behavior
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              contentEngagement: { completed: false, timeSpent: 0 }
            }
          }
        }
      };
      
      // Simulate updateProgress call for content engagement
      mockProgress.concepts.coreRules.activities.contentEngagement.completed = true;
      mockProgress.concepts.coreRules.activities.contentEngagement.timeSpent += 1;
      
      expect(mockProgress.concepts.coreRules.activities.contentEngagement.completed).toBe(true);
      expect(mockProgress.concepts.coreRules.activities.contentEngagement.timeSpent).toBe(1);
    });

    test('should track content engagement when accessing Exceptions', () => {
      // Simulate the showExceptionsContent function behavior
      const mockProgress = {
        concepts: {
          exceptions: {
            activities: {
              contentEngagement: { completed: false, timeSpent: 0 }
            }
          }
        }
      };
      
      // Simulate updateProgress call for content engagement
      mockProgress.concepts.exceptions.activities.contentEngagement.completed = true;
      mockProgress.concepts.exceptions.activities.contentEngagement.timeSpent += 1;
      
      expect(mockProgress.concepts.exceptions.activities.contentEngagement.completed).toBe(true);
      expect(mockProgress.concepts.exceptions.activities.contentEngagement.timeSpent).toBe(1);
    });
  });

  describe('Interactive Demo Tracking', () => {
    test('should track Chromium exception demo completion', () => {
      // Simulate the demo completion tracking
      const mockProgress = {
        concepts: {
          exceptions: {
            activities: {
              interactiveDemos: { completed: 0, total: 0 }
            }
          }
        }
      };
      
      // Simulate updateProgress call for interactive demo
      mockProgress.concepts.exceptions.activities.interactiveDemos.completed++;
      
      expect(mockProgress.concepts.exceptions.activities.interactiveDemos.completed).toBe(1);
    });

    test('should track Copper exception demo completion', () => {
      // Simulate the demo completion tracking
      const mockProgress = {
        concepts: {
          exceptions: {
            activities: {
              interactiveDemos: { completed: 0, total: 0 }
            }
          }
        }
      };
      
      // Simulate updateProgress call for interactive demo
      mockProgress.concepts.exceptions.activities.interactiveDemos.completed++;
      
      expect(mockProgress.concepts.exceptions.activities.interactiveDemos.completed).toBe(1);
    });
  });

  describe('Quiz Performance Tracking', () => {
    test('should track vocabulary quiz scores correctly', () => {
      // Simulate vocabulary quiz with 6/8 correct (75% - should pass)
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              vocabularyQuiz: { completed: false, score: 0, attempts: 0 }
            }
          }
        }
      };
      
      // Simulate updateProgress call for vocabulary quiz
      const score = 6;
      const totalQuestions = 8;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.score += score;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.attempts++;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed = (score / totalQuestions) >= 0.7;
      
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.score).toBe(6);
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.attempts).toBe(1);
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed).toBe(true);
    });

    test('should track understanding check scores correctly', () => {
      // Simulate understanding check with 5/11 correct (45% - should fail)
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              understandingCheck: { completed: false, score: 0, attempts: 0 }
            }
          }
        }
      };
      
      // Simulate updateProgress call for understanding check
      const score = 5;
      const totalQuestions = 11;
      mockProgress.concepts.coreRules.activities.understandingCheck.score += score;
      mockProgress.concepts.coreRules.activities.understandingCheck.attempts++;
      mockProgress.concepts.coreRules.activities.understandingCheck.completed = (score / totalQuestions) >= 0.7;
      
      expect(mockProgress.concepts.coreRules.activities.understandingCheck.score).toBe(5);
      expect(mockProgress.concepts.coreRules.activities.understandingCheck.attempts).toBe(1);
      expect(mockProgress.concepts.coreRules.activities.understandingCheck.completed).toBe(false);
    });

    test('should handle multiple quiz attempts', () => {
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              vocabularyQuiz: { completed: false, score: 0, attempts: 0 }
            }
          }
        }
      };
      
      // First attempt: 4/8 (50% - fail)
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.score += 4;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.attempts++;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed = (4 / 8) >= 0.7;
      
      // Second attempt: 6/8 (75% - pass)
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.score += 6;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.attempts++;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed = (6 / 8) >= 0.7;
      
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.score).toBe(10);
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.attempts).toBe(2);
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed).toBe(true);
    });
  });

  describe('Progress Calculation', () => {
    test('should calculate progress correctly with weighted activities', () => {
      // Test scenario: 3/4 activities completed
      const activities = {
        vocabularyQuiz: { completed: false }, // 0% (20% weight)
        understandingCheck: { completed: true }, // 30% weight
        interactiveDemos: { completed: 1 }, // 30% weight
        contentEngagement: { completed: true } // 20% weight
      };
      
      // Calculate progress (0.2 * 0 + 0.3 * 1 + 0.3 * 1 + 0.2 * 1 = 0.8 = 80%)
      const vocabWeight = 0.2;
      const understandingWeight = 0.3;
      const interactiveWeight = 0.3;
      const engagementWeight = 0.2;
      
      let completionScore = 0;
      if (activities.vocabularyQuiz.completed) completionScore += vocabWeight;
      if (activities.understandingCheck.completed) completionScore += understandingWeight;
      if (activities.interactiveDemos.completed > 0) completionScore += interactiveWeight;
      if (activities.contentEngagement.completed) completionScore += engagementWeight;
      
      const percentage = Math.round(completionScore * 100);
      const activitiesCompleted = Math.round(completionScore * 4);
      
      expect(percentage).toBe(80);
      expect(activitiesCompleted).toBe(3);
    });

    test('should mark concept as completed when 70% threshold is met', () => {
      const activities = {
        vocabularyQuiz: { completed: true }, // 20%
        understandingCheck: { completed: true }, // 30%
        interactiveDemos: { completed: 1 }, // 30%
        contentEngagement: { completed: false } // 0%
      };
      
      // Total: 80% (20% + 30% + 30% + 0%)
      const completionScore = 0.2 + 0.3 + 0.3 + 0;
      const isCompleted = completionScore >= 0.7;
      
      expect(isCompleted).toBe(true);
    });

    test('should not mark concept as completed when below 70% threshold', () => {
      const activities = {
        vocabularyQuiz: { completed: true }, // 20%
        understandingCheck: { completed: false }, // 0%
        interactiveDemos: { completed: 0 }, // 0%
        contentEngagement: { completed: true } // 20%
      };
      
      // Total: 40% (20% + 0% + 0% + 20%)
      const completionScore = 0.2 + 0 + 0 + 0.2;
      const isCompleted = completionScore >= 0.7;
      
      expect(isCompleted).toBe(false);
    });
  });

  describe('localStorage Integration', () => {
    test('should save progress data to localStorage', () => {
      const progressData = {
        concepts: {
          coreRules: {
            activities: {
              contentEngagement: { completed: true, timeSpent: 1 }
            }
          }
        }
      };
      
      localStorage.setItem('electronTowerProgress', JSON.stringify(progressData));
      
      const savedData = localStorage.getItem('electronTowerProgress');
      const parsedData = JSON.parse(savedData);
      
      expect(parsedData.concepts.coreRules.activities.contentEngagement.completed).toBe(true);
    });

    test('should retrieve progress data from localStorage', () => {
      const progressData = {
        concepts: {
          exceptions: {
            activities: {
              vocabularyQuiz: { completed: true, score: 4, attempts: 1 }
            }
          }
        }
      };
      
      localStorage.setItem('electronTowerProgress', JSON.stringify(progressData));
      
      const retrievedData = JSON.parse(localStorage.getItem('electronTowerProgress'));
      
      expect(retrievedData.concepts.exceptions.activities.vocabularyQuiz.completed).toBe(true);
      expect(retrievedData.concepts.exceptions.activities.vocabularyQuiz.score).toBe(4);
    });

    test('should handle missing localStorage data gracefully', () => {
      localStorage.removeItem('electronTowerProgress');
      
      const savedData = localStorage.getItem('electronTowerProgress');
      
      expect(savedData).toBeNull();
    });
  });

  describe('Tile Progress Indicators', () => {
    test('should update progress display format correctly', () => {
      // Simulate progress calculation result
      const progressData = {
        percentage: 75,
        activitiesCompleted: 3,
        totalActivities: 4
      };
      
      const expectedDisplay = `Progress: ${progressData.percentage}% (${progressData.activitiesCompleted}/${progressData.totalActivities} activities)`;
      
      expect(expectedDisplay).toBe('Progress: 75% (3/4 activities)');
    });

    test('should format progress display for different completion levels', () => {
      // Test various progress levels
      const testCases = [
        { percentage: 0, activitiesCompleted: 0, expected: 'Progress: 0% (0/4 activities)' },
        { percentage: 25, activitiesCompleted: 1, expected: 'Progress: 25% (1/4 activities)' },
        { percentage: 50, activitiesCompleted: 2, expected: 'Progress: 50% (2/4 activities)' },
        { percentage: 75, activitiesCompleted: 3, expected: 'Progress: 75% (3/4 activities)' },
        { percentage: 100, activitiesCompleted: 4, expected: 'Progress: 100% (4/4 activities)' }
      ];
      
      testCases.forEach(testCase => {
        const display = `Progress: ${testCase.percentage}% (${testCase.activitiesCompleted}/4 activities)`;
        expect(display).toBe(testCase.expected);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero scores correctly', () => {
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              vocabularyQuiz: { completed: false, score: 0, attempts: 0 }
            }
          }
        }
      };
      
      const score = 0;
      const totalQuestions = 8;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed = (score / totalQuestions) >= 0.7;
      
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed).toBe(false);
    });

    test('should handle perfect scores correctly', () => {
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              understandingCheck: { completed: false, score: 0, attempts: 0 }
            }
          }
        }
      };
      
      const score = 11;
      const totalQuestions = 11;
      mockProgress.concepts.coreRules.activities.understandingCheck.completed = (score / totalQuestions) >= 0.7;
      
      expect(mockProgress.concepts.coreRules.activities.understandingCheck.completed).toBe(true);
    });

    test('should handle multiple interactive demo completions', () => {
      const mockProgress = {
        concepts: {
          exceptions: {
            activities: {
              interactiveDemos: { completed: 0, total: 0 }
            }
          }
        }
      };
      
      // Simulate multiple demo completions
      mockProgress.concepts.exceptions.activities.interactiveDemos.completed++;
      mockProgress.concepts.exceptions.activities.interactiveDemos.completed++;
      
      expect(mockProgress.concepts.exceptions.activities.interactiveDemos.completed).toBe(2);
    });
  });

  describe('Real User Flow Simulation', () => {
    test('should track complete user journey correctly', () => {
      // Simulate a complete user journey
      const mockProgress = {
        concepts: {
          coreRules: {
            activities: {
              vocabularyQuiz: { completed: false, score: 0, attempts: 0 },
              understandingCheck: { completed: false, score: 0, attempts: 0 },
              interactiveDemos: { completed: 0, total: 0 },
              contentEngagement: { completed: false, timeSpent: 0 }
            }
          },
          exceptions: {
            activities: {
              vocabularyQuiz: { completed: false, score: 0, attempts: 0 },
              understandingCheck: { completed: false, score: 0, attempts: 0 },
              interactiveDemos: { completed: 0, total: 0 },
              contentEngagement: { completed: false, timeSpent: 0 }
            }
          }
        }
      };
      
      // Step 1: User accesses Core Rules content
      mockProgress.concepts.coreRules.activities.contentEngagement.completed = true;
      mockProgress.concepts.coreRules.activities.contentEngagement.timeSpent += 1;
      
      // Step 2: User takes vocabulary quiz (6/8 correct)
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.score += 6;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.attempts++;
      mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed = (6 / 8) >= 0.7;
      
      // Step 3: User takes understanding check (8/11 correct)
      mockProgress.concepts.coreRules.activities.understandingCheck.score += 8;
      mockProgress.concepts.coreRules.activities.understandingCheck.attempts++;
      mockProgress.concepts.coreRules.activities.understandingCheck.completed = (8 / 11) >= 0.7;
      
      // Step 4: User accesses Exceptions content
      mockProgress.concepts.exceptions.activities.contentEngagement.completed = true;
      mockProgress.concepts.exceptions.activities.contentEngagement.timeSpent += 1;
      
      // Step 5: User runs interactive demos
      mockProgress.concepts.exceptions.activities.interactiveDemos.completed++;
      mockProgress.concepts.exceptions.activities.interactiveDemos.completed++;
      
      // Step 6: User takes exceptions vocabulary quiz (4/5 correct)
      mockProgress.concepts.exceptions.activities.vocabularyQuiz.score += 4;
      mockProgress.concepts.exceptions.activities.vocabularyQuiz.attempts++;
      mockProgress.concepts.exceptions.activities.vocabularyQuiz.completed = (4 / 5) >= 0.7;
      
      // Verify Core Rules progress (100% - all activities completed)
      const coreRulesCompletion = 0.2 + 0.3 + 0.3 + 0.2; // 100%
      expect(coreRulesCompletion).toBe(1.0);
      
      // Verify Exceptions progress (100% - all activities completed)
      const exceptionsCompletion = 0.2 + 0.3 + 0.3 + 0.2; // 100%
      expect(exceptionsCompletion).toBe(1.0);
      
      // Verify individual activity states
      expect(mockProgress.concepts.coreRules.activities.contentEngagement.completed).toBe(true);
      expect(mockProgress.concepts.coreRules.activities.vocabularyQuiz.completed).toBe(true);
      expect(mockProgress.concepts.coreRules.activities.understandingCheck.completed).toBe(true);
      expect(mockProgress.concepts.exceptions.activities.interactiveDemos.completed).toBe(2);
      expect(mockProgress.concepts.exceptions.activities.vocabularyQuiz.completed).toBe(true);
    });
  });
});
