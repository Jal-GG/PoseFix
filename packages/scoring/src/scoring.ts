import type {
  PoseDefinition,
  JointTarget,
  AlignmentTarget,
  MistakePattern,
  LandmarkData,
  JointAngle,
  AlignmentCheck,
  MistakeDetection,
  PoseScore,
} from '@posefix/shared/types';
import {
  computeAngle,
  computeTrunkInclination,
  computeCervicalAlignment,
  computeKneeFlexion,
  computeHipFlexion,
  computeElbowFlexion,
  computeShoulderFlexion,
  computeAnkleDorsiflexion,
} from './angles.ts';
import { LANDMARK_INDICES } from '@posefix/shared/constants';

type LandmarkPoint = { x: number; y: number; z: number };

function getLM(data: LandmarkData, index: number): LandmarkPoint | null {
  const lm = data[index];
  if (!lm || lm.visibility < 0.5) return null;
  return lm;
}

function getMidpoint(data: LandmarkData, i1: number, i2: number): LandmarkPoint | null {
  const a = getLM(data, i1);
  const b = getLM(data, i2);
  if (!a || !b) return null;
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
}

const ANGLE_COMPUTATIONS: Record<string, (data: LandmarkData) => number | null> = {
  trunk_inclination: (data) => {
    const lh = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const rh = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    if (!lh || !rh || !ls || !rs) return null;
    return computeTrunkInclination(lh, rh, ls, rs);
  },
  cervical_alignment: (data) => {
    const nose = getLM(data, LANDMARK_INDICES.NOSE);
    const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    if (!nose || !ls || !rs) return null;
    return computeCervicalAlignment(nose, ls, rs);
  },
  front_knee_flexion: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  back_knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.RIGHT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.RIGHT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  left_knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  right_knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.RIGHT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.RIGHT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  front_hip_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    if (!shoulder || !hip || !knee) return null;
    return computeHipFlexion(shoulder, hip, knee);
  },
  back_hip_extension: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.RIGHT_KNEE);
    if (!shoulder || !hip || !knee) return null;
    return computeHipFlexion(shoulder, hip, knee);
  },
  standing_hip_abduction: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    const ms = getMidpoint(data, LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_SHOULDER);
    if (!ms) return null;
    return computeAngle(ms, hip, { x: knee.x, y: knee.y, z: hip.z });
  },
  standing_knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  left_standing_knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  right_standing_knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.RIGHT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.RIGHT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  front_shoulder_abduction: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.LEFT_ELBOW);
    if (!hip || !shoulder || !elbow) return null;
    return computeShoulderFlexion(hip, shoulder, elbow);
  },
  back_shoulder_abduction: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const shoulder = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.RIGHT_ELBOW);
    if (!hip || !shoulder || !elbow) return null;
    return computeShoulderFlexion(hip, shoulder, elbow);
  },
  elbow_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.LEFT_ELBOW);
    const wrist = getLM(data, LANDMARK_INDICES.LEFT_WRIST);
    if (!shoulder || !elbow || !wrist) return null;
    return computeElbowFlexion(shoulder, elbow, wrist);
  },
  left_elbow_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.LEFT_ELBOW);
    const wrist = getLM(data, LANDMARK_INDICES.LEFT_WRIST);
    if (!shoulder || !elbow || !wrist) return null;
    return computeElbowFlexion(shoulder, elbow, wrist);
  },
  right_elbow_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.RIGHT_ELBOW);
    const wrist = getLM(data, LANDMARK_INDICES.RIGHT_WRIST);
    if (!shoulder || !elbow || !wrist) return null;
    return computeElbowFlexion(shoulder, elbow, wrist);
  },
  knee_flexion: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  left_knee_flexion: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  right_knee_flexion: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.RIGHT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.RIGHT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
  hip_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    if (!shoulder || !hip || !knee) return null;
    return computeHipFlexion(shoulder, hip, knee);
  },
  left_hip_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    if (!shoulder || !hip || !knee) return null;
    return computeHipFlexion(shoulder, hip, knee);
  },
  right_hip_flexion: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.RIGHT_KNEE);
    if (!shoulder || !hip || !knee) return null;
    return computeHipFlexion(shoulder, hip, knee);
  },
  spinal_extension: (data) => {
    const lh = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const rh = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const nose = getLM(data, LANDMARK_INDICES.NOSE);
    if (!lh || !rh || !ls || !rs || !nose) return null;
    const mh = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2, z: (lh.z + rh.z) / 2 };
    const ms = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2, z: (ls.z + rs.z) / 2 };
    return computeAngle(mh, ms, nose);
  },
  hip_extension: (data) => {
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    if (!shoulder || !hip || !knee) return null;
    return computeHipFlexion(shoulder, hip, knee);
  },
  trunk_flexion: (data) => {
    const lh = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const rh = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    if (!lh || !rh || !ls || !rs) return null;
    return computeTrunkInclination(lh, rh, ls, rs);
  },
  trunk_rotation: (data) => {
    const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const lh = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const rh = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    if (!ls || !rs || !lh || !rh) return null;
    const shoulderVec = { x: rs.x - ls.x, y: rs.y - ls.y, z: rs.z - ls.z };
    const hipVec = { x: rh.x - lh.x, y: rh.y - lh.y, z: rh.z - lh.z };
    const dot = shoulderVec.x * hipVec.x + shoulderVec.y * hipVec.y + shoulderVec.z * hipVec.z;
    const magS = Math.sqrt(shoulderVec.x ** 2 + shoulderVec.y ** 2 + shoulderVec.z ** 2);
    const magH = Math.sqrt(hipVec.x ** 2 + hipVec.y ** 2 + hipVec.z ** 2);
    if (magS === 0 || magH === 0) return null;
    return (Math.acos(Math.max(-1, Math.min(1, dot / (magS * magH)))) * 180) / Math.PI;
  },
  trunk_lateral_flexion: (data) => {
    const nose = getLM(data, LANDMARK_INDICES.NOSE);
    const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const lh = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const rh = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    if (!nose || !ls || !rs || !lh || !rh) return null;
    const ms = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2, z: (ls.z + rs.z) / 2 };
    const mh = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2, z: (lh.z + rh.z) / 2 };
    const vertical: LandmarkPoint = { x: mh.x, y: mh.y + 1, z: mh.z };
    return 90 - computeAngle(mh, ms, vertical);
  },
  shoulder_flexion: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const shoulder = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.LEFT_ELBOW);
    if (!hip || !shoulder || !elbow) return null;
    return computeShoulderFlexion(hip, shoulder, elbow);
  },
  shoulder_flexion_overhead: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
    const shoulder = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
    const elbow = getLM(data, LANDMARK_INDICES.RIGHT_ELBOW);
    if (!hip || !shoulder || !elbow) return null;
    return computeShoulderFlexion(hip, shoulder, elbow);
  },
  knee_extension: (data) => {
    const hip = getLM(data, LANDMARK_INDICES.LEFT_HIP);
    const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
    const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
    if (!hip || !knee || !ankle) return null;
    return computeKneeFlexion(hip, knee, ankle);
  },
};

