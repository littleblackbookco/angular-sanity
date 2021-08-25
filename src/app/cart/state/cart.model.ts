export interface CartItem {
  id: string;
  price: number;
  priceId: string;
  quantity: number;
}

export interface Cart {
  id: number | string;
  items: CartItem[];
}

export function createCart(params: Partial<Cart>) {
  return {} as Cart;
}
