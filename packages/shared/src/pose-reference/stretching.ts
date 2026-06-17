import type { PoseDefinition } from '../types/index.ts';

export const chestOpener: PoseDefinition = {
  id: 'stretch_chest_opener',
  name: 'Chest Opener',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'Standing, clasp hands behind the back and straighten arms while opening the chest.',
  contraindications: ['shoulder impingement', 'rotator cuff injury'],
  jointTargets: [
    { jointName: 'shoulder_extension', idealAngleDegrees: 20, toleranceDegrees: 10, critical: false, weight: 0.25 },
    { jointName: 'shoulder_adduction', idealAngleDegrees: 10, toleranceDegrees: 10, critical: false, weight: 0.15 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 8, critical: true, weight: 0.3 },
    { jointName: 'cervical_alignment', idealAngleDegrees: 0, toleranceDegrees: 8, critical: false, weight: 0.15 },
    { jointName: 'elbow_extension', idealAngleDegrees: 180, toleranceDegrees: 10, critical: false, weight: 0.15 },
  ],
  alignmentChecks: [
    { checkName: 'torso_upright', description: 'Do not lean forward', thresholdDegrees: 8, critical: true },
    { checkName: 'shoulders_down', description: 'Shoulders should not elevate toward the ears', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { shoulder_extension: 10 }, alignmentChecks: ['torso_upright'] } },
    { name: 'hold', criteria: { jointTargets: { shoulder_extension: 20, elbow_extension: 180 }, alignmentChecks: ['torso_upright'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { shoulder_extension: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'leaning_forward',
      name: 'Leaning Forward',
      description: 'Torso leans forward to compensate for tight chest',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'torso_upright', operator: 'gt', value: 8 }],
      userMessage: 'Stand tall — focus on squeezing your shoulder blades together',
      trainerNote: 'Compensation for tight pectorals. Consider doorway stretch regression.',
      affectedLandmarks: [11, 12, 23, 24],
    },
  ],
  coachingCues: [
    'Draw your shoulder blades toward each other',
    'Keep your arms as straight as comfortable',
    'Lift your chest toward the ceiling',
    'Breathe deeply into the front of your chest',
  ],
};

