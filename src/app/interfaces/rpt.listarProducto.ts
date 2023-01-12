export interface ListarProducto {
  total: number;
  productos: Producto[];
}
export interface ProductoID {
  ok: boolean;
  producto: Producto;
}


export interface Producto {
  nombre: string;
  usuario: string;
  precio: number;
  categoria: string;
  descripcion: string;
  img: Img[];
  uid: string;
  disponible: boolean;
}

export interface Img {
  id: string;
  url: string;
  titulo?: string;
}
