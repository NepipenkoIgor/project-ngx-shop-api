export interface IProduct {
  description: string;
  brand: string;
  characteristics: ICharacteristic[];
  images: IImage[];
  name: string;
  pric: number;
  status: number;
  subCategory: string;
}

interface IImage {
  url: string;
  source: string;
}

interface ICharacteristic {
  title: string;
  items: ICharacteristicsItem[];
}

interface ICharacteristicsItem {
  name: string;
  value: string;
}
