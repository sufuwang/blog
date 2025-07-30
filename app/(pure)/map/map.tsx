'use client'
import { useEffect } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'

export default function AMapView() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GaoDeMapKey || localStorage.getItem('GaoDeMapKey') || ''
    if (!key) {
      console.warn('高德地图 KEY 未设置')
      return
    }
    AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.Scale'],
    })
      .then((AMap) => {
        const map = new AMap.Map('map', {
          viewMode: '2D',
          zoom: 5.1,
          center: [104.4, 38],
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  return <div id="map" className="h-[100vh] w-[100vw]" />
}
