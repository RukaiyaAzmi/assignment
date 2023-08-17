// export function getScode(score: number) {
//   if (score >= 14) return 'High'
//   else return 'Low'
// }
export function measureRisk(score: number) {
  if (score < 15) {
    return 'REGULAR'
  } else if (score >= 15) {
    return 'HIGH'
  } else return ''
}
