import { Cities } from './data'

export const getSizeByScreenRatio = (width: number) => {
  const x = Math.max(window.innerWidth / window.innerHeight, 16 / 9)
  return {
    width,
    height: width / x,
  }
}

export const getCities = (citiesNames) => {
  const r = Cities.map((row) => row.split(' '))
    .filter((city) => citiesNames.includes(city[0]))
    .map((row) => ({
      label: row[0],
      adcode: row[1],
      citycode: row[2],
    }))
  if (citiesNames.length !== r.length) {
    const rs = r.map((row) => row.label)
    const d = citiesNames.filter((name) => !rs.includes(name))
    console.warn('这些城市未找到: ', d)
  } else {
    console.log('成功渲染城市数量: ', r.length)
  }
  return r
}
