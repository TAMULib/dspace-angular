import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { BehaviorSubject } from 'rxjs';

/**
 * A tree-structured list of nodes representing the communities, their subCommunities and collections.
 * Initially only the page-restricted top communities are shown.
 * Each node can be expanded to show its children and all children are also page-limited.
 * More pages of a page-limited result can be shown by pressing a show more node/link.
 * Which nodes were expanded is kept in the store, so this persists across pages.
 */
@Component({
  selector: 'ds-community-list',
  // styleUrls: ['./community-list.component.scss'],
  templateUrl: './community-list.component.html',
  // templateUrl: '../../../../../app/community-list-page/community-list/community-list.component.html'
})
export class CommunityListComponent extends BaseComponent implements OnInit {

  @Input() scopeId!: string;

  @Input() enableExpandCollapseAll = false;

  @ViewChildren('toggle') toggle!: QueryList<any>;

  isExpanding: BehaviorSubject<boolean>;

  ngOnInit(): void {
    this.paginationConfig.scopeID = this.scopeId;
    this.isExpanding = new BehaviorSubject<boolean>(false);
    super.ngOnInit();
  }

  expandAll(): void {
    let anyExpanded = false;
    this.isExpanding.next(true);

    const expandable = this.toggle.filter((node: any) => {
      return !!node.nativeElement.querySelector('.fa-chevron-right');
    });

    this.dataSource.loading$.pipe(
      distinctUntilChanged(),
      // allow 100 milliseconds per expanded subcommunity
      debounceTime(expandable.length * 100),
      take(1)
    ).subscribe(() => {
      if (anyExpanded) {
        this.expandAll();
      } else {
        this.isExpanding.next(false);
      }
    });

    expandable.forEach((node: any) => {
      node.nativeElement.click();
      if (!anyExpanded) {
        anyExpanded = true;
      }
    });
  }

  collapseAll(): void {
    this.toggle.filter((node: any) => {
      return !!node.nativeElement.querySelector('.fa-chevron-down');
    }).reverse().forEach((node: any) => {
      node.nativeElement.click();
    });
  }

}

