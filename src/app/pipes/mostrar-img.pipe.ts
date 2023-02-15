import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mostrarImg'
})
export class MostrarImgPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    console.log(value)
    if (value == undefined) {
      return 'https://eciglogistica.com/upload/store/xnicochots60.jpg.pagespeed.ic.FWvDWr0_SD.webp'
    }
    if (!value.url) {
      return 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
    }
    if (value.secure_url) {
      return value.secure_url
    }
    return value.url;
  }

}
