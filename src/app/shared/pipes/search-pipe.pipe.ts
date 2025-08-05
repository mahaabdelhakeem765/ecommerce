import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipePipe implements PipeTransform {

  transform(productsData: any[] , titleProductSearch: any): any {
    return productsData.filter((product)=>product.title.includes(titleProductSearch));
  }

}
