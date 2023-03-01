import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

import { getRelativePosition } from 'chart.js/helpers';
import { dataset } from 'src/app/interfaces/filtro';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  public chart: any;
  public fecha: Date = new Date();
  public diasSemana: string[] = [];
  public dias: string[] = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ];
  public formatoSubmit: string[] = [];
  public initDia: string = '';
  public finDia: string = '';
  public resultados: any[] = [];
  public infoTransformada: any[] = [];
  public ventagenerada: any[] = [];
  public ventaweb: any[] = [];
  public usuarios: any[] = [];
  public diahoy: number = 0;
  public ventashoy: number = 0;
  public ventasweb: number = 0;
  public ventastienda: number = 0;
  public usuariosventas:any[]=[]
  constructor(
    private busquedaService: BusquedaService,
    private usuarioService: UsuarioService
  ) {
    window.addEventListener('resize', () => {
      this.updateChartSize();
    });
  }
  ngOnInit(): void {
    //  console.log(this.diasSemana.getDay())
    this.obtenerfechaActual();
    this.listarUsuarios()
  }
  listarUsuarios() {
    this.busquedaService.getusuariosVentas().subscribe({
      next:(r:any)=>{
        this.usuariosventas=r.usuariosConPedidos
        console.log(r)
      },
      error:(e)=>{console.log(e)}
    })
  }
  updateChartSize() {
    const chartContainer = document.querySelector('.chart-container');
    const canvas = chartContainer!.querySelector('canvas');
    const containerStyles = window.getComputedStyle(chartContainer!);
    const containerWidth = parseInt(containerStyles.width, 10);
    const containerHeight = parseInt(containerStyles.height, 10);
    canvas!.width = containerWidth;
    canvas!.height = containerHeight;
    this.chart.resize();
  }

  obtenerfechaActual() {
    // Obtener la fecha actual
    let today = new Date();

    // Obtener el número del día de la semana (0 = domingo, 1 = lunes, ...)
    let dayOfWeek = today.getDay();
    // Restar el número de días que han pasado desde el inicio de la semana (por ejemplo, para que el inicio de la semana sea lunes, restamos 1)
    let daysToSubtract = dayOfWeek - 1;
    if (dayOfWeek === 0) {
      daysToSubtract = 6;
    }
    this.diahoy = daysToSubtract;
    let startDate = new Date(today.setDate(today.getDate() - daysToSubtract));
    this.initDia = `${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()}`;
    // Generar los días de la semana

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      let dia = currentDate.getDate();
      let mes = currentDate.getMonth() + 1;
      let diastring = '';
      let messtring = '';
      if (dia < 10) {
        diastring = '0' + dia;
      } else {
        diastring = dia.toString();
      }

      if (mes < 10) {
        messtring = '0' + mes;
      } else {
        messtring = mes.toString();
      }
      let diaFormato = `${currentDate.getFullYear()}-${messtring}-${diastring}`;
      this.diasSemana.push(diaFormato + '/' + this.dias[i]);
      this.formatoSubmit.push(diaFormato);
    }
    this.finDia = this.formatoSubmit[6];
    console.log(`${this.initDia} ${this.finDia}`);
    console.log(this.formatoSubmit);
    this.getSemana();
  }
  getSemana() {
    this.busquedaService
      .getSemana({ fechaInicio: this.initDia, fechaFin: this.finDia })
      .subscribe({
        next: (r: any) => {
          this.resultados = r.resultados;
          let resultadosx: any[] = [];
          this.formatoSubmit.forEach((dia) => {
            let objetoDia = {
              fecha: dia,
              ventas: [
                {
                  tipoventa: 'VentaGenerada',
                  totalPedidos: 0,
                },
                {
                  tipoventa: 'VentaWeb',
                  totalPedidos: 0,
                },
              ],
            };

            let ventaEncontrada = this.resultados.find(
              (venta: any) => venta.fecha == dia
            );

            if (ventaEncontrada) {
              console.log(objetoDia.ventas);
              console.log(ventaEncontrada.ventas);
              objetoDia.ventas = ventaEncontrada.ventas;
              console.log('vneta encontrada');
            }

            resultadosx.push(objetoDia);
          });
          this.infoTransformada = resultadosx.reduce((result, item) => {
            const ventaTotals: { [key: string]: number } = {};
            item.ventas.forEach((venta: any) => {
              ventaTotals[venta.tipoventa] = venta.totalPedidos;
            });
            result.push({
              fecha: item.fecha,
              ventas: ventaTotals,
            });
            return result;
          }, []);
          for (let i = 0; i < this.infoTransformada.length; i++) {
            if (this.infoTransformada[i].ventas.VentaGenerada) {
              this.ventagenerada.push(
                this.infoTransformada[i].ventas.VentaGenerada
              );
            } else {
              this.ventagenerada.push(0);
            }
          }
          for (let i = 0; i < this.infoTransformada.length; i++) {
            if (this.infoTransformada[i].ventas.VentaWeb) {
              this.ventaweb.push(this.infoTransformada[i].ventas.VentaWeb);
            } else {
              this.ventaweb.push(0);
            }
          }
          console.log(this.ventaweb);
          console.log(this.ventagenerada);
          console.log(this.infoTransformada);
          console.log(resultadosx);
          this.createChart();
          this.ventashoy =
            this.ventaweb[this.diahoy] + this.ventagenerada[this.diahoy];
          this.ventasweb = this.ventaweb[this.diahoy];
          this.ventastienda = this.ventagenerada[this.diahoy];
          console.log(this.ventashoy);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
  gets() {}
  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: this.diasSemana,
        datasets: [
          {
            label: 'web',
            data: this.ventaweb,
            backgroundColor: '#06d79c',
          },
          {
            label: 'generada',
            data: this.ventagenerada,
            backgroundColor: '#745af2',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
