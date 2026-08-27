export interface ProductDetails {
  product_id: string;
  inventory_item_id: string;
  paltform_product_id: string;
  sku: string;
  website_domain: string;
  product_name: string;
  quantity: number;
  price: number;
  payload: string | string[]; // Modify type based on the structure of payload if known
  response: string | string[]; // Modify type based on the structure of response if known
  action: string;
  status: string;
  request_by: string;
  request_at: string; // Use `Date` type if it's a date object instead of a string
}

export interface ProductActiveLogResponse {
  page: string;
  pages: string;
  rowsPerPage: string;
  total: string;
  count: string;
  payload?: string[];
  results: ProductDetails[];
}
export interface EbayResponse {
  Timestamp: string;
  Ack: string;
  Version: string;
  Build: string;
  Item: {
    AutoPay: string;
    BuyerProtection: string;
    BuyItNowPrice: string;
    Country: string;
    Currency: string;
    ItemID: string;
    ListingDetails: {
      Adult: string;
      BindingAuction: string;
      CheckoutEnabled: string;
      ConvertedBuyItNowPrice: string;
      ConvertedStartPrice: string;
      ConvertedReservePrice: string;
      HasReservePrice: string;
      StartTime: string;
      EndTime: string;
      ViewItemURL: string;
      HasUnansweredQuestions: string;
      HasPublicMessages: string;
      MinimumBestOfferPrice: string;
      ViewItemURLForNaturalSearch: string;
      BestOfferAutoAcceptPrice: string;
    };
    ListingDuration: string;
    ListingType: string;
    Location: string;
    PrimaryCategory: {
      CategoryID: string;
      CategoryName: string;
    };
    PrivateListing: string;
    Quantity: string;
    IsItemEMSEligible: string;
    ReservePrice: string;
    ReviseStatus: {
      ItemRevised: string;
    };
    Seller: {
      AboutMePage: string;
      Email: string;
      FeedbackScore: string;
      PositiveFeedbackPercent: string;
      FeedbackPrivate: string;
      IDVerified: string;
      eBayGoodStanding: string;
      NewUser: string;
      RegistrationDate: string;
      Site: string;
      Status: string;
      UserID: string;
      UserIDChanged: string;
      UserIDLastChanged: string;
      VATStatus: string;
      SellerInfo: {
        AllowPaymentEdit: string;
        CheckoutEnabled: string;
        CIPBankAccountStored: string;
        GoodStanding: string;
        LiveAuctionAuthorized: string;
        MerchandizingPref: string;
        QualifiesForB2BVAT: string;
        StoreOwner: string;
        StoreURL: string;
        SellerBusinessType: string;
        SafePaymentExempt: string;
      };
      MotorsDealer: string;
    };
    SellingStatus: {
      BidCount: string;
      BidIncrement: string;
      ConvertedCurrentPrice: string;
      CurrentPrice: string;
      LeadCount: string;
      MinimumToBid: string;
      QuantitySold: string;
      ReserveMet: string;
      SecondChanceEligible: string;
      ListingStatus: string;
      QuantitySoldByPickupInStore: string;
    };
    ShippingDetails: {
      ApplyShippingDiscount: string;
      CalculatedShippingRate: {
        WeightMajor: string;
        WeightMinor: string;
      };
      SalesTax: {
        SalesTaxPercent: string;
        ShippingIncludedInTax: string;
      };
      ShippingServiceOptions: Array<{
        ShippingService: string;
        ShippingServiceCost: string;
        ShippingServicePriority: string;
        ExpeditedService: string;
        ShippingTimeMin: string;
        ShippingTimeMax: string;
        FreeShipping: string;
      }>;
      InternationalShippingServiceOption: {
        ShippingService: string;
        ShippingServiceCost: string;
        ShippingServicePriority: string;
        ShipToLocation: string;
      };
      ShippingType: string;
      ThirdPartyCheckout: string;
      ShippingDiscountProfileID: string;
      InternationalShippingDiscountProfileID: string;
      SellerExcludeShipToLocationsPreference: string;
    };
    ShipToLocations: string;
    Site: string;
    StartPrice: string;
    Storefront: {
      StoreCategoryID: string;
      StoreCategory2ID: string;
      StoreURL: string;
    };
    TimeLeft: string;
    Title: string;
    BestOfferDetails: {
      BestOfferCount: string;
      BestOfferEnabled: string;
      NewBestOffer: string;
    };
    GetItFast: string;
    SKU: string;
    PictureDetails: {
      GalleryType: string;
      PictureURL: string[];
      ExternalPictureURL: string;
    };
    DispatchTimeMax: string;
    ProxyItem: string;
    BuyerGuaranteePrice: string;
    ReturnPolicy: {
      ReturnsWithinOption: string;
      ReturnsWithin: string;
      ReturnsAcceptedOption: string;
      ReturnsAccepted: string;
      ShippingCostPaidByOption: string;
      ShippingCostPaidBy: string;
    };
    ConditionID: string;
    ConditionDescription: string;
    ConditionDisplayName: string;
    PostCheckoutExperienceEnabled: string;
    SellerProfiles: {
      SellerShippingProfile: {
        ShippingProfileID: string;
        ShippingProfileName: string;
      };
      SellerReturnProfile: {
        ReturnProfileID: string;
        ReturnProfileName: string;
      };
      SellerPaymentProfile: {
        PaymentProfileID: string;
        PaymentProfileName: string;
      };
    };
    ShippingPackageDetails: {
      ShippingIrregular: string;
      ShippingPackage: string;
      WeightMajor: string;
      WeightMinor: string;
    };
    HideFromSearch: string;
    OutOfStockControl: string;
    PickupInStoreDetails: {
      AvailableForPickupInStore: string;
    };
    eBayPlus: string;
    eBayPlusEligible: string;
    IsSecureDescription: string;
  };
}

