'use client';

import { useId } from 'react';

import {
  isAllTermsAgreed,
  isRequiredTermsAgreed,
  setAllTermsAgreed,
  setTermAgreed,
  type SignupTermId,
  signupTerms,
} from '@/app/_model/signup-terms';
import { Button, Checkbox, Icon, ModalTitle } from '@/shared/ui';

import { SignupLoginLink } from './signup-login-link';

export interface SignupTermsStepProps {
  /** 동의한 약관 id 목록 */
  agreedIds: readonly SignupTermId[];
  /** 동의한 약관 목록이 바뀔 때 호출되는 함수 */
  onAgreedIdsChange: (agreedIds: SignupTermId[]) => void;
  /** 필수 약관에 동의하고 다음 버튼을 눌렀을 때 호출되는 함수 */
  onNext: () => void;
  /** 약관 전문 보기를 눌렀을 때 호출되는 함수 */
  onViewTerms?: (id: SignupTermId) => void;
  /** 이미 계정이 있는 사용자가 이동할 로그인 경로 */
  loginHref: string;
}

/**
 * 회원가입 모달의 약관 동의 단계입니다. Modal 안에서 사용합니다.
 *
 * @example
 * ```tsx
 * <Modal open={open} onOpenChange={setOpen}>
 *   <SignupTermsStep
 *     agreedIds={agreedIds}
 *     loginHref="/login"
 *     onAgreedIdsChange={setAgreedIds}
 *     onNext={goNext}
 *   />
 * </Modal>
 * ```
 */
export function SignupTermsStep({
  agreedIds,
  loginHref,
  onAgreedIdsChange,
  onNext,
  onViewTerms,
}: SignupTermsStepProps) {
  const allLabelId = useId();
  const itemLabelIdPrefix = useId();

  return (
    <>
      <ModalTitle>회원가입을 위해 약관에 동의해주세요</ModalTitle>

      <div className="flex flex-col gap-16">
        <label className="flex cursor-pointer items-center gap-10">
          <Checkbox
            aria-labelledby={allLabelId}
            checked={isAllTermsAgreed(agreedIds)}
            onCheckedChange={(checked) => onAgreedIdsChange(setAllTermsAgreed(checked))}
          />
          <span className="text-caption-c1 [color:var(--td-color-text-primary)]" id={allLabelId}>
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
                  checked={agreedIds.includes(term.id)}
                  onCheckedChange={(checked) =>
                    onAgreedIdsChange(setTermAgreed(agreedIds, term.id, checked))
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

      <Button className="w-full" disabled={!isRequiredTermsAgreed(agreedIds)} onClick={onNext}>
        다음
      </Button>

      <SignupLoginLink href={loginHref} />
    </>
  );
}
