// plan.interface.ts
export interface Feature {
  id: number;
  content: string;
  createdDate: string;
  updatedDate: string;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  priceAfterDiscount: number;
  hasDiscount: boolean;
  createdDate: string;
  updatedDate: string;
  features: Feature[];
}
