export interface BookVideo {
  asset: {
    playbackId: string;
  };
}

export const isBookVideo = (obj: any): obj is BookVideo => {
  obj ??= {};
  const objIncludesAsset = Object.getOwnPropertyNames(obj).includes('asset');
  const assetIncludesPlaybackId = Object.getOwnPropertyNames(
    obj.asset ?? {}
  ).includes('playbackId');
  return objIncludesAsset && assetIncludesPlaybackId;
};

export interface BookImage {
  caption: string;
  url: string;
}

export const isBookImage = (obj: any): obj is BookImage => {
  obj ??= {};
  const props = Object.getOwnPropertyNames(obj);
  return props.includes('caption') && props.includes('url');
};

export interface Book {
  id: string;
  description: string;
  height: number;
  images: BookImage[];
  length: number;
  ounces: number;
  pounds: number;
  price: number;
  quantity: number;
  tags: string[];
  title: string;
  slug: string;
  width: number;
  videos: BookVideo[];
}
