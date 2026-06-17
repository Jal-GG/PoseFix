import { poseLibrary } from '@posefix/shared/pose-reference';

export interface SessionAnalytics {
  sessionStats: {
    totalActiveTimeSeconds: number;
    averageScore: number;
    scoreTrajectory: 'improving' | 'declining' | 'stable';
    totalMistakes: number;
    mistakeFreePercentage: number;
    peakScore: number;
    peakScoreTimestamp: Date;
  };
  perPoseStats: Array<{
    poseId: string;
    poseName: string;
    meanScore: number;
    stdDevScore: number;
    timeInFormPercentage: number;
    topMistakes: Array<{ code: string; count: number }>;
    holdCompleted: boolean;
  }>;
  mistakeAnalysis: Array<{
    code: string;
    totalIntervals: number;
    percentageOfSession: number;
    commonPoses: string[];
    fatiguePattern: boolean;
  }>;
}

export interface ReportData {
  clientName: string;
  sessionDate: string;
  sessionType: string;
  trainerName: string;
  executiveSummary: string;
  sessionOverview: SessionAnalytics['sessionStats'];
  poseBreakdown: SessionAnalytics['perPoseStats'];
  mistakePatterns: SessionAnalytics['mistakeAnalysis'];
  progressTrends: Array<{
    poseName: string;
    scores: number[];
    personalBest: number;
  }>;
  recommendations: string[];
}

function computeStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((sq, n) => sq + (n - mean) ** 2, 0) / values.length);
}

export function analyzeSession(
  poseAttempts: Array<{
    poseId: string;
    timestamp: Date;
    overallScore: number;
    detectedMistakes: Array<{ code: string; severity: string; count: number }>;
  }>,
): SessionAnalytics {
  const totalTime = poseAttempts.length > 0
    ? (poseAttempts[poseAttempts.length - 1].timestamp.getTime() - poseAttempts[0].timestamp.getTime()) / 1000
    : 0;

  const scores = poseAttempts.map((p) => p.overallScore);
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const peakEntry = scores.length > 0 ? scores.reduce((max, s, i) => (s > max.score ? { score: s, index: i } : max), { score: 0, index: 0 }) : { score: 0, index: 0 };
  const peakScore = peakEntry.score;
  const peakScoreTimestamp = peakEntry.index >= 0 ? poseAttempts[peakEntry.index]?.timestamp : new Date();

  const allMistakes = poseAttempts.flatMap((p) => p.detectedMistakes);
  const totalMistakes = allMistakes.reduce((sum, m) => sum + m.count, 0);
  const mistakeFreeIntervals = poseAttempts.filter((p) => p.detectedMistakes.length === 0).length;
  const mistakeFreePercentage = poseAttempts.length > 0 ? Math.round((mistakeFreeIntervals / poseAttempts.length) * 100) : 0;

  const half = Math.floor(scores.length / 2);
  const firstHalfAvg = half > 0 ? scores.slice(0, half).reduce((a, b) => a + b, 0) / half : 0;
  const secondHalfAvg = half < scores.length ? scores.slice(half).reduce((a, b) => a + b, 0) / (scores.length - half) : 0;
  let scoreTrajectory: 'improving' | 'declining' | 'stable';
  const diff = secondHalfAvg - firstHalfAvg;
  if (diff > 3) scoreTrajectory = 'improving';
  else if (diff < -3) scoreTrajectory = 'declining';
  else scoreTrajectory = 'stable';

  const poseGroups = new Map<string, typeof poseAttempts>();
  for (const attempt of poseAttempts) {
    const existing = poseGroups.get(attempt.poseId) || [];
    existing.push(attempt);
    poseGroups.set(attempt.poseId, existing);
  }

  const perPoseStats = Array.from(poseGroups.entries()).map(([poseId, attempts]) => {
    const poseScores = attempts.map((a) => a.overallScore);
    const pose = poseLibrary[poseId];
    const mistakeCounts = new Map<string, number>();
    for (const attempt of attempts) {
      for (const m of attempt.detectedMistakes) {
        mistakeCounts.set(m.code, (mistakeCounts.get(m.code) || 0) + m.count);
      }
    }
    const topMistakes = Array.from(mistakeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code, count]) => ({ code, count }));
    const timeInForm = attempts.filter((a) => a.overallScore >= 70).length;
    return {
      poseId,
      poseName: pose?.name || poseId,
      meanScore: Math.round(poseScores.reduce((a, b) => a + b, 0) / poseScores.length),
      stdDevScore: Math.round(computeStandardDeviation(poseScores) * 10) / 10,
      timeInFormPercentage: Math.round((timeInForm / attempts.length) * 100),
      topMistakes,
      holdCompleted: attempts.length > 0,
    };
  });

  const mistakeGroups = new Map<string, { intervals: number; poses: Set<string>; timestamps: number[] }>();
  for (const attempt of poseAttempts) {
    for (const m of attempt.detectedMistakes) {
      const entry = mistakeGroups.get(m.code) || { intervals: 0, poses: new Set(), timestamps: [] };
      entry.intervals += m.count;
      entry.poses.add(attempt.poseId);
      entry.timestamps.push(attempt.timestamp.getTime());
      mistakeGroups.set(m.code, entry);
    }
  }

  const mistakeAnalysis = Array.from(mistakeGroups.entries()).map(([code, data]) => {
    const firstHalfMistakes = data.timestamps.filter((t, i) => i < data.timestamps.length / 2).length;
    const secondHalfMistakes = data.timestamps.length - firstHalfMistakes;
    return {
      code,
      totalIntervals: data.intervals,
      percentageOfSession: poseAttempts.length > 0 ? Math.round((data.timestamps.length / poseAttempts.length) * 100) : 0,
      commonPoses: Array.from(data.poses),
      fatiguePattern: secondHalfMistakes > firstHalfMistakes * 1.5,
    };
  });

  return {
    sessionStats: {
      totalActiveTimeSeconds: totalTime,
      averageScore,
      scoreTrajectory,
      totalMistakes,
      mistakeFreePercentage,
      peakScore,
      peakScoreTimestamp,
    },
    perPoseStats,
    mistakeAnalysis,
  };
}

