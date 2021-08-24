export interface Cart {
  id: number | string;
  items: unknown[];
}

export function createCart(params: Partial<Cart>) {
  return {} as Cart;
}
