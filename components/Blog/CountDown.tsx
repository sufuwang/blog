'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

const calc = () => {
  const work = dayjs().diff(dayjs('2021.7.1'), 'days')
  const birthday = dayjs().diff(dayjs('1995.8.18'), 'days')
  return [
    `已生活 ${Math.floor(birthday / 365)} 年 ${Math.floor(birthday % 365)} 天`,
    `已工作 ${Math.floor(work / 365)} 年 ${Math.floor(work % 365)} 天`,
  ]
}

const CountDown = () => {
  const [str, setStr] = useState(calc())

  useEffect(() => {
    const interval = setInterval(
      () => {
        setStr(calc())
      },
      1000 * 60 * 5
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex w-full flex-wrap">
      {str.map((row, key) => (
        <span key={key} className="mr-2">
          {row}
        </span>
      ))}
    </div>
  )
}

export default CountDown
