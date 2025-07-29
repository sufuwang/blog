'use client'
import { useEffect } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'

export default function AMapView() {
  useEffect(() => {
    AMapLoader.load({
      key: process.env.GaoDeMapKey || localStorage.getItem('GaoDeMapKey') || '',
      version: '2.0',
      plugins: ['AMap.Scale'],
    })
      .then((AMap) => {
        const map = new AMap.Map('map', {
          viewMode: '2D',
          zoom: 5.1,
          center: [106, 38],
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  return <div id="map" className="h-[100vh] w-[100vw]" />
}