export const shoulderCrossBody: PoseDefinition = {
  id: 'stretch_shoulder_cross_body',
  name: 'Shoulder Cross-Body Stretch',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'Bring one arm across the body and gently pull it toward the chest with the other arm.',
  contraindications: ['shoulder dislocation', 'AC joint injury'],
  jointTargets: [
    { jointName: 'shoulder_horizontal_adduction', idealAngleDegrees: 30, toleranceDegrees: 10, critical: false, weight: 0.4 },
    { jointName: 'trunk_rotation', idealAngleDegrees: 0, toleranceDegrees: 8, critical: true, weight: 0.3 },
    { jointName: 'shoulder_elevation', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.3 },
  ],
  alignmentChecks: [
    { checkName: 'no_trunk_rotation', description: 'Torso should not rotate with the arm', thresholdDegrees: 8, critical: true },
    { checkName: 'shoulder_down', description: 'Stretching shoulder should remain down, not elevated', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { shoulder_horizontal_adduction: 15 }, alignmentChecks: ['no_trunk_rotation'] } },
    { name: 'hold', criteria: { jointTargets: { shoulder_horizontal_adduction: 30 }, alignmentChecks: ['no_trunk_rotation'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { shoulder_horizontal_adduction: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'torso_rotating',
      name: 'Torso Rotating With Arm',
      description: 'The entire body rotates instead of isolating the shoulder',
      severity: 'low',
      conditions: [{ type: 'alignment', checkName: 'no_trunk_rotation', operator: 'gt', value: 8 }],
      userMessage: 'Keep your shoulders facing forward',
      trainerNote: 'Rotating the torso reduces the stretch on the posterior capsule.',
      affectedLandmarks: [11, 12, 23, 24],
    },
  ],
  coachingCues: [
    'Use your opposite hand to gently pull the arm across',
    'Keep the stretching arm straight',
    'Do not shrug the stretching shoulder',
    'Breathe and relax into the stretch',
  ],
};

export const neckLateralFlexion: PoseDefinition = {
  id: 'stretch_neck_lateral_flexion',
  name: 'Neck Lateral Flexion',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'Gently tilt the ear toward the shoulder. Stretches the upper trapezius and scalenes.',
  contraindications: ['acute neck injury', 'cervical spine instability'],
  jointTargets: [
    { jointName: 'cervical_lateral_flexion', idealAngleDegrees: 30, toleranceDegrees: 10, critical: false, weight: 0.5 },
    { jointName: 'shoulder_elevation_opposite', idealAngleDegrees: 0, toleranceDegrees: 10, critical: true, weight: 0.3 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 5, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'shoulder_relaxed', description: 'Shoulder on the stretching side should stay down', thresholdDegrees: 10, critical: true },
    { checkName: 'no_forward_bend', description: 'Head should not rotate forward', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { cervical_lateral_flexion: 15 }, alignmentChecks: ['shoulder_relaxed'] } },
    { name: 'hold', criteria: { jointTargets: { cervical_lateral_flexion: 30 }, alignmentChecks: ['shoulder_relaxed'] }, durationSeconds: 20 },
    { name: 'release', criteria: { jointTargets: { cervical_lateral_flexion: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'shoulder_hiking',
      name: 'Shoulder Hiking Up',
      description: 'The shoulder on the stretching side elevates toward the ear',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'shoulder_relaxed', operator: 'gt', value: 10 }],
      userMessage: 'Keep your shoulder relaxed and down',
      trainerNote: 'Common compensation that reduces the stretch and creates tension.',
      affectedLandmarks: [11, 12],
    },
  ],
  coachingCues: [
    'Gently guide your ear toward your shoulder, not your shoulder to your ear',
    'Keep the opposite shoulder relaxed and down',
    'You can use your hand to gently add pressure',
    'Breathe slowly and feel the stretch on the side of your neck',
  ],
};

export const sideBend: PoseDefinition = {
  id: 'stretch_side_bend',
  name: 'Side Bend',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'Standing, raise one arm overhead and lean to the opposite side. Stretches the obliques and lats.',
  contraindications: ['rib injury', 'lower back injury'],
  jointTargets: [
    { jointName: 'lateral_flexion_trunk', idealAngleDegrees: 20, toleranceDegrees: 10, critical: false, weight: 0.35 },
    { jointName: 'trunk_rotation', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'shoulder_flexion_overhead', idealAngleDegrees: 180, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'cervical_alignment', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.15 },
  ],
  alignmentChecks: [
    { checkName: 'no_forward_back_lean', description: 'Lean should be perfectly lateral, not forward or back', thresholdDegrees: 5, critical: true },
    { checkName: 'hips_stable', description: 'Hips should not shift laterally', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { lateral_flexion_trunk: 10 }, alignmentChecks: ['no_forward_back_lean'] } },
    { name: 'hold', criteria: { jointTargets: { lateral_flexion_trunk: 20 }, alignmentChecks: ['no_forward_back_lean'] }, durationSeconds: 20 },
    { name: 'release', criteria: { jointTargets: { lateral_flexion_trunk: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'forward_lean',
      name: 'Leaning Forward',
      description: 'Body leans forward instead of bending purely to the side',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'no_forward_back_lean', operator: 'gt', value: 5 }],
      userMessage: 'Bend directly to the side, like a palm tree in the wind',
      trainerNote: 'Forward lean indicates compensation — think of sliding your hand down your leg',
      affectedLandmarks: [0, 11, 12, 23, 24],
    },
  ],
  coachingCues: [
    'Reach your overhead arm toward the ceiling, then lean',
    'Keep your hips facing forward',
    'Imagine you are between two panes of glass',
    'Breathe into the lifted side of your ribs',
  ],
};

