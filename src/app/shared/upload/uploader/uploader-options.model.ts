import { RestRequestMethod } from '../../../core/data/rest-request-method';

export class UploaderOptions {
  /**
   * URL of the REST endpoint for file upload.
   */
  url: string;

  authToken: string;

  disableMultipart = false;

  itemAlias: string = null;

  /**
   * Automatically send out an upload request when adding files
   */
  autoUpload = true;

  /**
   * Set the max number of files that can be loaded
   */
  maxFileNumber: number;

  /**
   * Additional parameters to inform which step made upload request
   */
  additionalParameter?: {
    [key: string]: any;
  };

  /**
   * The request method to use for the file upload request
   */
  method: RestRequestMethod = RestRequestMethod.POST;
}
