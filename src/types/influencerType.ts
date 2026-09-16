export interface Influencer {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  personalUrl: string | null;
  urlImgProfile: string | null;
  imgKey: string | null;
  counterEntries: number;
}
