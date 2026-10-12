'use client';

import { Accordion } from '@base-ui/react/accordion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button, Checkbox, Icon, ModalTitle } from '@/shared/ui';

import {
  isAllTermsAgreed,
  isRequiredTermsAgreed,
  setAllTermsAgreed,
  setTermAgreed,
  type SignupTermId,
  signupTerms,
  signupTermsSchema,
  type SignupTermsValues,
} from '../model/signup-terms';
import { SignupLoginLink } from './signup-login-link';

export interface SignupTermsStepProps {
  /** 동의한 약관 id 목록의 초기값 */
  defaultAgreedIds?: readonly SignupTermId[];
  /** 필수 약관에 동의하고 다음 버튼을 눌렀을 때 호출되는 함수. 동의한 약관 id 목록을 받습니다. */
  onNext: (agreedIds: SignupTermId[]) => void;
  /** 이미 계정이 있는 사용자가 이동할 로그인 경로 */
  loginHref: string;
  /** 로그인 모달로 전환할 때 호출합니다. */
  onLogin?: () => void;
}

/** 회원가입 모달의 약관 동의 단계입니다. 필수 약관에 동의해야 다음으로 진행할 수 있습니다. */
export function SignupTermsStep({
  defaultAgreedIds = [],
  loginHref,
  onLogin,
  onNext,
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

              <Accordion.Root className="flex flex-col gap-16">
                {signupTerms.map((term) => {
                  const labelId = `${itemLabelIdPrefix}-${term.id}`;
                  const title = `${term.required ? '(필수)' : '(선택)'} ${term.label}`;

                  return (
                    <Accordion.Item className="flex flex-col gap-12" key={term.id} value={term.id}>
                      <div className="flex items-center justify-between gap-8">
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
                        <Accordion.Header className="flex">
                          <Accordion.Trigger
                            aria-label={`${term.label} 전문 보기`}
                            className="group inline-flex size-24 shrink-0 cursor-pointer items-center justify-center p-0 text-icon-muted outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2"
                          >
                            <Icon
                              className="group-data-panel-open:hidden"
                              name="chevron-down"
                              size={16}
                              tone="inherit"
                            />
                            <Icon
                              className="hidden group-data-panel-open:inline-block"
                              name="chevron-up"
                              size={16}
                              tone="inherit"
                            />
                          </Accordion.Trigger>
                        </Accordion.Header>
                      </div>
                      <Accordion.Panel className="rounded-md bg-surface-subtle p-16 text-body-b3 whitespace-pre-line [color:var(--td-color-text-secondary)]">
                        {term.content}
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
              </Accordion.Root>
            </div>
          )}
        />

        <Button className="w-full" disabled={!isRequiredTermsAgreed(agreedIds)} type="submit">
          다음
        </Button>
      </form>

      <SignupLoginLink href={loginHref} onLogin={onLogin} />
    </>
  );
}
