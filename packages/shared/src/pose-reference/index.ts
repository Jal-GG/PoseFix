import type { PoseDefinition } from '../types/index.ts';

import {
  mountainPose as _mountainPose,
  warriorI as _warriorI,
  warriorII as _warriorII,
  treePose as _treePose,
  downwardDog as _downwardDog,
  childsPose as _childsPose,
  cobraPose as _cobraPose,
  trianglePose as _trianglePose,
  seatedForwardBend as _seatedForwardBend,
  bridgePose as _bridgePose,
} from './yoga.ts';

import {
  standingHipAbduction as _standingHipAbduction,
  clamshell as _clamshell,
  birdDog as _birdDog,
  deadBug as _deadBug,
  wallSlide as _wallSlide,
  chinTuck as _chinTuck,
  hipFlexorStretch as _hipFlexorStretch,
  hamstringStretch as _hamstringStretch,
  quadStretch as _quadStretch,
  thoracicExtension as _thoracicExtension,
} from './physiotherapy.ts';

import {
  chestOpener as _chestOpener,
  shoulderCrossBody as _shoulderCrossBody,
  neckLateralFlexion as _neckLateralFlexion,
  sideBend as _sideBend,
  seatedSpinalTwist as _seatedSpinalTwist,
  pigeonPrep as _pigeonPrep,
  calfStretch as _calfStretch,
  itBandStretch as _itBandStretch,
  wristFlexorStretch as _wristFlexorStretch,
  lungeHipFlexor as _lungeHipFlexor,
} from './stretching.ts';

export const mountainPose = _mountainPose;
export const warriorI = _warriorI;
export const warriorII = _warriorII;
export const treePose = _treePose;
export const downwardDog = _downwardDog;
export const childsPose = _childsPose;
export const cobraPose = _cobraPose;
export const trianglePose = _trianglePose;
export const seatedForwardBend = _seatedForwardBend;
export const bridgePose = _bridgePose;

export const standingHipAbduction = _standingHipAbduction;
export const clamshell = _clamshell;
export const birdDog = _birdDog;
export const deadBug = _deadBug;
export const wallSlide = _wallSlide;
export const chinTuck = _chinTuck;
export const hipFlexorStretch = _hipFlexorStretch;
export const hamstringStretch = _hamstringStretch;
export const quadStretch = _quadStretch;
export const thoracicExtension = _thoracicExtension;

export const chestOpener = _chestOpener;
export const shoulderCrossBody = _shoulderCrossBody;
export const neckLateralFlexion = _neckLateralFlexion;
export const sideBend = _sideBend;
export const seatedSpinalTwist = _seatedSpinalTwist;
export const pigeonPrep = _pigeonPrep;
export const calfStretch = _calfStretch;
export const itBandStretch = _itBandStretch;
export const wristFlexorStretch = _wristFlexorStretch;
export const lungeHipFlexor = _lungeHipFlexor;

export const poseLibrary: Record<string, PoseDefinition> = {
  yoga_mountain: mountainPose,
  yoga_warrior_i: warriorI,
  yoga_warrior_ii: warriorII,
  yoga_tree: treePose,
  yoga_downward_dog: downwardDog,
  yoga_childs_pose: childsPose,
  yoga_cobra: cobraPose,
  yoga_triangle: trianglePose,
  yoga_seated_forward_bend: seatedForwardBend,
  yoga_bridge: bridgePose,

  physio_standing_hip_abduction: standingHipAbduction,
  physio_clamshell: clamshell,
  physio_bird_dog: birdDog,
  physio_dead_bug: deadBug,
  physio_wall_slide: wallSlide,
  physio_chin_tuck: chinTuck,
  physio_hip_flexor_stretch: hipFlexorStretch,
  physio_hamstring_stretch: hamstringStretch,
  physio_quad_stretch: quadStretch,
  physio_thoracic_extension: thoracicExtension,

  stretch_chest_opener: chestOpener,
  stretch_shoulder_cross_body: shoulderCrossBody,
  stretch_neck_lateral_flexion: neckLateralFlexion,
  stretch_side_bend: sideBend,
  stretch_seated_spinal_twist: seatedSpinalTwist,
  stretch_pigeon_prep: pigeonPrep,
  stretch_calf: calfStretch,
  stretch_it_band: itBandStretch,
  stretch_wrist_flexor: wristFlexorStretch,
  stretch_lunge_hip_flexor: lungeHipFlexor,
};

export function getPoseById(id: string): PoseDefinition | undefined {
  return poseLibrary[id];
}

export function getPosesByCategory(category: 'yoga' | 'physiotherapy' | 'stretching'): PoseDefinition[] {
  return Object.values(poseLibrary).filter((pose) => pose.category === category);
}

export function getPosesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): PoseDefinition[] {
  return Object.values(poseLibrary).filter((pose) => pose.difficulty === difficulty);
}
