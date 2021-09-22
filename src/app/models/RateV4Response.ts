export interface RateV4ResponseSpecialService {
  Available: boolean;
  Price: number;
  ServiceID: number;
  ServiceName: string;
}

export interface RateV4ResponsePostage {
  MailService: string;
  Rate: number;
  SpecialServices: {
    SpecialService: RateV4ResponseSpecialService[];
  };
}

export type RateV4Container =
  | 'VARIABLE'
  | 'FLAT RATE ENVELOPE'
  | 'PADDED FLAT RATE ENVELOPE'
  | 'LEGAL FLAT RATE ENVELOPE'
  | 'SM FLAT RATE ENVELOPE'
  | 'WINDOW FLAT RATE ENVELOPE'
  | 'GIFT CARD FLAT RATE ENVELOPE'
  | 'SM FLAT RATE BOX'
  | 'MD FLAT RATE BOX'
  | 'LG FLAT RATE BOX'
  | 'REGIONALRATEOXA'
  | 'REGIONALRATEBOXB'
  | 'CUBIC PARCELS'
  | 'CUBIC SOFT PACK';

export interface RateV4ResponsePackage {
  Container: RateV4Container;
  Ounces: number;
  Postage: RateV4ResponsePostage;
  Pounds: number;
  ZipDestination: number;
  ZipOrigination: number;
  Zone: number;
}

export interface RateV4Response {
  Package: RateV4ResponsePackage;
}

export interface UspsRateResponse {
  RateV4Response: RateV4Response;
}