export const seatedSpinalTwist: PoseDefinition = {
  id: 'stretch_seated_spinal_twist',
  name: 'Seated Spinal Twist',
  category: 'stretching',
  difficulty: 'intermediate',
  description: 'Seated with one leg crossed over the other, twist the torso toward the bent knee.',
  contraindications: ['herniated disc', 'spinal fracture', 'severe scoliosis'],
  jointTargets: [
    { jointName: 'thoracic_rotation', idealAngleDegrees: 45, toleranceDegrees: 15, critical: false, weight: 0.35 },
    { jointName: 'cervical_rotation', idealAngleDegrees: 45, toleranceDegrees: 15, critical: false, weight: 0.15 },
    { jointName: 'hip_flexion', idealAngleDegrees: 90, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'pelvis_stability', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.3 },
  ],
  alignmentChecks: [
    { checkName: 'pelvis_square', description: 'Pelvis should remain stable, not rocking', thresholdDegrees: 5, critical: true },
    { checkName: 'spine_tall', description: 'Spine should lengthen before twisting', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { hip_flexion: 90 }, alignmentChecks: ['pelvis_square'] } },
    { name: 'hold', criteria: { jointTargets: { thoracic_rotation: 45 }, alignmentChecks: ['pelvis_square'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { thoracic_rotation: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'pelvis_rocking',
      name: 'Pelvis Rocking',
      description: 'The pelvis rocks as the twist intensifies',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'pelvis_square', operator: 'gt', value: 5 }],
      userMessage: 'Keep both sitting bones rooted to the floor',
      trainerNote: 'Losing pelvic stability shifts the rotation to the lumbar spine',
      affectedLandmarks: [23, 24],
    },
  ],
  coachingCues: [
    'Lengthen your spine before you twist',
    'Imagine a spiral from the base of your spine to the crown',
    'Use your hand on your knee to gently deepen the twist',
    'Keep both sitting bones grounded',
  ],
};

export const pigeonPrep: PoseDefinition = {
  id: 'stretch_pigeon_prep',
  name: 'Pigeon Pose Prep',
  category: 'stretching',
  difficulty: 'intermediate',
  description: 'On hands and knees, bring one knee forward toward the same wrist and extend the other leg back. Opens hips.',
  contraindications: ['knee injury', 'hip labral tear'],
  jointTargets: [
    { jointName: 'front_hip_external_rotation', idealAngleDegrees: 45, toleranceDegrees: 15, critical: false, weight: 0.25 },
    { jointName: 'back_hip_extension', idealAngleDegrees: 180, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 10, critical: true, weight: 0.35 },
    { jointName: 'pelvis_level', idealAngleDegrees: 0, toleranceDegrees: 8, critical: true, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'hips_square_forward', description: 'Hips should face forward as much as possible', thresholdDegrees: 15, critical: true },
    { checkName: 'front_shin_angle', description: 'Front shin should be at a comfortable angle, not forced', thresholdDegrees: 15, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { front_hip_external_rotation: 30 }, alignmentChecks: ['hips_square_forward'] } },
    { name: 'hold', criteria: { jointTargets: { front_hip_external_rotation: 45 }, alignmentChecks: ['hips_square_forward'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { front_hip_external_rotation: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'hip_collapse',
      name: 'Back Hip Collapsing',
      description: 'Back leg hip drops toward the floor',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'hips_square_forward', operator: 'gt', value: 15 }],
      userMessage: 'Keep your back hip lifted and square',
      trainerNote: 'Collapsing indicates inadequate hip mobility — use a block under the sit bone',
      affectedLandmarks: [23, 24],
    },
  ],
  coachingCues: [
    'Flex your back foot to protect the knee',
    'Keep your front shin as parallel to the front of your mat as comfortable',
    'Use a blanket or block under your front hip if needed',
    'Walk your hands forward to deepen the stretch',
  ],
};

