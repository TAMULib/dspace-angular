import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatestWith, filter, map, Observable, of, switchMap } from 'rxjs';

import { getCollectionPageRoute } from '../../../../../app/collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from '../../../../../app/community-page/community-page-routing-paths';
import { BrowseService } from '../../../../../app/core/browse/browse.service';
import { CollectionDataService } from '../../../../../app/core/data/collection-data.service';
import { CommunityDataService } from '../../../../../app/core/data/community-data.service';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model';
import { BrowseDefinition } from '../../../../../app/core/shared/browse-definition.model';
import { Collection } from '../../../../../app/core/shared/collection.model';
import { getFirstCompletedRemoteData } from '../../../../../app/core/shared/operators';
import { ComcolPageBrowseByComponent as BaseComponent } from '../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component';
import { followLink } from '../../../../../app/shared/utils/follow-link-config.model';

const dateissued = 'dateissued';
const author = 'author';
const title = 'title';
const subject = 'subject';
const department = 'department';
const fundingAgency = 'fundingAgency';
const awardNumber = 'awardNumber';
const type = 'type';
const name = 'name';

/**
 * A component to display the "Browse By" section of a Community or Collection page
 * It expects the ID of the Community or Collection as input to be passed on as a scope
 */
@Component({
  selector: 'ds-comcol-page-browse-by',
  // styleUrls: ['./comcol-page-browse-by.component.scss'],
  styleUrls: ['../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.scss'],
  // templateUrl: './comcol-page-browse-by.component.html'
  templateUrl: '../../../../../app/shared/comcol/comcol-page-browse-by/comcol-page-browse-by.component.html'
})
export class ComcolPageBrowseByComponent extends BaseComponent {

  readonly browseByMap = {
    'All': [dateissued, author, title, subject, department, fundingAgency, awardNumber, type],
    'Dataset': [dateissued, author, title, subject, department],
    'PDAC': [dateissued, department, name],
    'ResearchProject': [dateissued, author, title, subject, department, fundingAgency, awardNumber],
  };

  constructor(
    readonly _route: ActivatedRoute,
    readonly _router: Router,
    readonly _browseService: BrowseService,
    readonly _communityService: CommunityDataService,
    readonly _collectionService: CollectionDataService,
  ) {
    super(_route, _router, _browseService);
  }

  ngOnInit(): void {
    let dsoObs: Observable<Collection[]>;
    switch (this.contentType) {
      case 'community':
        dsoObs = this._communityService.findById(this.id, true, false, followLink('collections'))
          .pipe(
            map((dso) => dso?.payload),
            filter((dso) => (dso as any)?.collections),
            switchMap((dso) => (dso as any).collections
              .pipe(map((collections: any) => collections?.payload?.page || [])))) as Observable<Collection[]>;
        break;
      case 'collection':
        dsoObs = this._collectionService.findById(this.id, true, false)
          .pipe(map((dso) => [dso?.payload]));
        break;
      default:
        dsoObs = of();
    }

    this._browseService.getBrowseDefinitions()
      .pipe(
        getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>(),
        combineLatestWith(dsoObs),
      ).subscribe(([browseDefListRD, collections]) => {

        const browseByOptions = this.getBrowseByOptionsForCollections(collections);

        if (browseDefListRD.hasSucceeded) {
          this.allOptions = browseDefListRD.payload.page
            .filter((config: BrowseDefinition) => browseByOptions.indexOf(config.id) >= 0)
            .map((config: BrowseDefinition) => ({
              id: config.id,
              label: `browse.comcol.by.${config.id}`,
              routerLink: `/browse/${config.id}`,
              params: { scope: this.id }
            }));

          if (this.contentType === 'collection') {
            this.allOptions = [{
              id: this.id,
              label: 'collection.page.browse.recent.head',
              routerLink: getCollectionPageRoute(this.id)
            }, ...this.allOptions];
          } else if (this.contentType === 'community') {
            this.allOptions = [{
              id: this.id,
              label: 'community.all-lists.head',
              routerLink: getCommunityPageRoute(this.id)
            }, ...this.allOptions];
          }
        }
      });

    this.currentOptionId$ = this._route.params.pipe(
      map((params: Params) => params.id)
    );
  }

  getBrowseByOptionsForCollections(collections: Collection[] = []): any[] {
    const uniqueBrowseByOptions = new Set();

    collections.forEach(collection => {
      const entityType = collection?.metadata?.['dspace.entity.type']?.[0]?.value;

      if (entityType && this.browseByMap[entityType]) {
        this.browseByMap[entityType].forEach(option => {
          uniqueBrowseByOptions.add(option);
        });
      } else {
        this.browseByMap['All'].forEach(option => {
          uniqueBrowseByOptions.add(option);
        });
      }
    });

    return Array.from(uniqueBrowseByOptions);
  }

}
