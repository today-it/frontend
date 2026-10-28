'use client';

import { Button, Confetti, ModalTitle, TextLink } from '@/shared/ui';

export interface SignupCompleteStepProps {
  /** 취향 알려주기를 눌렀을 때 호출되는 함수 */
  onStartPreference: () => void;
  /** 나중에 설정할게요를 눌렀을 때 호출되는 함수 */
  onSkip: () => void;
}

/**
 * 회원가입 모달의 가입 완료 단계입니다. 선호 지역·컨셉은 선택 사항이라
 * 바로 설정하거나 나중에 설정하도록 안내합니다. 모달 위쪽에 confetti가 한 번 재생됩니다.
 */
export function SignupCompleteStep({ onSkip, onStartPreference }: SignupCompleteStepProps) {
  return (
    <>
      <Confetti className="pointer-events-none absolute top-0 left-0" />

      <div className="flex flex-col items-center gap-8">
        <ModalTitle>회원가입이 완료되었어요</ModalTitle>
        <p className="text-center text-caption-c1 text-text-tertiary">
          취향을 알려주시면 맞춤 데이트 코스를 추천해드릴게요.
        </p>
      </div>

      <Button className="w-full" onClick={onStartPreference} type="button">
        취향 알려주기
      </Button>

      <div className="flex justify-center">
        <TextLink
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
