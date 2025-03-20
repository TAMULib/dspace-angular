import { autoserialize, autoserializeAs, deserialize, deserializeAs, inheritSerialization } from 'cerialize';
import { Observable, of, switchMap } from 'rxjs';
import { isEmpty } from '../../shared/empty.util';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { link, typedObject } from '../cache/builders/build-decorators';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { Bundle } from './bundle.model';
import { BUNDLE } from './bundle.resource-type';
import { Collection } from './collection.model';
import { COLLECTION } from './collection.resource-type';

import { DSpaceObject } from './dspace-object.model';
import { GenericConstructor } from './generic-constructor';
import { HALLink } from './hal-link.model';
import { Relationship } from './item-relationships/relationship.model';
import { RELATIONSHIP } from './item-relationships/relationship.resource-type';
import { ITEM } from './item.resource-type';
import { ChildHALResource } from './child-hal-resource.model';
import { Version } from './version.model';
import { VERSION } from './version.resource-type';
import { BITSTREAM } from './bitstream.resource-type';
import { Bitstream } from './bitstream.model';
import { ACCESS_STATUS } from 'src/app/shared/object-collection/shared/badges/access-status-badge/access-status.resource-type';
import { AccessStatusObject } from 'src/app/shared/object-collection/shared/badges/access-status-badge/access-status.model';
import { HandleObject } from './handle-object.model';
import { IDENTIFIERS } from '../../shared/object-list/identifier-data/identifier-data.resource-type';
import { IdentifierData } from '../../shared/object-list/identifier-data/identifier-data.model';

/**
 * Class representing a DSpace Item
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class Item extends DSpaceObject implements ChildHALResource, HandleObject {
  static type = ITEM;

  /**
   * A string representing the unique handle of this Item
   */
  @autoserialize
  handle: string;

  /**
   * The Date of the last modification of this Item
   */
  @deserializeAs(Date)
  lastModified: Date;

  /**
   * A boolean representing if this Item is currently archived or not
   */
  @autoserializeAs(Boolean, 'inArchive')
  isArchived: boolean;

  /**
   * A boolean representing if this Item is currently discoverable or not
   */
  @autoserializeAs(Boolean, 'discoverable')
  isDiscoverable: boolean;

  /**
   * A boolean representing if this Item is currently withdrawn or not
   */
  @autoserializeAs(Boolean, 'withdrawn')
  isWithdrawn: boolean;

  /**
   * The {@link HALLink}s for this Item
   */
  @deserialize
  _links: {
    mappedCollections: HALLink;
    relationships: HALLink;
    bundles: HALLink;
    owningCollection: HALLink;
    templateItemOf: HALLink;
    version: HALLink;
    thumbnail: HALLink;
    accessStatus: HALLink;
    identifiers: HALLink;
    self: HALLink;
  };

  /**
   * The owning Collection for this Item
   * Will be undefined unless the owningCollection {@link HALLink} has been resolved.
   */
  @link(COLLECTION)
  owningCollection?: Observable<RemoteData<Collection>>;

  /**
   * The version this item represents in its history
   * Will be undefined unless the version {@link HALLink} has been resolved.
   */
  @link(VERSION)
  version?: Observable<RemoteData<Version>>;

  /**
   * The list of Bundles inside this Item
   * Will be undefined unless the bundles {@link HALLink} has been resolved.
   */
  @link(BUNDLE, true)
  bundles?: Observable<RemoteData<PaginatedList<Bundle>>>;

  /**
   * The list of Relationships this Item has with others
   * Will be undefined unless the relationships {@link HALLink} has been resolved.
   */
  @link(RELATIONSHIP, true)
  relationships?: Observable<RemoteData<PaginatedList<Relationship>>>;

  /**
   * The thumbnail for this Item
   * Will be undefined unless the thumbnail {@link HALLink} has been resolved.
   */
  @link(BITSTREAM, false, 'thumbnail')
  // TAMU Customization: override thumbnail getter to return default thumbnail per entity type
  _thumbnail?: Observable<RemoteData<Bitstream>>;
  // thumbnail?: Observable<RemoteData<Bitstream>>;

  public get thumbnail(): Observable<RemoteData<Bitstream>> {

    const bitstream = (href): RemoteData<Bitstream> => new RemoteData(
      0, 0, 0, undefined, undefined,
      {
        sizeBytes: 0,
        description: '',
        bundleName: '',
        _links: {
          content: {
            href
          }
        }
      } as Bitstream
    );

    const byType = () => {
      const type = this.metadata?.['dspace.entity.type']?.[0]?.value;

      if (type) {
        switch (type) {
          case 'Dataset':
            return of(bitstream('assets/images/dataset-placeholder.svg'));
          case 'PDAC':
            return of(bitstream('assets/images/person-placeholder.svg'));
          case 'ResearchProject':
            return of(bitstream('assets/images/research-project-placeholder.svg'));
        }
      }
    }

    if (this._thumbnail === undefined || this._thumbnail === null) {
      return byType();
    }

    return this._thumbnail.pipe(
      switchMap(bs => {
        let result = of(bs);
        if (bs?.payload === undefined || bs?.payload === null) {
          const typeResult = byType();
          if (typeResult) {
            result = typeResult;
          }
        }

        return result;
      })
    );
  }

  public set thumbnail(thumbnail: Observable<RemoteData<Bitstream>>) {
    this._thumbnail = thumbnail;
  }
  // END TAMU Customization: override thumbnail getter to return default thumbnail per entity type

  /**
   * The access status for this Item
   * Will be undefined unless the access status {@link HALLink} has been resolved.
   */
  @link(ACCESS_STATUS)
  accessStatus?: Observable<RemoteData<AccessStatusObject>>;

  /**
   * The identifier data for this Item
   * Will be undefined unless the identifiers {@link HALLink} has been resolved.
   */
  @link(IDENTIFIERS, false, 'identifiers')
  identifiers?: Observable<RemoteData<IdentifierData>>;

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    const entityType = this.firstMetadataValue('dspace.entity.type');
    if (isEmpty(entityType)) {
      return super.getRenderTypes();
    }
    return [entityType, ...super.getRenderTypes()];
  }

  getParentLinkKey(): keyof this['_links'] {
    return 'owningCollection';
  }
}
