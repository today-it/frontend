import { ChipRemovable } from '@/shared/ui';

import {
  getDistrictLabel,
  getRegionLabel,
  placeConcepts,
  type PlaceFilterState,
  type RegionOption,
} from '../_model/place-filters';

interface PlaceFilterChipsProps {
  filters: PlaceFilterState;
  regions: readonly RegionOption[];
  onChange: (filters: PlaceFilterState) => void;
}

export function PlaceFilterChips({ filters, onChange, regions }: PlaceFilterChipsProps) {
  return (
    <>
      {filters.regions.flatMap((region) =>
        region.districtIds.length === 0 ? (
          <ChipRemovable
            key={region.regionId}
            label={getRegionLabel(region.regionId, regions)}
            onRemove={() =>
              onChange({
                ...filters,
                regions: filters.regions.filter((entry) => entry.regionId !== region.regionId),
              })
            }
          />
        ) : (
          region.districtIds.map((districtId) => (
            <ChipRemovable
              key={`${region.regionId}:${districtId}`}
              label={getDistrictLabel(region.regionId, districtId, regions)}
              onRemove={() =>
                onChange({
                  ...filters,
                  regions: filters.regions.flatMap((entry) => {
                    if (entry.regionId !== region.regionId) return [entry];
                    const districtIds = entry.districtIds.filter((id) => id !== districtId);
                    return districtIds.length ? [{ ...entry, districtIds }] : [];
                  }),
                })
              }
            />
          ))
        ),
      )}
      {filters.conceptIds.map((conceptId) => {
        const concept = placeConcepts.find((option) => option.id === conceptId);
        if (!concept) return null;

        return (
          <ChipRemovable
            key={concept.id}
            label={concept.label}
            onRemove={() =>
              onChange({
                ...filters,
                conceptIds: filters.conceptIds.filter((id) => id !== conceptId),
              })
            }
          />
        );
      })}
    </>
  );
}
