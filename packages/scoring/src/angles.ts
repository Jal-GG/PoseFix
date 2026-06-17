export function computeAngle(
  proximal: { x: number; y: number; z: number },
  vertex: { x: number; y: number; z: number },
  distal: { x: number; y: number; z: number },
): number {
  const v1 = {
    x: proximal.x - vertex.x,
    y: proximal.y - vertex.y,
    z: proximal.z - vertex.z,
  };
  const v2 = {
    x: distal.x - vertex.x,
    y: distal.y - vertex.y,
    z: distal.z - vertex.z,
  };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

export function computeTrunkInclination(
  leftHip: { x: number; y: number; z: number },
  rightHip: { x: number; y: number; z: number },
  leftShoulder: { x: number; y: number; z: number },
  rightShoulder: { x: number; y: number; z: number },
): number {
  const midHip = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
    z: (leftHip.z + rightHip.z) / 2,
  };
  const midShoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
    z: (leftShoulder.z + rightShoulder.z) / 2,
  };
  const vertical: { x: number; y: number; z: number } = { x: 0, y: -1, z: 0 };
  return computeAngle(midHip, midShoulder, {
    x: midShoulder.x + vertical.x,
    y: midShoulder.y + vertical.y,
    z: midShoulder.z + vertical.z,
  });
}

export function computeCervicalAlignment(
  nose: { x: number; y: number; z: number },
  leftShoulder: { x: number; y: number; z: number },
  rightShoulder: { x: number; y: number; z: number },
): number {
  const midShoulder = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
    z: (leftShoulder.z + rightShoulder.z) / 2,
  };
  const vertical: { x: number; y: number; z: number } = { x: 0, y: -1, z: 0 };
  return computeAngle(midShoulder, nose, {
    x: nose.x + vertical.x,
    y: nose.y + vertical.y,
    z: nose.z + vertical.z,
  });
}

export function computeKneeFlexion(
  hip: { x: number; y: number; z: number },
  knee: { x: number; y: number; z: number },
  ankle: { x: number; y: number; z: number },
): number {
  return computeAngle(hip, knee, ankle);
}

export function computeHipFlexion(
  shoulder: { x: number; y: number; z: number },
  hip: { x: number; y: number; z: number },
  knee: { x: number; y: number; z: number },
): number {
  return computeAngle(shoulder, hip, knee);
}

export function computeElbowFlexion(
  shoulder: { x: number; y: number; z: number },
  elbow: { x: number; y: number; z: number },
  wrist: { x: number; y: number; z: number },
): number {
  return computeAngle(shoulder, elbow, wrist);
}

export function computeShoulderFlexion(
  hip: { x: number; y: number; z: number },
  shoulder: { x: number; y: number; z: number },
  elbow: { x: number; y: number; z: number },
): number {
  return computeAngle(hip, shoulder, elbow);
}

export function computeAnkleDorsiflexion(
  knee: { x: number; y: number; z: number },
  ankle: { x: number; y: number; z: number },
  footIndex: { x: number; y: number; z: number },
): number {
  return computeAngle(knee, ankle, footIndex);
}
