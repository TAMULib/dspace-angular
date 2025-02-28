import { Component, Input } from '@angular/core';

import { ItemPageAbstractFieldComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';

@Component({
  selector: 'rdc-ds-item-page-abstract-field',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/item-page-field.component.html'
})
export class RdcItemPageAbstractFieldComponent extends ItemPageAbstractFieldComponent {

  @Input()
  label = 'item.page.abstract';

}