export interface ProductRequest {
  action: string;
  brand_id: string;
  created: string;
  id: string;
  inventory_item_id: string;
  ip_addr: string;
  paltform_product_id: string;
  payload: string[] | string | null;
  price: string;
  product_id: string;
  product_name: string;
  quantity: string;
  request_at: string;
  request_by: string;
  response: EbayResponse | string;
  sku: string;
  status: string;
  updated: string | null;
  user_agent: string;
  website_domain: string;
}

//--------------------------------------------------------new data-------------------------------
interface ListingDetails {
  Adult?: string;
  BindingAuction?: string;
  CheckoutEnabled?: string;
  ConvertedBuyItNowPrice?: string;
  ConvertedStartPrice?: string;
  ConvertedReservePrice?: string;
  HasReservePrice?: string;
  StartTime?: string;
  EndTime?: string;
  ViewItemURL?: string;
  HasUnansweredQuestions?: string;
  HasPublicMessages?: string;
  MinimumBestOfferPrice?: string;
  ViewItemURLForNaturalSearch?: string;
  BestOfferAutoAcceptPrice?: string;
}

interface PrimaryCategory {
  CategoryID?: string;
  CategoryName?: string;
}

interface ReviseStatus {
  ItemRevised?: string;
}

interface SellerInfo {
  AllowPaymentEdit?: string;
  CheckoutEnabled?: string;
  CIPBankAccountStored?: string;
  GoodStanding?: string;
  LiveAuctionAuthorized?: string;
  MerchandizingPref?: string;
  QualifiesForB2BVAT?: string;
  StoreOwner?: string;
  StoreURL?: string;
  SellerBusinessType?: string;
  SafePaymentExempt?: string;
}

interface Seller {
  AboutMePage?: string;
  Email?: string;
  FeedbackScore?: string;
  PositiveFeedbackPercent?: string;
  FeedbackPrivate?: string;
  IDVerified?: string;
  eBayGoodStanding?: string;
  NewUser?: string;
  RegistrationDate?: string;
  Site?: string;
  Status?: string;
  UserID?: string;
  UserIDChanged?: string;
  UserIDLastChanged?: string;
  VATStatus?: string;
  SellerInfo?: SellerInfo;
  MotorsDealer?: string;
}

interface SellingStatus {
  BidCount?: string;
  BidIncrement?: string;
  ConvertedCurrentPrice?: string;
  CurrentPrice?: string;
  LeadCount?: string;
  MinimumToBid?: string;
  QuantitySold?: string;
  ReserveMet?: string;
  SecondChanceEligible?: string;
  ListingStatus?: string;
  QuantitySoldByPickupInStore?: string;
}

interface ShippingServiceOption {
  ShippingService?: string;
  ShippingServiceCost?: string;
  ShippingServicePriority?: string;
  ExpeditedService?: string;
  ShippingTimeMin?: string;
  ShippingTimeMax?: string;
  FreeShipping?: string;
}

