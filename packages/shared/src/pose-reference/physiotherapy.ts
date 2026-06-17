import type { PoseDefinition } from '../types/index.ts';

export const standingHipAbduction: PoseDefinition = {
  id: 'physio_standing_hip_abduction',
  name: 'Standing Hip Abduction',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'Standing upright, lift one leg out to the side while keeping the torso stable. Targets gluteus medius.',
  contraindications: ['hip labral tear', 'severe hip osteoarthritis'],
  jointTargets: [
    { jointName: 'standing_trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 10, critical: true, weight: 0.3 },
    { jointName: 'standing_hip_abduction', idealAngleDegrees: 30, toleranceDegrees: 10, critical: false, weight: 0.3 },
    { jointName: 'standing_leg_knee_extension', idealAngleDegrees: 180, toleranceDegrees: 5, critical: true, weight: 0.2 },
    { jointName: 'pelvic_tilt', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'torso_upright', description: 'Torso should remain vertical, not leaning', thresholdDegrees: 10, critical: true },
    { checkName: 'pelvis_level', description: 'Pelvis should not tilt upward on the lifting side', thresholdDegrees: 8, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { standing_trunk_inclination: 5 }, alignmentChecks: ['torso_upright'] } },
    { name: 'hold', criteria: { jointTargets: { standing_hip_abduction: 30 }, alignmentChecks: ['torso_upright', 'pelvis_level'] }, durationSeconds: 5 },
    { name: 'release', criteria: { jointTargets: { standing_hip_abduction: 0 }, alignmentChecks: ['torso_upright'] } },
  ],
  mistakePatterns: [
    {
      code: 'torso_lean',
      name: 'Torso Leaning',
      description: 'Upper body leans away from the lifting leg',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'torso_upright', operator: 'gt', value: 10 }],
      userMessage: 'Keep your torso upright — do not lean to compensate',
      trainerNote: 'Common compensation for weak glute medius. Reduce range of motion and focus on form.',
      affectedLandmarks: [0, 11, 12, 23, 24],
    },
    {
      code: 'pelvic_rise',
      name: 'Pelvis Tilting',
      description: 'Pelvis hikes up on the working leg side',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'pelvis_level', operator: 'gt', value: 8 }],
      userMessage: 'Keep your pelvis level — lift only as high as you can without tilting',
      trainerNote: 'Indicates quadratus lumborum dominance over glute medius.',
      affectedLandmarks: [23, 24],
    },
  ],
  coachingCues: [
    'Keep your standing leg slightly soft, not locked',
    'Initiate the movement from your glute, not your foot',
    'Maintain a neutral spine throughout',
    'Lower with control — do not drop the leg',
  ],
};

export const clamshell: PoseDefinition = {
  id: 'physio_clamshell',
  name: 'Clamshell Exercise',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'Lie on your side with knees bent at 45°, lift the top knee while keeping feet together. Targets hip external rotators.',
  contraindications: ['acute hip injury', 'recent hip surgery'],
  jointTargets: [
    { jointName: 'hip_flexion_lying', idealAngleDegrees: 45, toleranceDegrees: 10, critical: false, weight: 0.15 },
    { jointName: 'hip_external_rotation', idealAngleDegrees: 30, toleranceDegrees: 10, critical: true, weight: 0.35 },
    { jointName: 'trunk_rotation', idealAngleDegrees: 0, toleranceDegrees: 10, critical: true, weight: 0.3 },
    { jointName: 'knee_flexion_bottom', idealAngleDegrees: 45, toleranceDegrees: 10, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'no_trunk_rotation', description: 'Shoulders and pelvis should not rotate backward', thresholdDegrees: 10, critical: true },
    { checkName: 'feet_together', description: 'Feet should remain in contact throughout', thresholdDegrees: 5, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { hip_flexion_lying: 45 }, alignmentChecks: ['no_trunk_rotation'] } },
    { name: 'hold', criteria: { jointTargets: { hip_external_rotation: 30 }, alignmentChecks: ['no_trunk_rotation'] }, durationSeconds: 3 },
    { name: 'release', criteria: { jointTargets: { hip_external_rotation: 0 }, alignmentChecks: ['no_trunk_rotation'] } },
  ],
  mistakePatterns: [
    {
      code: 'trunk_rock',
      name: 'Trunk Rolling Back',
      description: 'Upper body rolls backward as the knee lifts',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'no_trunk_rotation', operator: 'gt', value: 10 }],
      userMessage: 'Keep your shoulders and hips stacked vertically',
      trainerNote: 'Cannot isolate external rotation — regress to smaller range of motion',
      affectedLandmarks: [11, 12, 23, 24],
    },
  ],
  coachingCues: [
    'Keep your feet glued together throughout',
    'Imagine a string pulling your top kneecap toward the ceiling',
    'Do not let your pelvis rock backward',
    'Pause at the top and squeeze your glutes',
  ],
};

