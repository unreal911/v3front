import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgSlider'
})
export class ImgSliderPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    console.log(value)
    if(value.secure_url){
      return value.secure_url;
    }else{
      return 'https://lyon.palmaresdudroit.fr/images/joomlart/demo/default.jpg'
    }



  }

}
