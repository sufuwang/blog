export const getSizeByScreenRatio = (width: number) => {
  const x = Math.max(window.innerWidth / window.innerHeight, 16 / 9)
  return {
    width,
    height: width / x,
  }
}