export const birdDog: PoseDefinition = {
  id: 'physio_bird_dog',
  name: 'Bird-Dog',
  category: 'physiotherapy',
  difficulty: 'intermediate',
  description: 'On hands and knees, extend opposite arm and leg simultaneously while keeping the spine stable.',
  contraindications: ['wrist injury', 'shoulder instability', 'herniated disc (acute)'],
  jointTargets: [
    { jointName: 'spine_neutral', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.35 },
    { jointName: 'hip_extension_moving', idealAngleDegrees: 180, toleranceDegrees: 10, critical: false, weight: 0.2 },
    { jointName: 'shoulder_flexion_moving', idealAngleDegrees: 180, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'pelvic_rotation', idealAngleDegrees: 0, toleranceDegrees: 8, critical: true, weight: 0.25 },
  ],
  alignmentChecks: [
    { checkName: 'spine_no_arching', description: 'Lower back should not arch excessively', thresholdDegrees: 5, critical: true },
    { checkName: 'pelvis_no_rotation', description: 'Pelvis should remain square to the floor', thresholdDegrees: 8, critical: true },
    { checkName: 'no_lateral_shift', description: 'Weight should not shift sideways', thresholdDegrees: 5, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { spine_neutral: 5 }, alignmentChecks: ['spine_no_arching'] } },
    { name: 'hold', criteria: { jointTargets: { spine_neutral: 0, hip_extension_moving: 180, shoulder_flexion_moving: 180 }, alignmentChecks: ['spine_no_arching', 'pelvis_no_rotation'] }, durationSeconds: 5 },
    { name: 'release', criteria: { jointTargets: { spine_neutral: 5 }, alignmentChecks: ['spine_no_arching'] } },
  ],
  mistakePatterns: [
    {
      code: 'back_arching',
      name: 'Lower Back Arch',
      description: 'Excessive lordosis in the lower back during limb extension',
      severity: 'high',
      conditions: [{ type: 'alignment', checkName: 'spine_no_arching', operator: 'gt', value: 5 }],
      userMessage: 'Engage your core to prevent your back from arching',
      trainerNote: 'Inadequate core engagement — regress to limb-only extension with core bracing',
      affectedLandmarks: [23, 24, 11, 12],
    },
    {
      code: 'pelvis_rotate',
      name: 'Pelvis Rotation',
      description: 'Pelvis rotates open when extending the leg',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'pelvis_no_rotation', operator: 'gt', value: 8 }],
      userMessage: 'Keep your hips square to the floor',
      trainerNote: 'Inadequate glute activation — cue squeezing glute before lifting',
      affectedLandmarks: [23, 24],
    },
  ],
  coachingCues: [
    'Brace your core as if about to be punched',
    'Reach through your heel, not your toes',
    'Extend to the point where you can still hold a glass of water on your back',
    'Exhale as you extend, inhale as you return',
  ],
};

