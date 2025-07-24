import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import { Descriptions, Badge, Collapse, Table, Tag } from 'antd'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import CountDown from './Blog/CountDown'
import GuiControl from './Blog/ThreeJsScene/guiControl'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  Descriptions,
  Badge,
  Collapse,
  Table,
  Tag,
  CountDown,
  GuiControl,
}
