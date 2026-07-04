// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient } from '@azure/storage-blob';

const uploadFileToBlob = async (sasToken, file, imageType) => {
  if (!file) return [];
  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(sasToken);

  // get Container - full public read access
  const containerClient = blobService.getContainerClient(imageType);

  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);
  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };
  // upload file
  await blobClient.uploadData(file, options);

  const url = new URL(blobClient.url);
  // Remove query parameters
  url.search = '';

  return url;
};

export default uploadFileToBlob;