export const deadBug: PoseDefinition = {
  id: 'physio_dead_bug',
  name: 'Dead Bug',
  category: 'physiotherapy',
  difficulty: 'intermediate',
  description: 'Lie on your back, arms extended toward the ceiling, knees at 90°. Slowly extend opposite arm and leg.',
  contraindications: ['neck injury (acute)', 'severe diastasis recti'],
  jointTargets: [
    { jointName: 'lumbar_contact', idealAngleDegrees: 0, toleranceDegrees: 3, critical: true, weight: 0.35 },
    { jointName: 'hip_flexion', idealAngleDegrees: 90, toleranceDegrees: 10, critical: false, weight: 0.15 },
    { jointName: 'knee_flexion', idealAngleDegrees: 90, toleranceDegrees: 10, critical: false, weight: 0.15 },
    { jointName: 'rib_cage_position', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.35 },
  ],
  alignmentChecks: [
    { checkName: 'low_back_floor', description: 'Lower back must maintain contact with the floor', thresholdDegrees: 3, critical: true },
    { checkName: 'ribs_down', description: 'Rib cage should not flare upward', thresholdDegrees: 5, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { hip_flexion: 90, knee_flexion: 90 }, alignmentChecks: ['low_back_floor'] } },
    { name: 'hold', criteria: { jointTargets: { lumbar_contact: 0 }, alignmentChecks: ['low_back_floor', 'ribs_down'] }, durationSeconds: 3 },
    { name: 'release', criteria: { jointTargets: { hip_flexion: 90 }, alignmentChecks: ['low_back_floor'] } },
  ],
  mistakePatterns: [
    {
      code: 'back_arching_off',
      name: 'Back Lifting Off Floor',
      description: 'Lower back arches away from the floor during limb extension',
      severity: 'high',
      conditions: [{ type: 'alignment', checkName: 'low_back_floor', operator: 'gt', value: 3 }],
      userMessage: 'Press your lower back into the floor',
      trainerNote: 'Core decompensation — reduce range of leg/arm extension',
      affectedLandmarks: [23, 24],
    },
    {
      code: 'rib_flare',
      name: 'Rib Flaring',
      description: 'Rib cage lifts upward during movement',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'ribs_down', operator: 'gt', value: 5 }],
      userMessage: 'Zip your ribs down toward your hips',
      trainerNote: 'Inadequate deep core engagement — cue posterior pelvic tilt',
      affectedLandmarks: [11, 12],
    },
  ],
  coachingCues: [
    'Imagine a heavy weight on your lower back',
    'Move only as far as you can keep your back on the floor',
    'Breathe steadily — do not hold your breath',
    'Control the tempo: 3 seconds out, 3 seconds back',
  ],
};

export const wallSlide: PoseDefinition = {
  id: 'physio_wall_slide',
  name: 'Wall Slide (Shoulder)',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'Stand against a wall, arms at 90° with elbows and wrists touching the wall. Slide arms upward.',
  contraindications: ['acute shoulder impingement', 'rotator cuff tear (acute)'],
  jointTargets: [
    { jointName: 'shoulder_flexion_start', idealAngleDegrees: 90, toleranceDegrees: 10, critical: false, weight: 0.15 },
    { jointName: 'shoulder_flexion_end', idealAngleDegrees: 180, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'lumbar_curve', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'elbow_flexion', idealAngleDegrees: 90, toleranceDegrees: 15, critical: true, weight: 0.2 },
    { jointName: 'wrist_wall_contact', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.15 },
  ],
  alignmentChecks: [
    { checkName: 'back_on_wall', description: 'Lower back, upper back, and head should touch the wall', thresholdDegrees: 5, critical: true },
    { checkName: 'elbows_on_wall', description: 'Elbows and wrists should maintain wall contact', thresholdDegrees: 10, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { shoulder_flexion_start: 90, elbow_flexion: 90 }, alignmentChecks: ['back_on_wall', 'elbows_on_wall'] } },
    { name: 'hold', criteria: { jointTargets: { shoulder_flexion_end: 180 }, alignmentChecks: ['back_on_wall', 'elbows_on_wall'] }, durationSeconds: 5 },
    { name: 'release', criteria: { jointTargets: { shoulder_flexion_start: 90 }, alignmentChecks: ['back_on_wall'] } },
  ],
  mistakePatterns: [
    {
      code: 'back_off_wall',
      name: 'Back Losing Wall Contact',
      description: 'Lower back pulls away from the wall during arm raise',
      severity: 'high',
      conditions: [{ type: 'alignment', checkName: 'back_on_wall', operator: 'gt', value: 5 }],
      userMessage: 'Keep your entire spine in contact with the wall',
      trainerNote: 'Tight lats or poor shoulder mobility — reduce range of motion',
      affectedLandmarks: [0, 11, 12, 23, 24],
    },
  ],
  coachingCues: [
    'Keep your elbows and wrists pressed against the wall',
    'Do not let your ribs flare forward',
    'Slide slowly — think 10 seconds up, 10 seconds down',
    'Only go as high as you can while staying in contact with the wall',
  ],
};

