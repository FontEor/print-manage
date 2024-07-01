export namespace PreviewImages {
  interface CustomEventDetail {
    image: HTMLImageElement;
    index: number;
    originalImage: HTMLImageElement;
  }
  export interface CustomEvent extends Event {
    detail: CustomEventDetail;
  }
}
