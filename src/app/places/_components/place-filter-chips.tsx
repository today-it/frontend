import { Icon } from '@/shared/ui';

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
          <RemovableFilterChip
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
            <RemovableFilterChip
              key={`${region.regionId}:${districtId}`}
              label={getDistrictLabel(region.regionId, districtId, regions)}
              onRemove={() =>
                onChange({
                  ...filters,
                  regions: filters.regions.flatMap((entry) => {
                    if (entry.regionId !== region.regionId) return [entry];
                    const districtIds = entry.districtIds.filter((id) => id !== districtId);
                    return [{ ...entry, districtIds }];
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
          <RemovableFilterChip
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

function RemovableFilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      aria-label={`${label} 필터 해제`}
      className="inline-flex h-chip shrink-0 cursor-pointer items-center justify-center gap-6 rounded-full border-(length:--td-border-width-sm) border-border-active bg-surface-inverse px-20 py-10 text-caption-c1 text-text-inverse outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
      onClick={onRemove}
      type="button"
    >
      <span>{label}</span>
      <Icon name="close" size={16} tone="inherit" />
    </button>
  );
}
