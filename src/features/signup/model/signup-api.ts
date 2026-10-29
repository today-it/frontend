import { type SignupCodeError, type SignupEmailServerError } from './signup-email';
import { type SignupPreferenceValues } from './signup-preference';
import {
  type SignupNicknameServerResult,
  type SignupPasswordServerError,
  type SignupProfileValues,
} from './signup-profile';
import { type SignupTermId } from './signup-terms';

/** 서버 요청이 실패했을 때 표시하는 문구 */
export const signupRequestErrorMessage = '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.';

/**
 * 가입 요청을 서버가 거절한 이유입니다.
 * `verificationExpired`는 이메일 인증이 만료된 경우, `emailRegistered`는 그 사이 이메일이 가입된 경우,
 * `nicknameDuplicated`는 닉네임이 이미 사용 중인 경우입니다.
 */
export type SignupSubmitError = 'verificationExpired' | 'emailRegistered' | 'nicknameDuplicated';

/** 이메일로 가입할 때 서버에 보내는 값 */
export interface SignupRequest extends SignupProfileValues {
  email: string;
  /** 인증코드 확인으로 받은 인증 완료 토큰 */
  verificationToken: string;
  /** 동의한 약관 */
  agreedIds: readonly SignupTermId[];
}

/**
 * 회원가입 모달이 호출하는 서버 요청입니다.
 *
 * 정상 응답은 결과 값으로 반환하고, 네트워크 오류처럼 요청 자체가 실패하면 reject합니다.
 * reject는 모달이 요청 실패 문구와 재시도 상태로 처리합니다.
 */
export interface SignupApi {
  /** 이메일로 인증코드를 보냅니다. 재전송이면 `resend`를 켜서 이미 확인한 이메일 중복 확인을 건너뜁니다. */
  requestCode: (
    email: string,
    options?: { resend?: boolean },
  ) => Promise<'sent' | SignupEmailServerError>;
  /** 인증코드를 확인합니다. 성공하면 가입에 사용할 인증 완료 토큰을 반환합니다. */
  verifyCode: (
    email: string,
    code: string,
  ) => Promise<{ verificationToken: string } | SignupCodeError>;
  /** 닉네임이 사용 가능한지 확인합니다. */
  checkNickname: (nickname: string) => Promise<SignupNicknameServerResult>;
  /** 프로필로 회원가입합니다. */
  signup: (
    request: SignupRequest,
  ) => Promise<'created' | SignupPasswordServerError | SignupSubmitError>;
  /** 선호 지역·컨셉을 저장합니다. */
  savePreference: (preference: SignupPreferenceValues) => Promise<void>;
}
