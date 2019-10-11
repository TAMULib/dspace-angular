import {CommunityListAdapter, FlatNode} from './community-list-adapter';
import {CollectionViewer, DataSource} from '@angular/cdk/typings/collections';
import {BehaviorSubject, Observable,} from 'rxjs';
import {finalize, take,} from 'rxjs/operators';

export class CommunityListDatasource implements DataSource<FlatNode> {

    private communityList$ = new BehaviorSubject<FlatNode[]>([]);
    private loading$ = new BehaviorSubject<boolean>(false);

    constructor(private communityListService: CommunityListAdapter) {
    }

    connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
        this.loadCommunities(null);
        return this.communityList$.asObservable();
    }

    loadCommunities(expandedNodes: FlatNode[]) {
        this.loading$.next(true);

        this.communityListService.loadCommunities(expandedNodes).pipe(
            take(1),
            finalize(() => this.loading$.next(false)),
            ).subscribe((flatNodes: FlatNode[]) => this.communityList$.next(flatNodes));
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.communityList$.complete();
        this.loading$.complete();
    }

}