export function generateExecutiveSummary(analytics: SessionAnalytics): string {
  const { sessionStats, perPoseStats } = analytics;
  const bestPose = perPoseStats.reduce((best, p) => (p.meanScore > (best?.meanScore || 0) ? p : best), perPoseStats[0]);
  const worstPose = perPoseStats.reduce((worst, p) => (p.meanScore < (worst?.meanScore || 100) ? p : worst), perPoseStats[0]);

  const parts: string[] = [];
  parts.push(`You completed this session with an average score of ${sessionStats.averageScore}, maintaining good form ${sessionStats.mistakeFreePercentage}% of the time.`);

  if (sessionStats.scoreTrajectory === 'improving') {
    parts.push('Your scores improved throughout the session — great endurance and focus.');
  } else if (sessionStats.scoreTrajectory === 'declining') {
    parts.push('Your scores dipped toward the end, which may indicate fatigue — consider shorter sessions or breaks.');
  }

  if (bestPose) parts.push(`Your strongest pose was ${bestPose.poseName} (${bestPose.meanScore}), while ${worstPose?.poseName} (${worstPose?.meanScore}) needs the most attention.`);
  if (analytics.sessionStats.totalMistakes > 0) parts.push(`Common error patterns include ${analytics.mistakeAnalysis.slice(0, 2).map((m) => m.code.replace(/_/g, ' ')).join(' and ')}, which we will target in upcoming sessions.`);

  return parts.join(' ').slice(0, 500);
}

export function generateRecommendations(analytics: SessionAnalytics): string[] {
  const recs: string[] = [];
  const worstPose = analytics.perPoseStats.reduce((worst, p) => (p.meanScore < (worst?.meanScore || 100) ? p : worst), analytics.perPoseStats[0]);

  if (worstPose && worstPose.meanScore < 70) {
    recs.push(`Focus on ${worstPose.poseName} — consider regressing to an easier variation and practicing with longer hold times.`);
  }

  const fatigueMistakes = analytics.mistakeAnalysis.filter((m) => m.fatiguePattern);
  if (fatigueMistakes.length > 0) {
    recs.push(`Fatigue-related mistakes (${fatigueMistakes.map((m) => m.code.replace(/_/g, ' ')).join(', ')}) appear later in sessions. Try adding rest breaks or reducing session duration.`);
  }

  if (analytics.sessionStats.mistakeFreePercentage < 50) {
    recs.push('Prioritize form over duration — reduce pose speed and focus on alignment cues.');
  }

  const improvingPoses = analytics.perPoseStats.filter((p) => p.timeInFormPercentage > 70);
  if (improvingPoses.length > 0) {
    recs.push(`Continue the excellent progress on ${improvingPoses.map((p) => p.poseName).join(', ')}.`);
  }

  if (recs.length === 0) {
    recs.push('Great session! Continue with the current program to maintain progress.');
  }

  return recs.slice(0, 3);
}
