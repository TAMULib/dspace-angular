import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Context } from '../../../../../../../app/core/shared/context.model';
import { DSpaceObject } from '../../../../../../../app/core/shared/dspace-object.model';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import {
  UntypedItemComponent as BaseComponent
} from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import {
  listableObjectComponent
} from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';

/**
 * Component that represents an untyped Item page
 */
@listableObjectComponent(Item, ViewMode.StandalonePage, Context.Any, 'rdc')
@Component({
  selector: 'ds-untyped-item',
  // styleUrls: ['./untyped-item.component.scss'],
  styleUrls: ['../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  // templateUrl: '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends BaseComponent {

  getAbstractLabel(dso: DSpaceObject): string {
    return this.isResearchProject(dso)
      ? 'item.page.abstract-or-project-summary'
      : 'item.page.abstract';
  }

  private isResearchProject(dso: DSpaceObject): boolean {
    return dso?.getRenderTypes()
      .filter((type) => typeof type === 'string')
      .some((type: string) => 'ResearchProject' === type);
  }

}
