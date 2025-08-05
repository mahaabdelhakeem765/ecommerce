import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(productsData: any[] , titleProductSearch: string): any {
    return productsData.filter( (product)=>product.title.toLowerCase().includes(titleProductSearch.toLowerCase()) );
  }

}
