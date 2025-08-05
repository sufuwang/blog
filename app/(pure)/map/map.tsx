'use client'
import { useEffect } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { getCities } from '@/tools/utils'

const Cities = [
  '杨陵区',
  '武功县',
  '西安市',
  '北京市',
  '深圳市',
  '惠州市',
  '苏州市',
  '成都市',
  '德阳市',
  '广元市',
  '广安市',
  '乐山市',
  '雅安市',
  '都江堰市',
  '重庆市',
  '拉萨市',
  '贵阳市',
  '凯里市',
  '宝鸡市',
  '汉中市',
  '海北藏族自治州',
  '海南藏族自治州',
  '中卫市',
  '香港特别行政区',
  '澳门特别行政区',
]

const renderDist = (AMap, map, adcode) => {
  const distProvince = new AMap.DistrictLayer.Province({
    zIndex: 10,
    zooms: [2, 15],
    adcode,
    depth: 2,
  })
  distProvince.setStyles({
    'stroke-width': 1,
    fill: 'yellow',
  })
  map.add(distProvince)
}

const onLoad = async () => {
  const key = process.env.NEXT_PUBLIC_GaoDeMapKey || localStorage.getItem('GaoDeMapKey') || ''
  if (!key) {
    console.warn('高德地图 KEY 未设置')
    return
  }
  const AMap = await AMapLoader.load({
    key,
    version: '2.0',
    plugins: ['AMap.Scale'],
  })

  const getZoomByScreen = () => {
    const width = window.innerWidth
    if (width > 1920) return 5.1
    if (width > 1280) return 4.4
    return 3.2
  }
  const map = new AMap.Map('map', {
    viewMode: '2D',
    zoom: getZoomByScreen(),
    center: [104.4, 38],
  })

  getCities(Cities).forEach((city) => {
    renderDist(AMap, map, city.adcode)
  })
}

export default function AMapView() {
  useEffect(() => {
    onLoad()
  }, [])

  return <div id="map" className="h-[100vh] w-[100vw]" />
}
