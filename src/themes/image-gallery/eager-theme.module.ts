import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommunityPageModule } from '../../app/community-page/community-page.module';
import { NavbarModule } from '../../app/navbar/navbar.module';
import { RootModule } from '../../app/root.module';
import { SharedBrowseByModule } from '../../app/shared/browse-by/shared-browse-by.module';
import { ComcolModule } from '../../app/shared/comcol/comcol.module';
import { DsoPageModule } from '../../app/shared/dso-page/dso-page.module';
import { ResultsBackButtonModule } from '../../app/shared/results-back-button/results-back-button.module';
import { SharedModule } from '../../app/shared/shared.module';
import { StatisticsModule } from '../../app/statistics/statistics.module';
import { CollectionPageComponent } from './app/collection-page/collection-page.component';
import { CommunityListComponent } from './app/community-list-page/community-list/community-list.component';
import { CommunityPageComponent } from './app/community-page/community-page.component';
import { ItemGridElementComponent } from './app/shared/object-grid/item-grid-element/item-types/item/item-grid-element.component';
import { ItemSearchResultGridElementComponent } from './app/shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';

/**
 * Add components that use a custom decorator to ENTRY_COMPONENTS as well as DECLARATIONS.
 * This will ensure that decorator gets picked up when the app loads
 */
const ENTRY_COMPONENTS = [
  CollectionPageComponent,
  CommunityPageComponent,
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
  CommunityListComponent,
  ItemGridElementComponent,
  ItemSearchResultGridElementComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedBrowseByModule,
    ResultsBackButtonModule,
    RootModule,
    NavbarModule,
    ComcolModule,
    DsoPageModule,
    StatisticsModule,
    CommunityPageModule,
    CdkTreeModule,
  ],
  declarations: DECLARATIONS,
  providers: [
    ...ENTRY_COMPONENTS.map((component) => ({ provide: component }))
  ],
})
/**
 * This module is included in the main bundle that gets downloaded at first page load. So it should
 * contain only the themed components that have to be available immediately for the first page load,
 * and the minimal set of imports required to make them work. Anything you can cut from it will make
 * the initial page load faster, but may cause the page to flicker as components that were already
 * rendered server side need to be lazy-loaded again client side
 *
 * Themed EntryComponents should also be added here
 */
export class EagerThemeModule {
}