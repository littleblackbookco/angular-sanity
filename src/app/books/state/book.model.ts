export interface BookVideo {
  asset: {
    url: string;
  };
}

export interface BookImage {
  caption: string;
  url: string;
}

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
