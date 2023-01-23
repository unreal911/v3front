import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { jsPDF } from "jspdf";
declare function printArea(): any
declare var $: any
@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {
  public id: any
  public pedido: any
  public detallePedido: any[] = []
  public importeTotal: number = 0
  @ViewChild('verPdf') verPdf: ElementRef = {} as ElementRef
  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidosService
  ) {
    this.pedido = {};
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!this.id) {
        return;
      }
      //aca va las consultas

    });
  }
  downloadPDF() {
    const data = this.verPdf.nativeElement
    let pdf = new jsPDF('p', 'pt', 'a4');


  }
  ngOnInit(): void {

    this.cargarpedido()
    this.cargarDetallePedido()
    printArea()
  }
  cargarpedido() {
    this.pedidoService.PedidoID(this.id).subscribe({
      next: (r: any) => {
        console.log(r)
        this.pedido = r.pedido
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
  cargarDetallePedido() {
    this.pedidoService.listarDetallePorPedido(this.id, 0, 100).subscribe({
      next: (r: any) => {
        console.log(r)
        this.detallePedido = r.DetallePedidos
        this.importeTotal = this.detallePedido.reduce((acc, obj) => acc + obj.subtotal, 0);
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
  lanzarPrint() {

    $("#print").click(function () {
      var mode = 'iframe'; //popup
      var close = mode == "popup";
      var options = {
        mode: mode,
        popClose: close
      };
      $("div.printableArea").printArea(options);
    });
  }

}
