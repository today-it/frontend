import { type SignupCodeError, type SignupEmailServerError } from './signup-email';
import { type SignupPreferenceValues } from './signup-preference';
import {
  type SignupNicknameServerResult,
  type SignupPasswordServerError,
  type SignupProfileValues,
} from './signup-profile';

/** 서버 요청이 실패했을 때 표시하는 문구 */
export const signupRequestErrorMessage = '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.';

/**
 * 회원가입 모달이 호출하는 서버 요청입니다.
 *
 * 정상 응답은 결과 값으로 반환하고, 네트워크 오류처럼 요청 자체가 실패하면 reject합니다.
 * reject는 모달이 요청 실패 문구와 재시도 상태로 처리합니다.
 */
export interface SignupApi {
  /** 이메일로 인증코드를 보냅니다. 재전송에도 사용합니다. */
  requestCode: (email: string) => Promise<'sent' | SignupEmailServerError>;
  /** 인증코드를 확인합니다. */
  verifyCode: (email: string, code: string) => Promise<'verified' | SignupCodeError>;
  /** 닉네임이 사용 가능한지 확인합니다. */
  checkNickname: (nickname: string) => Promise<SignupNicknameServerResult>;
  /** 프로필로 회원가입합니다. */
  signup: (
    profile: SignupProfileValues & { email: string },
  ) => Promise<'created' | SignupPasswordServerError>;
  /** 선호 지역·컨셉을 저장합니다. */
  savePreference: (preference: SignupPreferenceValues) => Promise<void>;
}
