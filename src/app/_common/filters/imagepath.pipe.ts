import { Pipe, PipeTransform } from '@angular/core';
import { ApiConstants } from '../../_common/constants/api';

@Pipe({ name: 'imagepath' })
export class ImagePathPipe implements PipeTransform {
  transform(value: string, args: string[]): any {
    if (!value) return value;
    return '"' + ApiConstants.webURL + '/' + value + '"';
  }
}
