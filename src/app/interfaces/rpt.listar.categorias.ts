export interface listarCategoria {
  total:      number;
  categorias: Categoria[];
}

export interface Categoria {
  _id:     string;
  nombre:  string;
  estado:  boolean;
  usuario: string;
}
