import { useCallback, useRef, useState } from 'react';

import { type SignupApi } from './signup-api';
import {
  SIGNUP_CODE_EXPIRES_SECONDS,
  type SignupCodeError,
  type SignupEmailPhase,
  type SignupEmailServerError,
} from './signup-email';
import { type SignupPreferenceValues } from './signup-preference';
import {
  type SignupNicknameStatus,
  type SignupPasswordServerError,
  type SignupProfileValues,
} from './signup-profile';
import { type SignupTermId } from './signup-terms';
import { useCountdown } from './use-countdown';

type SignupStep = 'terms' | 'email' | 'profile' | 'preference';

interface UseSignupStepsOptions {
  api: SignupApi;
  /** 선호 지역·컨셉을 저장하거나 건너뛰어 가입이 끝났을 때 호출됩니다. */
  onComplete: () => void;
}

/**
 * 회원가입 모달의 단계 이동과 서버 요청 상태를 관리합니다. 요청은 한 번에 하나만 보내고,
 * `reset`을 호출하면 처음 단계로 돌아가며 진행 중이던 요청의 응답은 무시합니다.
 */
export function useSignupSteps({ api, onComplete }: UseSignupStepsOptions) {
  const [step, setStep] = useState<SignupStep>('terms');
  const [phase, setPhase] = useState<SignupEmailPhase>('email');
  const [agreedIds, setAgreedIds] = useState<SignupTermId[]>([]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<SignupEmailServerError>();
  const [codeError, setCodeError] = useState<SignupCodeError>();
  const [nicknameStatus, setNicknameStatus] = useState<SignupNicknameStatus>();
  const [passwordError, setPasswordError] = useState<SignupPasswordServerError>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const {
    isExpired,
    reset: resetCountdown,
    secondsLeft,
    start: startCountdown,
  } = useCountdown(SIGNUP_CODE_EXPIRES_SECONDS);

  // reset 이후에 도착한 응답을 구분하는 번호입니다.
  const generationRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const nicknameRequestRef = useRef(0);

  // 진행 중이면 무시하고, 실패하면 requestFailed를 켭니다.
  async function submit<T>(request: () => Promise<T>, onSuccess: (result: T) => void) {
    if (isSubmittingRef.current) {
      return;
    }

    const generation = generationRef.current;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setRequestFailed(false);

    try {
      const result = await request();

      if (generation === generationRef.current) {
        onSuccess(result);
      }
    } catch {
      if (generation === generationRef.current) {
        setRequestFailed(true);
      }
    } finally {
      if (generation === generationRef.current) {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    }
  }

  const reset = useCallback(() => {
    generationRef.current += 1;
    nicknameRequestRef.current += 1;
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    setRequestFailed(false);
    setStep('terms');
    setPhase('email');
    setAgreedIds([]);
    setEmail('');
    setEmailError(undefined);
    setCodeError(undefined);
    setNicknameStatus(undefined);
    setPasswordError(undefined);
    resetCountdown();
  }, [resetCountdown]);

  function agreeTerms(nextAgreedIds: SignupTermId[]) {
    setAgreedIds(nextAgreedIds);
    setStep('email');
  }

  function requestCode(nextEmail: string) {
    setEmail(nextEmail);
    void submit(
      () => api.requestCode(nextEmail),
      (result) => {
        if (result !== 'sent') {
          setEmailError(result);
          return;
        }

        setEmailError(undefined);
        setCodeError(undefined);
        setPhase('code');
        startCountdown();
      },
    );
  }

  function resendCode() {
    void submit(
      () => api.requestCode(email),
      (result) => {
        if (result !== 'sent') {
          setEmailError(result);
          return;
        }

        setCodeError(undefined);
        startCountdown();
      },
    );
  }

  function verifyCode(code: string) {
    if (isExpired) {
      setCodeError('expired');
      return;
    }

    void submit(
      () => api.verifyCode(email, code),
      (result) => {
        if (result === 'verified') {
          setRequestFailed(false);
          setStep('profile');
          return;
        }

        setCodeError(result);
      },
    );
  }

  // 닉네임이 바뀌면 이전 검사 결과와 대기 중인 응답을 버립니다.
  function changeNickname() {
    nicknameRequestRef.current += 1;
    setNicknameStatus(undefined);
    setRequestFailed(false);
  }

  // 입력을 막지 않는 요청이라 가장 마지막 요청의 응답만 반영합니다.
  async function checkNickname(nickname: string) {
    const generation = generationRef.current;
    const requestId = (nicknameRequestRef.current += 1);
    const isCurrent = () =>
      generation === generationRef.current && requestId === nicknameRequestRef.current;

    setNicknameStatus('checking');

    try {
      const result = await api.checkNickname(nickname);

      if (isCurrent()) {
        setNicknameStatus(result);
      }
    } catch {
      if (isCurrent()) {
        setNicknameStatus(undefined);
        setRequestFailed(true);
      }
    }
  }

  function submitProfile(profile: SignupProfileValues) {
    void submit(
      () => api.signup({ ...profile, email }),
      (result) => {
        if (result === 'created') {
          setStep('preference');
          return;
        }

        setPasswordError(result);
      },
    );
  }

  function submitPreference(preference: SignupPreferenceValues) {
    void submit(() => api.savePreference(preference), onComplete);
  }

  function skipPreference() {
    if (!isSubmittingRef.current) {
      onComplete();
    }
  }

  return {
    step,
    phase,
    agreedIds,
    email,
    emailError,
    codeError: codeError ?? (isExpired ? ('expired' as const) : undefined),
    timerSeconds: secondsLeft,
    nicknameStatus,
    passwordError,
    isSubmitting,
    requestFailed,
    agreeTerms,
    requestCode,
    resendCode,
    verifyCode,
    changeEmail: () => setEmailError(undefined),
    changeCode: () => setCodeError(undefined),
    changeNickname,
    checkNickname,
    changePassword: () => setPasswordError(undefined),
    submitProfile,
    submitPreference,
    skipPreference,
    reset,
  };
}
