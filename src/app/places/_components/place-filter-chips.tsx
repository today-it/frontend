import { Icon } from '@/shared/ui';

import {
  getDistrictLabel,
  getRegionLabel,
  placeConcepts,
  type PlaceFilterState,
} from '../_model/place-filters';

interface PlaceFilterChipsProps {
  filters: PlaceFilterState;
  onChange: (filters: PlaceFilterState) => void;
}

export function PlaceFilterChips({ filters, onChange }: PlaceFilterChipsProps) {
  return (
    <>
      {filters.regionId ? (
        <RemovableFilterChip
          label={getRegionLabel(filters.regionId)}
          onRemove={() => onChange({ ...filters, regionId: null, districtIds: [] })}
        />
      ) : null}
      {filters.districtIds.map((districtId) => (
        <RemovableFilterChip
          key={districtId}
          label={getDistrictLabel(filters.regionId, districtId)}
          onRemove={() =>
            onChange({
              ...filters,
              districtIds: filters.districtIds.filter((id) => id !== districtId),
            })
          }
        />
      ))}
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
