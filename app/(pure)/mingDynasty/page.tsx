'use client'
import React, { useEffect, useState } from 'react'
import { Timeline, Tag as _Tag, FloatButton, Collapse } from 'antd'
import { Emperors } from './data'
import styles from './styles.module.scss'

const Tag = (props) => {
  if (props.pure) {
    return (
      <_Tag className="!whitespace-pre-wrap !text-[14px]" bordered={false} color={props.color}>
        {props.children}
      </_Tag>
    )
  }
  return (
    <div className={`${props.className} inline-block`} onClick={props.onClick} aria-hidden="true">
      {props.children}
    </div>
  )
}

export default function Ming() {
  const [cur, setCur] = useState<(typeof Emperors)[number] | Record<string, string>>({})
  const [detail, setDetail] = useState([])

  const onClickCatalog = (emperor) => {
    setCur(emperor)
    setDetail(
      emperor.heroes.map((hero, key) => ({
        key,
        label: hero.name,
        children: (
          <>
            {hero.deed}
            {hero.death}
          </>
        ),
      }))
    )
  }

  useEffect(() => {
    onClickCatalog(Emperors[0])
  }, [])

  const catalog = Emperors.map((row) => [
    {
      color: cur.era === row.era ? 'red' : 'green',
      label: (
        <div className="cursor-pointer" onClick={() => onClickCatalog(row)} aria-hidden="true">
          <Tag pure>{row.date}</Tag>
          <Tag color="red" pure={cur.era === row.era}>
            {row.era}
            &nbsp;
            {row.title}
            &nbsp;
            {row.name}
          </Tag>
        </div>
      ),
      children: (
        <Tag
          className="cursor-pointer"
          color="red"
          pure={cur.era === row.era}
          onClick={() => onClickCatalog(row)}
        >
          {row.content}
          {row.trait}
        </Tag>
      ),
    },
    ...row.heroes.map((hero) => ({
      color: 'gray',
      label: hero.name,
      children: (
        <div>
          {hero.deed}
          {hero.death}
        </div>
      ),
    })),
  ]).flat(2)
  return (
    <>
      <div className="my-4 flex flex-row">
        <Timeline className={`${styles.timeline} !mt-1 w-1/2`} mode="left" items={catalog} />
        <Collapse
          className="fixed right-4 h-fit w-[calc(54%_-_20px)]"
          items={detail}
          defaultActiveKey={['0']}
        />
      </div>
      <FloatButton.BackTop className="!bottom-[24px] left-[24px]" type="primary" shape="square" />
    </>
  )
}
