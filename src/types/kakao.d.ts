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
        LatLng: new (lat: number, lng: number) => {
          getLat: () => number;
          getLng: () => number;
        };
        Map: new (container: HTMLElement, options: {
          center: unknown;
          level: number;
        }) => {
          setCenter: (position: unknown) => void;
          getLevel: () => number;
          setLevel: (level: number) => void;
        };
        Marker: new (options: {
          position: unknown;
          map?: unknown;
          title?: string;
        }) => {
          setMap: (map: unknown) => void;
          getPosition: () => unknown;
        };
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