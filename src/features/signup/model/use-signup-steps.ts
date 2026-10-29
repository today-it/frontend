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

type SignupStep = 'terms' | 'email' | 'profile' | 'complete' | 'preference';

interface UseSignupStepsOptions {
  api: SignupApi;
  /** 가입 완료 안내에서 나중에 설정하거나, 선호 지역·컨셉을 저장하거나 건너뛰어 가입이 끝났을 때 호출됩니다. */
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
  const [verificationToken, setVerificationToken] = useState('');
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
    setVerificationToken('');
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
      () => api.requestCode(email, { resend: true }),
      (result) => {
        if (result !== 'sent') {
          setEmailError(result);
          return;
        }

        setEmailError(undefined);
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
        if (typeof result === 'string') {
          setCodeError(result);

          // 서버가 새 인증코드를 보냈으므로 유효 시간을 다시 셉니다.
          if (result === 'reissued') {
            startCountdown();
          }

          return;
        }

        setVerificationToken(result.verificationToken);
        setRequestFailed(false);
        setStep('profile');
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
      () => api.signup({ ...profile, email, verificationToken, agreedIds }),
      (result) => {
        if (result === 'created') {
          setStep('complete');
          return;
        }

        if (result === 'nicknameDuplicated') {
          setNicknameStatus('duplicated');
          return;
        }

        if (result === 'verificationExpired' || result === 'emailRegistered') {
          // 이메일 인증을 처음부터 다시 해야 하므로 이메일 단계로 돌아갑니다.
          setVerificationToken('');
          resetCountdown();
          setCodeError(undefined);
          // 프로필 단계는 다시 빈 입력으로 열리므로 이전 닉네임 검사 결과와 비밀번호 오류도 버립니다.
          nicknameRequestRef.current += 1;
          setNicknameStatus(undefined);
          setPasswordError(undefined);
          setPhase('email');
          setEmailError(result === 'emailRegistered' ? 'registered' : 'verificationExpired');
          setStep('email');
          return;
        }

        setPasswordError(result);
      },
    );
  }

  function startPreference() {
    setStep('preference');
  }

  function submitPreference(preference: SignupPreferenceValues) {
    void submit(() => api.savePreference(preference), onComplete);
  }

  function finishSignup() {
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
    changeCode: () => {
      setCodeError(undefined);
      setEmailError(undefined);
    },
    changeNickname,
    checkNickname,
    changePassword: () => setPasswordError(undefined),
    submitProfile,
    startPreference,
    submitPreference,
    finishSignup,
    reset,
  };
}
