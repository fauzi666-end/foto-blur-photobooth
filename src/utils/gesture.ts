export type Point3D = {
  x: number
  y: number
  z?: number
}

export function distanceBetween(a: Point3D, b: Point3D) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function isFingerExtended(tip: Point3D, pip: Point3D) {
  return tip.y < pip.y
}

export function isTwoFingerPose(landmarks: Point3D[]) {
  if (landmarks.length < 21) {
    return false
  }

  const indexUp = isFingerExtended(landmarks[8], landmarks[6])
  const middleUp = isFingerExtended(landmarks[12], landmarks[10])
  const ringDown = !isFingerExtended(landmarks[16], landmarks[14])
  const pinkyDown = !isFingerExtended(landmarks[20], landmarks[18])

  const fingerGap = distanceBetween(landmarks[8], landmarks[12])
  const palmWidth = distanceBetween(landmarks[5], landmarks[17])

  return indexUp && middleUp && ringDown && pinkyDown && fingerGap > palmWidth * 0.12
}