export const chinTuck: PoseDefinition = {
  id: 'physio_chin_tuck',
  name: 'Chin Tuck',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'Sitting or standing, draw your chin straight back as if making a double chin. Hold and release.',
  contraindications: ['acute neck injury', 'cervical spine instability'],
  jointTargets: [
    { jointName: 'cervical_retraction', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.5 },
    { jointName: 'cervical_flexion', idealAngleDegrees: 0, toleranceDegrees: 5, critical: false, weight: 0.3 },
    { jointName: 'shoulder_elevation', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'no_looking_down', description: 'Eyes should stay level, not looking at the floor', thresholdDegrees: 5, critical: true },
    { checkName: 'shoulders_relaxed', description: 'Shoulders should not elevate during the movement', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { cervical_retraction: 10 }, alignmentChecks: ['no_looking_down'] } },
    { name: 'hold', criteria: { jointTargets: { cervical_retraction: 0 }, alignmentChecks: ['no_looking_down'] }, durationSeconds: 5 },
    { name: 'release', criteria: { jointTargets: { cervical_retraction: 10 }, alignmentChecks: ['no_looking_down'] } },
  ],
  mistakePatterns: [
    {
      code: 'looking_down',
      name: 'Chin Tucking Down Instead of Back',
      description: 'Client looks down instead of sliding the head straight back',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'no_looking_down', operator: 'gt', value: 5 }],
      userMessage: 'Slide your head straight back, not down',
      trainerNote: 'Common error — use a finger on the chin to guide horizontal movement',
      affectedLandmarks: [0, 7, 8],
    },
  ],
  coachingCues: [
    'Imagine a string pulling from the base of your skull',
    'Keep your eyes on the horizon',
    'Create a double chin — that means you are doing it right',
    'Hold and feel the stretch at the base of your skull',
  ],
};

export const hipFlexorStretch: PoseDefinition = {
  id: 'physio_hip_flexor_stretch',
  name: 'Hip Flexor Stretch',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'In a lunge position, keep the torso upright and shift weight forward to stretch the back hip flexor.',
  contraindications: ['hip impingement', 'labral tear'],
  jointTargets: [
    { jointName: 'back_hip_extension', idealAngleDegrees: 10, toleranceDegrees: 10, critical: false, weight: 0.3 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'front_knee_flexion', idealAngleDegrees: 90, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'pelvic_tilt', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'torso_upright', description: 'Do not lean forward from the hips', thresholdDegrees: 5, critical: true },
    { checkName: 'front_knee_over_ankle', description: 'Front knee should not go past the ankle', thresholdDegrees: 10, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { back_hip_extension: 5 }, alignmentChecks: ['torso_upright'] } },
    { name: 'hold', criteria: { jointTargets: { back_hip_extension: 10 }, alignmentChecks: ['torso_upright', 'front_knee_over_ankle'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { back_hip_extension: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'leaning_forward',
      name: 'Leaning Forward',
      description: 'Torso leans forward instead of staying upright',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'torso_upright', operator: 'gt', value: 5 }],
      userMessage: 'Keep your chest lifted and shoulders over hips',
      trainerNote: 'Reduces stretch on iliopsoas — cue reaching the crown of the head upward',
      affectedLandmarks: [0, 11, 12, 23, 24],
    },
  ],
  coachingCues: [
    'Tuck your tailbone slightly to increase the stretch',
    'Keep your front knee tracking over the second toe',
    'Engage your glute on the back leg',
    'Breathe into the front of your back hip',
  ],
};

export const hamstringStretch: PoseDefinition = {
  id: 'physio_hamstring_stretch',
  name: 'Hamstring Stretch',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'Standing or seated, extend one leg forward and hinge at the hips to stretch the hamstring.',
  contraindications: ['sciatica (acute)', 'herniated disc (acute)'],
  jointTargets: [
    { jointName: 'hip_flexion', idealAngleDegrees: 80, toleranceDegrees: 15, critical: false, weight: 0.3 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 45, toleranceDegrees: 15, critical: false, weight: 0.2 },
    { jointName: 'knee_extension', idealAngleDegrees: 180, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'spine_neutral', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'knee_straight', description: 'Stretching leg should remain straight', thresholdDegrees: 5, critical: true },
    { checkName: 'hips_square', description: 'Hips should remain level and square', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { hip_flexion: 60 }, alignmentChecks: ['knee_straight'] } },
    { name: 'hold', criteria: { jointTargets: { hip_flexion: 80 }, alignmentChecks: ['knee_straight'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { hip_flexion: 30 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'bent_knee',
      name: 'Bent Stretching Knee',
      description: 'The knee of the stretching leg is bent',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'knee_straight', operator: 'gt', value: 5 }],
      userMessage: 'Keep your stretching leg straight — soften the standing leg',
      trainerNote: 'Bent knee reduces hamstring stretch. Check for excessive tightness.',
      affectedLandmarks: [25, 26, 27, 28],
    },
  ],
  coachingCues: [
    'Hinge at your hips, not your lower back',
    'Keep your chest open',
    'Only go as far as you can with a straight leg',
    'Point your toes toward the ceiling for a deeper stretch',
  ],
};

