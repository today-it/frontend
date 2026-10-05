'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  isAllTermsAgreed,
  isRequiredTermsAgreed,
  setAllTermsAgreed,
  setTermAgreed,
  type SignupTermId,
  signupTerms,
  signupTermsSchema,
  type SignupTermsValues,
} from '@/features/signup/model/signup-terms';
import { Button, Checkbox, Icon, ModalTitle } from '@/shared/ui';

import { SignupLoginLink } from './signup-login-link';

export interface SignupTermsStepProps {
  /** 동의한 약관 id 목록의 초기값 */
  defaultAgreedIds?: readonly SignupTermId[];
  /** 필수 약관에 동의하고 다음 버튼을 눌렀을 때 호출되는 함수. 동의한 약관 id 목록을 받습니다. */
  onNext: (agreedIds: SignupTermId[]) => void;
  /** 약관 전문 보기를 눌렀을 때 호출되는 함수 */
  onViewTerms?: (id: SignupTermId) => void;
  /** 이미 계정이 있는 사용자가 이동할 로그인 경로 */
  loginHref: string;
}

/** 회원가입 모달의 약관 동의 단계입니다. 필수 약관에 동의해야 다음으로 진행할 수 있습니다. */
export function SignupTermsStep({
  defaultAgreedIds = [],
  loginHref,
  onNext,
  onViewTerms,
}: SignupTermsStepProps) {
  const allLabelId = useId();
  const itemLabelIdPrefix = useId();
  const { control, handleSubmit } = useForm<SignupTermsValues>({
    resolver: zodResolver(signupTermsSchema),
    defaultValues: { agreedIds: [...defaultAgreedIds] },
  });
  const agreedIds = useWatch({ control, name: 'agreedIds' });

  return (
    <>
      <ModalTitle>회원가입을 위해 약관에 동의해주세요</ModalTitle>

      <form
        className="contents"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit((values) => onNext(values.agreedIds))(event);
        }}
      >
        <Controller
          control={control}
          name="agreedIds"
          render={({ field }) => (
            <div className="flex flex-col gap-16">
              <label className="flex cursor-pointer items-center gap-10">
                <Checkbox
                  aria-labelledby={allLabelId}
                  checked={isAllTermsAgreed(field.value)}
                  onCheckedChange={(checked) => field.onChange(setAllTermsAgreed(checked))}
                />
                <span
                  className="text-caption-c1 [color:var(--td-color-text-primary)]"
                  id={allLabelId}
                >
                  전체 동의합니다
                </span>
              </label>

              <hr className="h-divider border-0 bg-border-default" />

              {signupTerms.map((term) => {
                const labelId = `${itemLabelIdPrefix}-${term.id}`;
                const title = `${term.required ? '(필수)' : '(선택)'} ${term.label}`;

                return (
                  <div className="flex items-center justify-between gap-8" key={term.id}>
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-10">
                      <Checkbox
                        aria-labelledby={labelId}
                        checked={field.value.includes(term.id)}
                        onCheckedChange={(checked) =>
                          field.onChange(setTermAgreed(field.value, term.id, checked))
                        }
                      />
                      <span
                        className="min-w-0 text-caption-c1 [color:var(--td-color-text-primary)]"
                        id={labelId}
                      >
                        {title}
                      </span>
                    </label>
                    <button
                      aria-label={`${term.label} 전문 보기`}
                      className="inline-flex size-24 shrink-0 cursor-pointer items-center justify-center p-0 text-icon-muted outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
                      onClick={() => onViewTerms?.(term.id)}
                      type="button"
                    >
                      <Icon name="chevron-right" size={16} tone="inherit" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        />

        <Button className="w-full" disabled={!isRequiredTermsAgreed(agreedIds)} type="submit">
          다음
        </Button>
      </form>

      <SignupLoginLink href={loginHref} />
    </>
  );
}
