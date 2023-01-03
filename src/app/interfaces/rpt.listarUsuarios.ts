export interface ListarUsuarios {
  total:    number;
  usuarios: Usuario[];
}

export interface Usuario {
  nombre:   string;
  email:    string;
  img:      Img;
  telefono: string;
  rol:      string;
  estado:   boolean;
  uid:      string;
}

export interface Img {
  secure_url?: string;
  public_id?:  string;
  id?:         string;
  url?:        string;
}
