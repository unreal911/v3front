import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public usuariox: any
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuariox = this.usuarioService.usuario
  }

}