export const quadStretch: PoseDefinition = {
  id: 'physio_quad_stretch',
  name: 'Quad Stretch',
  category: 'physiotherapy',
  difficulty: 'beginner',
  description: 'Standing, bend one knee and hold the foot toward the glute. Stretches quadriceps.',
  contraindications: ['knee injury', 'balance disorders'],
  jointTargets: [
    { jointName: 'knee_flexion_stretching', idealAngleDegrees: 135, toleranceDegrees: 15, critical: false, weight: 0.3 },
    { jointName: 'standing_leg_straight', idealAngleDegrees: 180, toleranceDegrees: 5, critical: true, weight: 0.2 },
    { jointName: 'trunk_inclination', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.3 },
    { jointName: 'hip_extension_stretching', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.2 },
  ],
  alignmentChecks: [
    { checkName: 'knees_together', description: 'Both knees should stay close together', thresholdDegrees: 10, critical: true },
    { checkName: 'torso_upright', description: 'Torso should remain vertical', thresholdDegrees: 5, critical: true },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { knee_flexion_stretching: 90 }, alignmentChecks: ['knees_together'] } },
    { name: 'hold', criteria: { jointTargets: { knee_flexion_stretching: 135 }, alignmentChecks: ['knees_together', 'torso_upright'] }, durationSeconds: 30 },
    { name: 'release', criteria: { jointTargets: { knee_flexion_stretching: 90 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'knee_splayed',
      name: 'Knee Splaying Out',
      description: 'The bent knee drifts out to the side',
      severity: 'medium',
      conditions: [{ type: 'alignment', checkName: 'knees_together', operator: 'gt', value: 10 }],
      userMessage: 'Keep your knees together — pull your foot toward your glute',
      trainerNote: 'Knee splaying reduces quad stretch and stresses the knee joint',
      affectedLandmarks: [25, 26],
    },
  ],
  coachingCues: [
    'Hold onto a wall or chair for balance',
    'Pull your heel toward your glute, not outward',
    'Tuck your pelvis slightly to increase the stretch',
    'Do not arch your lower back',
  ],
};

export const thoracicExtension: PoseDefinition = {
  id: 'physio_thoracic_extension',
  name: 'Thoracic Extension',
  category: 'physiotherapy',
  difficulty: 'intermediate',
  description: 'Over a foam roller or chair back, extend the upper spine. Improves thoracic mobility.',
  contraindications: ['spinal fracture', 'osteoporosis', 'acute back pain'],
  jointTargets: [
    { jointName: 'thoracic_extension', idealAngleDegrees: 20, toleranceDegrees: 10, critical: false, weight: 0.35 },
    { jointName: 'lumbar_neutral', idealAngleDegrees: 0, toleranceDegrees: 5, critical: true, weight: 0.35 },
    { jointName: 'cervical_neutral', idealAngleDegrees: 0, toleranceDegrees: 10, critical: false, weight: 0.3 },
  ],
  alignmentChecks: [
    { checkName: 'no_lumbar_compensation', description: 'Extension should come from upper back, not lower back', thresholdDegrees: 5, critical: true },
    { checkName: 'neck_relaxed', description: 'Neck should remain long, not crunched', thresholdDegrees: 10, critical: false },
  ],
  phases: [
    { name: 'entry', criteria: { jointTargets: { thoracic_extension: 5 }, alignmentChecks: ['no_lumbar_compensation'] } },
    { name: 'hold', criteria: { jointTargets: { thoracic_extension: 20 }, alignmentChecks: ['no_lumbar_compensation'] }, durationSeconds: 10 },
    { name: 'release', criteria: { jointTargets: { thoracic_extension: 0 }, alignmentChecks: [] } },
  ],
  mistakePatterns: [
    {
      code: 'lumbar_bending',
      name: 'Lower Back Bending',
      description: 'Extension happens from the lower back instead of the upper back',
      severity: 'high',
      conditions: [{ type: 'alignment', checkName: 'no_lumbar_compensation', operator: 'gt', value: 5 }],
      userMessage: 'Focus the movement on your upper back, between your shoulder blades',
      trainerNote: 'Common when thoracic spine is stiff. Place roller higher on the back.',
      affectedLandmarks: [23, 24, 11, 12],
    },
  ],
  coachingCues: [
    'Place the foam roller at the bottom of your shoulder blades',
    'Support your head with your hands',
    'Breathe into the front of your chest',
    'Only extend as far as your upper back allows',
  ],
};
