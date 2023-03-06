export interface filtrosAgregados {
  pagado?: {
    $in: string[]
  }
  ,
  tipoventa?: {
    $in: string[]
  },
  fecha?: RangoFechas,
  estado?:{
    $in:string[]
  }

}
export interface RangoFechas {
  $gte: string,
  $lte: string
}
export interface dataset {
  fecha:string
  ventaweb: number[],
  ventagenerada: number[]
}
