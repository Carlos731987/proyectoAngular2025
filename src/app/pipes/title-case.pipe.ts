import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true
})

export class TitleCasePipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) return '';

    return value.toLowerCase().split(' ') // Convertir a minúsculas y dividir por espacios
      .map(word => {
        if (!word) return '';
        // Capitaliza la primera letra y concatena el resto de la palabra
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' '); // Reúne las palabras con espacios
  }
}

