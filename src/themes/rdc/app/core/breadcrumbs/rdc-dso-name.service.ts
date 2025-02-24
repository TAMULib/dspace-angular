import { Injectable } from '@angular/core';
import { DSpaceObject } from '../../../../../app/core/shared/dspace-object.model';

import { TranslateService } from '@ngx-translate/core';
import {
  DSONameService
} from '../../../../../app/core/breadcrumbs/dso-name.service';
import { isNotEmpty } from '../../../../../app/shared/empty.util';

@Injectable()
export class RdcDSONameService extends DSONameService {

  readonly translate: TranslateService;

  constructor(translateService: TranslateService) {
    super(translateService);
    this.translate = translateService;
  }

  getName(dso: DSpaceObject | undefined): string {
    if (this.isDataset(dso)) {
      const dataset = dso.firstMetadataValue('dc.title.dataset');
      const project = dso.firstMetadataValue('dc.title.project');

      if (isNotEmpty(dataset) && isNotEmpty(project)) {
        return this.translate.instant('dataset.supplement.to', {
          dataset, project
        });
      } else if (isNotEmpty(dataset)) {
        return dataset;
      }
    }

    return super.getName(dso);
  }

  getHitHighlights(object: any, dso: DSpaceObject): string {
    if (this.isDataset(dso)) {
      const dataset = dso.firstMetadataValue('dc.title.dataset');

      if (isNotEmpty(dataset)) {
        return dataset;
      }
    }

    return super.getHitHighlights(object, dso);
  }

  private isDataset(dso: DSpaceObject): boolean {
    return dso?.getRenderTypes()
      .filter((type) => typeof type === 'string')
      .some((type: string) => 'Dataset' === type);
  }

}