export const calfStretch: PoseDefinition = {
  id: 'stretch_calf',
  name: 'Calf Stretch',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'Standing, place one foot behind with the knee straight and heel on the floor. Stretches gastrocnemius.',
  contraindications: ['achilles tendonitis (acute)', 'calf strain (acute)'],
  jointTargets: [
    { jointName: 'back_knee_extension', idealAngleDegrees: 180, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'back_ankle_dorsiflexion', idealAngleDegrees: 20, toleranceDegrees: 10, critical: false, weight: 0.3 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.2 },
    { jointName: 'back_heel_contact', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'knee_straight', description: 'Back knee must remain straight', thresholdDegrees: 5, critical: true },
    { checkName: 'heel_down', description: 'Back heel must stay on the floor', thresholdDegrees: 5, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { back_ankle_dorsiflexion: 10 }, alignmentChecks: ['knee_straight', 'heel_down'] } },
    { name: 'hold', criteria: { jointTargets: { back_ankle_dorsiflexion: 20 }, alignmentChecks: ['knee_straight', 'heel_down'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { back_ankle_dorsiflexion: 0 }, alignmentChecks: ['heel_down'] } },
  ],
  mistakePatterns: [
    {
      code: 'knee_bending',
      name: 'Back Knee Bending',
      description: 'The back knee bends, reducing the calf stretch',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'knee_straight', operator: 'gt', value: 5 }],
      userMessage: 'Keep your back leg completely straight',
      trainerNote: 'Bending the knee shifts the stretch from gastrocnemius to soleus',
      affectedLandmarks: [25, 26, 27, 28],
    },
  ],
  coachingCues: [
    'Keep your back heel rooted to the floor',
    'Straighten your back leg completely',
    'Shift your weight onto the front leg',
    'To vary the stretch, slightly bend the back knee for soleus',
  ],
};

