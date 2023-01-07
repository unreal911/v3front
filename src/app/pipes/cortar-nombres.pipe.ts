import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cortarNombres'
})
export class CortarNombresPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const [firstName, secondName] = value.split(' ');
    return `${firstName} ${secondName}`;
  }

}
