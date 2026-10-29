import { apiRequest, isApiError } from '@/shared/api';

import { type SignupApi } from './signup-api';
import { type SignupTermId } from './signup-terms';

/** 약관 id와 서버의 약관 코드 대응 */
const agreementCodes = {
  service: 'TOS',
  privacy: 'ACCOUNT_PRIVACY',
  'profile-image': 'PROFILE_IMAGE',
  preference: 'PREFERENCE',
} as const satisfies Record<SignupTermId, string>;

type AgreementCode = (typeof agreementCodes)[SignupTermId];

/** 동의한 약관 id를 서버가 받는 `{ 약관코드: 동의 여부 }` 형태로 바꿉니다. */
export function toAgreements(agreedIds: readonly SignupTermId[]) {
  const agreements = {} as Record<AgreementCode, boolean>;

  for (const [id, code] of Object.entries(agreementCodes) as [SignupTermId, AgreementCode][]) {
    agreements[code] = agreedIds.includes(id);
  }

  return agreements;
}

/**
 * 실제 서버에 요청하는 회원가입 API입니다.
 *
 * 서버가 정상적으로 거절한 경우(이미 가입, 코드 불일치, 닉네임 중복 등)는 결과 값으로 반환합니다.
 * 명세에 없는 오류 코드와 네트워크·서버 오류는 던져서 모달이 재시도 상태로 처리하게 합니다.
 */
export function createHttpSignupApi(): SignupApi {
  return {
    async requestCode(email, { resend = false } = {}) {
      // 재전송은 처음 발송 전에 이미 확인한 이메일이라 중복 확인을 다시 하지 않습니다.
      if (!resend) {
        const { available } = await apiRequest<{ available: boolean }>(
          '/api/v1/auth/emails/check',
          { query: { email } },
        );

        if (!available) {
          return 'registered';
        }
      }

      try {
        await apiRequest('/api/v1/auth/email-verifications', {
          method: 'POST',
          body: { email, purpose: 'SIGNUP' },
        });
      } catch (error) {
        if (isApiError(error, 400, 'EMAIL_VERIFICATION_RESEND_TOO_SOON')) {
          return 'tooSoon';
        }

        if (isApiError(error, 400, 'EMAIL_VERIFICATION_SEND_LIMIT_EXCEEDED')) {
          return 'limitExceeded';
        }

        throw error;
      }

      return 'sent';
    },

    async verifyCode(email, code) {
      try {
        const { verificationToken } = await apiRequest<{ verificationToken: string }>(
          '/api/v1/auth/email-verifications/confirm',
          {
            method: 'POST',
            // 앞자리 0이 사라지지 않게 문자열로 보내고, `000 - 000`의 구분자는 뺍니다.
            body: { email, verificationCode: code.replace(/\D/g, ''), purpose: 'SIGNUP' },
          },
        );

        return { verificationToken };
      } catch (error) {
        if (isApiError(error, 400, 'EMAIL_VERIFICATION_CODE_INVALID')) {
          const { failureCount, maxFailureCount } = error.body ?? {};

          // 마지막 시도까지 틀리면 서버가 새 인증코드를 메일로 다시 보냅니다.
          return typeof failureCount === 'number' &&
            typeof maxFailureCount === 'number' &&
            failureCount >= maxFailureCount
            ? 'reissued'
            : 'invalid';
        }

        if (isApiError(error, 400, 'EMAIL_VERIFICATION_CODE_EXPIRED')) {
          return 'expired';
        }

        // 3회 실패로 새 인증코드를 보내야 했지만 발송 횟수 제한에 걸린 경우입니다.
        if (isApiError(error, 400, 'EMAIL_VERIFICATION_SEND_LIMIT_EXCEEDED')) {
          return 'limitExceeded';
        }

        throw error;
      }
    },

    async checkNickname(nickname) {
      try {
        const { available } = await apiRequest<{ available: boolean }>(
          '/api/v1/members/nickname/check',
          { query: { nickname } },
        );

        return available ? 'available' : 'duplicated';
      } catch (error) {
        // 형식은 입력 단계에서 먼저 검사하므로, 서버의 400은 금칙어로 봅니다.
        if (isApiError(error, 400, 'INVALID_REQUEST')) {
          return 'forbidden';
        }

        throw error;
      }
    },

    async signup({ agreedIds, email, nickname, password, verificationToken }) {
      try {
        await apiRequest('/api/v1/auth/signup', {
          method: 'POST',
          body: {
            provider: 'LOCAL',
            email,
            emailVerificationToken: verificationToken,
            password,
            nickname,
            agreements: toAgreements(agreedIds),
          },
        });
      } catch (error) {
        if (isApiError(error, 400, 'EMAIL_VERIFICATION_TOKEN_INVALID')) {
          return 'verificationExpired';
        }

        if (isApiError(error, 409, 'EMAIL_ALREADY_EXISTS')) {
          return 'emailRegistered';
        }

        if (isApiError(error, 409, 'NICKNAME_ALREADY_EXISTS')) {
          return 'nicknameDuplicated';
        }

        throw error;
      }

      return 'created';
    },

    // 선호 지역·컨셉 저장 API는 아직 명세에 없어 저장하지 않고 성공으로 처리합니다.
    async savePreference() {},
  };
}
