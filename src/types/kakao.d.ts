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
              callback: (data: any[], status: string) => void
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