function computeSubScore(actual: number, ideal: number, tolerance: number): number {
  const deviation = Math.abs(actual - ideal);
  if (deviation <= tolerance) {
    return 100 - (deviation / tolerance) * 15;
  }
  return Math.max(0, 85 - ((deviation - tolerance) / tolerance) * 85);
}

function computeJointAngles(data: LandmarkData, jointTargets: JointTarget[]): JointAngle[] {
  return jointTargets.map((target) => {
    const computer = ANGLE_COMPUTATIONS[target.jointName];
    const angle = computer ? computer(data) : null;
    return {
      jointName: target.jointName,
      angleDegrees: angle ?? 0,
      idealRange: [target.idealAngleDegrees - target.toleranceDegrees, target.idealAngleDegrees + target.toleranceDegrees],
      subScore: angle !== null ? computeSubScore(angle, target.idealAngleDegrees, target.toleranceDegrees) : 0,
      weight: target.weight,
    };
  });
}

function computeAlignmentChecks(data: LandmarkData, checks: AlignmentTarget[]): AlignmentCheck[] {
  return checks.map((check) => {
    let deviation = 0;
    switch (check.checkName) {
      case 'hips_level':
      case 'pelvis_level': {
        const lh = getLM(data, LANDMARK_INDICES.LEFT_HIP);
        const rh = getLM(data, LANDMARK_INDICES.RIGHT_HIP);
        if (lh && rh) deviation = Math.abs(lh.y - rh.y) * 180;
        break;
      }
      case 'shoulders_level': {
        const ls = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
        const rs = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
        if (ls && rs) deviation = Math.abs(ls.y - rs.y) * 180;
        break;
      }
      case 'torso_upright': {
        const comp = ANGLE_COMPUTATIONS.trunk_inclination(data);
        if (comp !== null) deviation = Math.abs(comp);
        break;
      }
      case 'front_knee_over_ankle': {
        const knee = getLM(data, LANDMARK_INDICES.LEFT_KNEE);
        const ankle = getLM(data, LANDMARK_INDICES.LEFT_ANKLE);
        if (knee && ankle) deviation = Math.max(0, (knee.x - ankle.x) * 100 - 5);
        break;
      }
      default:
        deviation = 0;
    }
    return {
      checkName: check.checkName,
      passed: deviation <= check.thresholdDegrees,
      deviation,
      threshold: check.thresholdDegrees,
    };
  });
}

