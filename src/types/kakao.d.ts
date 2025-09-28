export interface AddressSearchResult {
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x: string;
  y: string;
  place_url?: string;
  category_name?: string;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => any;
        Map: new (container: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (data: AddressSearchResult[], status: string) => void
            ) => void;
          };
          Status: {
            OK: string;
          };
        };
      };
    };
  }
}

export {};