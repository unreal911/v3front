export interface filtrosAgregados {
  pagado?: {
    $in: string[]
  }
  ,
  tipoventa?: {
    $in: string[]
  },
  fecha?: RangoFechas
}
export interface RangoFechas {
  $gte: string,
  $lte: string
}
