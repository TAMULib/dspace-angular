import { DSpaceObject } from '../../../../../app/core/shared/dspace-object.model';
import { Injectable } from '@angular/core';

import { isNotEmpty } from '../../../../../app/shared/empty.util';
import {
  DSONameService
} from '../../../../../app/core/breadcrumbs/dso-name.service';

@Injectable()
export class RdcDSONameService extends DSONameService {

  getName(dso: DSpaceObject | undefined): string {
    if (this.isDataset(dso)) {
      const dataset = dso.firstMetadataValue('dc.title.dataset');
      const project = dso.firstMetadataValue('dc.title.project');

      if (isNotEmpty(dataset) && isNotEmpty(project)) {
        return `${dataset}: Supplement to ${project}`;
      } else if (isNotEmpty(dataset)) {
        return dataset;
      }
    }

    return super.getName(dso);
  }

  private isDataset(dso: DSpaceObject): boolean {
    return dso.getRenderTypes()
      .filter((type) => typeof type === 'string')
      .some((type: string) => 'Dataset' === type);
  }

}
