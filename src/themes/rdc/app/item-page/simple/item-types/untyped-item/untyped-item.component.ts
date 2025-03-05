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
  styleUrls: ['./untyped-item.component.scss'],
  // styleUrls: ['../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  // templateUrl: '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends BaseComponent {

  expanded: boolean = false;

  getAbstractLabel(dso: DSpaceObject): string {
    return this.isResearchProject(dso)
      ? 'item.page.abstract-or-project-summary'
      : 'item.page.abstract';
  }

  getDatasets(dso: DSpaceObject): { title: string, link: string }[] {
    const datasets = [];

    const titles = dso?.metadata?.['dc.title.dataset'];
    const links = dso?.metadata?.['dc.relation.hasDataset'];

    if (titles.length !== links.length) {
      console.error('Found mismatch in virtualized dataset metadata');
      return datasets;
    }

    for (let i = 0; i < titles.length; i++) {
      datasets.push({
        title: titles[i].value,
        link: links[i].value
      });
    }

    return datasets;
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  hasAbstract(dso: DSpaceObject): boolean {
    return dso?.metadata?.abstract?.length > 0;
  }

  hasAssociatedPublicationURI(dso: DSpaceObject): boolean {
    return (this.isResearchProject(dso) || this.isDataset(dso))
      && dso?.metadata?.['dc.relation.associatedPublicationURI']?.length > 0
  }

  hasDatasets(dso: DSpaceObject): boolean {
    return this.isResearchProject(dso) && dso?.metadata?.['dc.title.dataset']?.length > 0
      && dso?.metadata?.['dc.relation.hasDataset']?.length > 0;
  }

  hasProject(dso: DSpaceObject): boolean {
    return this.isDataset(dso) && dso?.metadata?.['dc.title.project']?.length > 0
      && dso?.metadata?.['dc.relation.sourceResearchProject']?.length > 0;
  }

  hasCoPrincipalInvestigator(dso: DSpaceObject): boolean {
    return (this.isResearchProject(dso) || this.isDataset(dso))
      && dso?.metadata?.['dc.creator.copi']?.length > 0
  }

  private isResearchProject(dso: DSpaceObject): boolean {
    return dso?.getRenderTypes()
      .filter((type) => typeof type === 'string')
      .some((type: string) => 'ResearchProject' === type);
  }

  private isDataset(dso: DSpaceObject): boolean {
    return dso?.getRenderTypes()
      .filter((type) => typeof type === 'string')
      .some((type: string) => 'Dataset' === type);
  }

}
