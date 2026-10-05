'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { signupRequestErrorMessage } from '@/features/signup/model/signup-api';
import {
  getDistrictOptions,
  setConceptSelected,
  signupConcepts,
  signupPreferenceSchema,
  type SignupPreferenceValues,
  signupRegions,
} from '@/features/signup/model/signup-preference';
import { Button, Chip, Dropdown, ModalTitle, TextLink } from '@/shared/ui';

import { SignupFieldMessage } from './signup-field-message';

export interface SignupPreferenceStepProps {
  /** 선호 지역의 초기값 */
  defaultCity?: string;
  /** 선호 구·군의 초기값 */
  defaultDistrict?: string;
  /** 선호 컨셉의 초기값 */
  defaultConcepts?: readonly string[];
  /** 서버 요청이 진행 중인지 나타냅니다. 진행 중에는 선택 완료 버튼과 건너뛰기가 비활성화됩니다. */
  isSubmitting?: boolean;
  /** 서버 요청이 실패했는지 나타냅니다. 선택 완료를 다시 눌러 재시도합니다. */
  requestError?: boolean;
  /** 지역, 구·군, 컨셉을 선택하고 선택 완료를 눌렀을 때 호출되는 함수 */
  onSubmit: (preference: SignupPreferenceValues) => void;
  /** 나중에 설정할게요를 눌렀을 때 호출되는 함수 */
  onSkip: () => void;
}

/**
 * 회원가입 모달의 선호 지역·컨셉 설정 단계입니다. 선택 사항이라 `onSkip`으로 건너뛸 수 있고,
 * 지역을 바꾸면 선택한 구·군이 비워집니다.
 */
export function SignupPreferenceStep({
  defaultCity = '',
  defaultConcepts = [],
  defaultDistrict = '',
  isSubmitting = false,
  onSkip,
  onSubmit,
  requestError = false,
}: SignupPreferenceStepProps) {
  const regionLabelId = useId();
  const conceptLabelId = useId();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useForm<SignupPreferenceValues>({
    resolver: zodResolver(signupPreferenceSchema),
    mode: 'onChange',
    defaultValues: { city: defaultCity, district: defaultDistrict, concepts: [...defaultConcepts] },
  });
  const city = useWatch({ control, name: 'city' });

  return (
    <>
      <ModalTitle>어떤 데이트를 좋아하세요?</ModalTitle>

      <p className="text-center text-caption-c1 [color:var(--td-color-text-tertiary)]">
        취향에 맞는 코스를 추천해드릴게요.
      </p>

      <form
        className="contents"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!isSubmitting) {
            void handleSubmit((values) => onSubmit(values))(event);
          }
        }}
      >
        <p
          className="text-center text-caption-c1 [color:var(--td-color-text-tertiary)]"
          id={regionLabelId}
        >
          선호 지역
        </p>

        <div aria-labelledby={regionLabelId} className="grid grid-cols-2 gap-16" role="group">
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Dropdown
                className="w-full min-w-0"
                label="지역"
                onValueChange={(value) => {
                  field.onChange(value ?? '');
                  setValue('district', '', { shouldValidate: true });
                }}
                options={signupRegions}
                placeholder="지역을 선택해주세요"
                value={field.value === '' ? null : field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="district"
            render={({ field }) => (
              <Dropdown
                className="w-full min-w-0"
                disabled={city === ''}
                label="구/군"
                onValueChange={(value) => field.onChange(value ?? '')}
                options={getDistrictOptions(city)}
                placeholder="구/군 선택"
                value={field.value === '' ? null : field.value}
              />
            )}
          />
        </div>

        <p
          className="text-center text-caption-c1 [color:var(--td-color-text-tertiary)]"
          id={conceptLabelId}
        >
          선호 컨셉
        </p>

        <Controller
          control={control}
          name="concepts"
          render={({ field }) => (
            <div aria-labelledby={conceptLabelId} className="grid grid-cols-3 gap-12" role="group">
              {signupConcepts.map((concept) => (
                <Chip
                  className="w-full"
                  key={concept.value}
                  onPressedChange={(pressed) =>
                    field.onChange(setConceptSelected(field.value, concept.value, pressed))
                  }
                  pressed={field.value.includes(concept.value)}
                >
                  {concept.label}
                </Chip>
              ))}
            </div>
          )}
        />

        {requestError ? (
          <SignupFieldMessage className="text-center">
            {signupRequestErrorMessage}
          </SignupFieldMessage>
        ) : null}

        <Button
          aria-busy={isSubmitting}
          className="w-full"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          선택 완료
        </Button>
      </form>

      <div className="flex justify-center">
        <TextLink
          disabled={isSubmitting}
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onSkip();
          }}
        >
          나중에 설정할게요
        </TextLink>
      </div>
    </>
  );
}
