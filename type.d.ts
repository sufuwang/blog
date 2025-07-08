declare namespace Scene {
  type Mesh = import('three').Mesh & { _id: string }

  type Position = Record<'x' | 'y' | 'z', number>
}
