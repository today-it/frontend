import { useCallback, useEffect, useRef, useState } from 'react';

import { type SignupApi, signupSocialErrorMessages, type SignupSocialProvider } from './signup-api';
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

/** 인증코드 발송 횟수 제한에 걸렸을 때 서버가 발송을 막는 시간(30분) */
const SEND_LIMIT_BLOCK_MS = 30 * 60 * 1000;

type SignupStep = 'terms' | 'email' | 'profile' | 'complete' | 'preference';

type SignupSocialError = keyof typeof signupSocialErrorMessages;

/** 소셜 인증을 마치고 가입만 남았을 때 전달하는 값 */
export interface SignupSocialSession {
  provider: SignupSocialProvider;
  signupToken: string;
  /** 소셜 버튼을 누르기 전에 동의한 약관. 비어 있으면 약관 동의부터 진행합니다. */
  agreedIds: readonly SignupTermId[];
}

interface UseSignupStepsOptions {
  api: SignupApi;
  /** 가입 완료 안내에서 나중에 설정하거나, 선호 지역·컨셉을 저장하거나 건너뛰어 가입이 끝났을 때 호출됩니다. */
  onComplete: () => void;
  /** 소셜 가입으로 진행할 때의 인증 정보. 없으면 이메일 가입으로 진행합니다. */
  social?: SignupSocialSession;
}

/**
 * 회원가입 모달의 단계 이동과 서버 요청 상태를 관리합니다. 요청은 한 번에 하나만 보내고,
 * `reset`을 호출하면 처음 단계로 돌아가며 진행 중이던 요청의 응답은 무시합니다.
 */
export function useSignupSteps({ api, onComplete, social }: UseSignupStepsOptions) {
  // 소셜 가입은 약관에 이미 동의했으면 프로필 단계부터 시작합니다.
  const initialStep: SignupStep = social && social.agreedIds.length > 0 ? 'profile' : 'terms';
  const [step, setStep] = useState<SignupStep>(initialStep);
  const [phase, setPhase] = useState<SignupEmailPhase>('email');
  const [agreedIds, setAgreedIds] = useState<SignupTermId[]>([...(social?.agreedIds ?? [])]);
  const [email, setEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isResendBlocked, setIsResendBlocked] = useState(false);
  const [emailError, setEmailError] = useState<SignupEmailServerError>();
  const [codeError, setCodeError] = useState<SignupCodeError>();
  const [nicknameStatus, setNicknameStatus] = useState<SignupNicknameStatus>();
  const [passwordError, setPasswordError] = useState<SignupPasswordServerError>();
  const [socialError, setSocialError] = useState<SignupSocialError>();
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

  // 발송 횟수 제한에 걸리면 서버가 막는 30분 동안 재전송을 막고, 시간이 지나면 풉니다.
  useEffect(() => {
    if (!isResendBlocked) {
      return;
    }

    const timeoutId = setTimeout(() => setIsResendBlocked(false), SEND_LIMIT_BLOCK_MS);

    return () => clearTimeout(timeoutId);
  }, [isResendBlocked]);

  const reset = useCallback(() => {
    generationRef.current += 1;
    nicknameRequestRef.current += 1;
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    setRequestFailed(false);
    setStep(initialStep);
    setPhase('email');
    setAgreedIds([...(social?.agreedIds ?? [])]);
    setEmail('');
    setVerificationToken('');
    setIsResendBlocked(false);
    setEmailError(undefined);
    setCodeError(undefined);
    setNicknameStatus(undefined);
    setPasswordError(undefined);
    setSocialError(undefined);
    resetCountdown();
  }, [initialStep, resetCountdown, social]);

  function agreeTerms(nextAgreedIds: SignupTermId[]) {
    setAgreedIds(nextAgreedIds);
    // 소셜 가입은 이메일 인증을 거치지 않습니다.
    setStep(social ? 'profile' : 'email');
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
        if (result === 'limitExceeded') {
          // 차단 안내는 codeError가 아니라 차단 상태에서 파생해 보여줍니다. 이전 코드 오류는 지웁니다.
          setCodeError(undefined);
          setIsResendBlocked(true);
          return;
        }

        if (result === 'tooSoon') {
          // 코드 단계의 재전송 오류는 이전 코드 오류를 대체해 코드 오류 자리에 하나만 보여줍니다.
          setCodeError(result);
          return;
        }

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
          if (result === 'limitExceeded') {
            // 3회 실패 후 자동 재발송이 한도에 걸린 경우입니다. 차단 안내는 차단 상태에서 파생해 보여줍니다.
            setCodeError(undefined);
            setIsResendBlocked(true);
            return;
          }

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
    setSocialError(undefined);
    void submit(
      () =>
        social
          ? api.signup({
              kind: 'social',
              provider: social.provider,
              signupToken: social.signupToken,
              nickname: profile.nickname,
              agreedIds,
            })
          : api.signup({ kind: 'local', ...profile, email, verificationToken, agreedIds }),
      (result) => {
        if (result === 'created') {
          setStep('complete');
          return;
        }

        if (result === 'nicknameDuplicated') {
          setNicknameStatus('duplicated');
          return;
        }

        if (result === 'socialTokenExpired' || result === 'socialRegistered') {
          setSocialError(result);
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
    // 재전송이 막혀 있는 동안에는 다른 오류가 없을 때 차단 안내를 보여줘서, 버튼이 비활성인 이유가 항상 보이게 합니다.
    // 차단 해제와 안내 제거가 같은 상태(isResendBlocked)를 따르므로 서로 어긋나지 않습니다.
    codeError:
      codeError ??
      (isResendBlocked ? ('limitExceeded' as const) : isExpired ? ('expired' as const) : undefined),
    timerSeconds: secondsLeft,
    nicknameStatus,
    passwordError,
    socialErrorMessage: socialError ? signupSocialErrorMessages[socialError] : undefined,
    isSubmitting,
    requestFailed,
    isResendBlocked,
    agreeTerms,
    requestCode,
    resendCode,
    verifyCode,
    // 입력을 고치면 이전 요청의 오류는 더 이상 맞지 않으므로 함께 지웁니다.
    // 클라이언트 검증에서 걸리면 요청을 다시 보내지 않아 요청 실패 문구가 남을 수 있습니다.
    changeEmail: () => {
      setEmailError(undefined);
      setRequestFailed(false);
    },
    changeCode: () => {
      setCodeError(undefined);
      setEmailError(undefined);
      setRequestFailed(false);
    },
    changeNickname,
    checkNickname,
    changePassword: () => {
      setPasswordError(undefined);
      setRequestFailed(false);
    },
    submitProfile,
    startPreference,
    submitPreference,
    finishSignup,
    reset,
  };
}
