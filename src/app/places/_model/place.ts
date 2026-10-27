export interface PlaceSummary {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  regionId?: string;
  districtId?: string;
  imageSrc?: string;
  rating: number;
  reviewCount: number;
  likeCount: number;
}