function detectMistakes(
  data: LandmarkData,
  jointAngles: JointAngle[],
  alignmentChecks: AlignmentCheck[],
  patterns: MistakePattern[],
): MistakeDetection[] {
  return patterns.map((pattern) => {
    const triggered = pattern.conditions.every((condition) => {
      if (condition.type === 'joint_angle' && condition.jointName) {
        const angle = jointAngles.find((j) => j.jointName === condition.jointName);
        if (!angle) return false;
        switch (condition.operator) {
          case 'lt': return angle.angleDegrees < condition.value;
          case 'gt': return angle.angleDegrees > condition.value;
          case 'lte': return angle.angleDegrees <= condition.value;
          case 'gte': return angle.angleDegrees >= condition.value;
          case 'out_of_range': return angle.angleDegrees < (condition.value - (condition.tolerance ?? 0)) || angle.angleDegrees > (condition.value + (condition.tolerance ?? 0));
          default: return false;
        }
      }
      if (condition.type === 'alignment' && condition.checkName) {
        const check = alignmentChecks.find((c) => c.checkName === condition.checkName);
        if (!check) return false;
        switch (condition.operator) {
          case 'gt': return check.deviation > condition.value;
          default: return !check.passed;
        }
      }
      if (condition.type === 'symmetry') {
        const left = getLM(data, LANDMARK_INDICES.LEFT_SHOULDER);
        const right = getLM(data, LANDMARK_INDICES.RIGHT_SHOULDER);
        if (!left || !right) return false;
        return Math.abs(left.y - right.y) > condition.value;
      }
      return false;
    });

    return {
      code: pattern.code,
      severity: pattern.severity,
      userMessage: pattern.userMessage,
      trainerNote: pattern.trainerNote,
      affectedLandmarks: pattern.affectedLandmarks,
      frameCount: triggered ? 1 : 0,
    };
  });
}

export function scorePoseFrame(
  data: LandmarkData,
  pose: PoseDefinition,
): PoseScore {
  const visibleCount = Object.values(data).filter((lm) => lm.visibility >= 0.5).length;
  const confidence = Math.min(1, visibleCount / 20);
  const lowConfidence = visibleCount < 20;

  const jointAngles = computeJointAngles(data, pose.jointTargets);
  const alignmentChecks = computeAlignmentChecks(data, pose.alignmentChecks);

  if (lowConfidence) {
    return {
      overall: 0,
      band: 'Priority Correction',
      jointAngles,
      alignmentChecks,
      mistakes: [],
      phase: 'hold',
      confidence,
    };
  }

  const mistakes = detectMistakes(data, jointAngles, alignmentChecks, pose.mistakePatterns);
  const activeMistakes = mistakes.filter((m) => m.frameCount > 0);

  const totalWeight = pose.jointTargets.reduce((sum, t) => sum + t.weight, 0);
  const weightedScore = jointAngles.reduce((sum, j) => sum + j.subScore * j.weight, 0);
  const overall = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;

  const mistakePenalty = activeMistakes.length * 5;
  const finalScore = Math.max(0, overall - mistakePenalty);

  let band: PoseScore['band'];
  if (finalScore >= 85) band = 'Good Form';
  else if (finalScore >= 70) band = 'Acceptable';
  else if (finalScore >= 50) band = 'Needs Correction';
  else band = 'Priority Correction';

  return {
    overall: finalScore,
    band,
    jointAngles,
    alignmentChecks,
    mistakes: activeMistakes,
    phase: 'hold',
    confidence,
  };
}
