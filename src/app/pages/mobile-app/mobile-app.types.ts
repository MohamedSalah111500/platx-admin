export type MobilePlatform = "android" | "ios";

export interface MobileUpdatePolicy {
  platform: MobilePlatform;
  forceUpdate: boolean;
  publishedVersion: string | null;
  storeUrl: string;
}