interface InternationalShippingServiceOption {
  ShippingService?: string;
  ShippingServiceCost?: string;
  ShippingServicePriority?: string;
  ShipToLocation?: string;
}

interface ShippingDetails {
  ApplyShippingDiscount?: string;
  ShippingServiceOptions?: ShippingServiceOption[];
  InternationalShippingServiceOption?: InternationalShippingServiceOption;
  ShippingType?: string;
  ThirdPartyCheckout?: string;
}

interface PictureDetails {
  GalleryType?: string;
  PictureURL?: string[];
  ExternalPictureURL?: string;
}

interface ReturnPolicy {
  ReturnsWithinOption?: string;
  ReturnsWithin?: string;
  ReturnsAcceptedOption?: string;
  ReturnsAccepted?: string;
  ShippingCostPaidByOption?: string;
  ShippingCostPaidBy?: string;
}

interface SellerProfiles {
  SellerShippingProfile?: {
    ShippingProfileID?: string;
    ShippingProfileName?: string;
  };
  SellerReturnProfile?: {
    ReturnProfileID?: string;
    ReturnProfileName?: string;
  };
  SellerPaymentProfile?: {
    PaymentProfileID?: string;
    PaymentProfileName?: string;
  };
}

interface ShippingPackageDetails {
  ShippingIrregular?: string;
  ShippingPackage?: string;
  WeightMajor?: string;
  WeightMinor?: string;
}

export interface Item {
  AutoPay?: string;
  BuyerProtection?: string;
  BuyItNowPrice?: string;
  Country?: string;
  Currency?: string;
  ItemID?: string;
  ListingDetails?: ListingDetails;
  ListingDuration?: string;
  ListingType?: string;
  Location?: string;
  PrimaryCategory?: PrimaryCategory;
  PrivateListing?: string;
  Quantity?: string;
  IsItemEMSEligible?: string;
  ReservePrice?: string;
  ReviseStatus?: ReviseStatus;
  Seller?: Seller;
  SellingStatus?: SellingStatus;
  ShippingDetails?: ShippingDetails;
  ShipToLocations?: string;
  Site?: string;
  StartPrice?: string;
  Storefront?: {
    StoreCategoryID?: string;
    StoreCategory2ID?: string;
    StoreURL?: string;
  };
  TimeLeft?: string;
  Title?: string;
  BestOfferDetails?: {
    BestOfferCount?: string;
    BestOfferEnabled?: string;
    NewBestOffer?: string;
  };
  GetItFast?: string;
  SKU?: string;
  PictureDetails?: PictureDetails;
  DispatchTimeMax?: string;
  ProxyItem?: string;
  BuyerGuaranteePrice?: string;
  ReturnPolicy?: ReturnPolicy;
  ConditionID?: string;
  ConditionDescription?: string;
  ConditionDisplayName?: string;
  PostCheckoutExperienceEnabled?: string;
  SellerProfiles?: SellerProfiles;
  ShippingPackageDetails?: ShippingPackageDetails;
  HideFromSearch?: string;
  OutOfStockControl?: string;
  PickupInStoreDetails?: {
    AvailableForPickupInStore?: string;
  };
  eBayPlus?: string;
  eBayPlusEligible?: string;
  IsSecureDescription?: string;
}

export interface PayloadResponse {
  Timestamp?: string;
  Ack?: string;
  Version?: string;
  Build?: string;
  Item?: Item;
}

//--------------------------payloady data seprate

interface ShippingServiceOptionPayload {
  ShippingService: string;
  ShippingServiceCost: string;
  ShippingServicePriority: string;
  ShippingTimeMin: string;
  ShippingTimeMax: string;
  FreeShipping?: string;
  ExpeditedService?: string;
}

interface Seller {
  UserID?: string;
  Email?: string;
  FeedbackScore?: string;
  PositiveFeedbackPercent?: string;
  StoreURL?: string;
}

interface ItemPayload {
  Title: string;
  ItemID: string;
  Currency: string;
  Location: string;
  SellingStatus: {
    CurrentPrice: string;
  };
  ShippingDetails: {
    ShippingServiceOptions: ShippingServiceOptionPayload[];
  };
  Seller: Seller;
  PictureDetails: {
    PictureURL: string[];
  };
  ReturnPolicy: {
    ReturnsAccepted: string;
    ReturnsWithin: string;
    ReturnsAcceptedOption: string;
  };
}

export interface PayloadDataResponse {
  Item: ItemPayload;
}
