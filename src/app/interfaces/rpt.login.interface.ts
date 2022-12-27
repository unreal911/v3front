export interface Login {
  ok: boolean;
  msg: string;
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  nombre: string;
  email: string;
  img: Img;
  telefono: string;
  rol: string;
  estado: boolean;
  uid: string;
}

export interface Img {
  secure_url: string;
  public_id: string;
}
