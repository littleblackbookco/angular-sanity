export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Customer {
  name: string;
  email: string;
  address: CustomerAddress;
}