export const itBandStretch: PoseDefinition = {
  id: 'stretch_it_band',
  name: 'IT Band Stretch',
  category: 'stretching',
  difficulty: 'intermediate',
  description: 'Standing, cross one leg behind the other and lean to the side. Stretches the IT band and TFL.',
  contraindications: ['hip bursitis (acute)', 'knee pain (acute)'],
  jointTargets: [
    { jointName: 'lateral_flexion_trunk', idealAngleDegrees: 15, toleranceDegrees: 10, critical: false, weight: 0.25 },
    { jointName: 'back_hip_adduction', idealAngleDegrees: 15, toleranceDegrees: 10, critical: false, weight: 0.3 },
    { jointName: 'standing_knee_extension', idealAngleDegrees: 180, toleranceDegrees: 5, critical: true, weight: 0.25 },
    { jointName: 'pelvis_level', idealAngleDegrees: 0, toleranceDegrees: 5, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'knee_straight_standing', description: 'Standing leg should remain straight', thresholdDegrees: 5, critical: true },
    { checkName: 'feet_anchored', description: 'Feet should stay planted', thresholdDegrees: 5, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { back_hip_adduction: 5 }, alignmentChecks: ['knee_straight_standing'] } },
    { name: 'hold', criteria: { jointTargets: { lateral_flexion_trunk: 15, back_hip_adduction: 15 }, alignmentChecks: ['knee_straight_standing'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { back_hip_adduction: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'knee_bending',
      name: 'Standing Knee Bending',
      description: 'The standing leg bends at the knee',
      severity: 'low',
      conditions: [{ type: 'alignment', checkName: 'knee_straight_standing', operator: 'gt', value: 5 }],
      userMessage: 'Keep your standing leg straight',
      trainerNote: 'Bending the knee reduces the lateral stretch on the IT band',
      affectedLandmarks: [25, 26],
    },
  ],
  coachingCues: [
    'Cross your back leg behind the standing leg',
    'Reach your arm on the same side overhead',
    'Lean away from the crossed leg',
    'Keep both feet flat on the floor',
  ],
};

export const wristFlexorStretch: PoseDefinition = {
  id: 'stretch_wrist_flexor',
  name: 'Wrist Flexor Stretch',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'Extend one arm forward with palm up, gently pull the fingers back with the other hand.',
  contraindications: ['wrist fracture', 'carpal tunnel syndrome (acute)'],
  jointTargets: [
    { jointName: 'wrist_extension', idealAngleDegrees: 60, toleranceDegrees: 15, critical: false, weight: 0.5 },
    { jointName: 'elbow_extension', idealAngleDegrees: 180, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'shoulder_elevation', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'arm_straight', description: 'Stretching arm should be fully extended', thresholdDegrees: 5, critical: true },
    { checkName: 'shoulder_down', description: 'Shoulder should remain relaxed, not shrugged', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { wrist_extension: 30 }, alignmentChecks: ['arm_straight'] } },
    { name: 'hold', criteria: { jointTargets: { wrist_extension: 60 }, alignmentChecks: ['arm_straight'] }, durationSeconds: 20 },
    { name: 'release', criteria: { jointTargets: { wrist_extension: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'elbow_bending',
      name: 'Elbow Bending',
      description: 'The stretching arm bends at the elbow',
      severity: 'low',
      conditions: [{ type: 'alignment', checkName: 'arm_straight', operator: 'gt', value: 5 }],
      userMessage: 'Keep your arm straight',
      trainerNote: 'Bending the elbow reduces the stretch on the wrist flexors',
      affectedLandmarks: [13, 14, 15, 16],
    },
  ],
  coachingCues: [
    'Keep your arm straight but not locked',
    'Use your other hand to gently pull your fingers back',
    'Feel the stretch along your forearm',
    'Switch hands and repeat',
  ],
};

export const lungeHipFlexor: PoseDefinition = {
  id: 'stretch_lunge_hip_flexor',
  name: 'Lunge Hip Flexor Stretch',
  category: 'stretching',
  difficulty: 'beginner',
  description: 'In a deep lunge with back knee down, shift weight forward to stretch the hip flexor.',
  contraindications: ['knee pain', 'hip impingement'],
  jointTargets: [
    { jointName: 'back_hip_extension', idealAngleDegrees: 15, toleranceDegrees: 10, critical: false, weight: 0.3 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 8, critical: true, weight: 0.25 },
    { jointName: 'front_knee_flexion', idealAngleDegrees: 90, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'pelvic_posterior_tilt', idealAngleDegrees: 5, toleranceDegrees: 5, critical: false, weight: 0.25 },
  ],
  alignmentChecks: [
    { checkName: 'torso_upright', description: 'Torso should remain upright', thresholdDegrees: 8, critical: true },
    { checkName: 'front_knee_aligned', description: 'Front knee should track over the foot', thresholdDegrees: 10, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { back_hip_extension: 5 }, alignmentChecks: ['torso_upright'] } },
    { name: 'hold', criteria: { jointTargets: { back_hip_extension: 15 }, alignmentChecks: ['torso_upright', 'front_knee_aligned'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { back_hip_extension: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'front_knee_past_toe',
      name: 'Front Knee Past Toe',
      description: 'Front knee extends beyond the ankle',
      severity: 'high',
      conditions: [{ type: 'alignment', checkName: 'front_knee_aligned', operator: 'gt', value: 10 }],
      userMessage: 'Keep your front knee above your ankle',
      trainerNote: 'Knee stress — slide the front foot forward',
      affectedLandmarks: [23, 25, 27],
    },
  ],
  coachingCues: [
    'Keep your back knee padded on the floor',
    'Tuck your tailbone under to increase the stretch',
    'Lift your chest and engage your core',
    'Breathe into the front of your back hip',
  ],
};
