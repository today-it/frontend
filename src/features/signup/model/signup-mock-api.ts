import { type SignupApi } from './signup-api';

/**
 * 서버 응답을 흉내 내는 임시 API입니다. 실제 API를 연결하면 교체합니다.
 *
 * 테스트 입력:
 * - 이메일: registered@test.com(이미 가입), social@test.com(소셜 가입), soon@test.com(재전송 대기), error@test.com(요청 실패)
 * - 인증코드: 111111(불일치), 222222(3회 실패 후 재발송), 000000(만료), 그 외 6자리는 성공
 * - 닉네임: 중복확인(중복), 시스템관리자(사용 불가), 그 외는 사용 가능
 * - 비밀번호: Password123!·Qwerty1234!·Abcd123456!(차단, 전체가 일치할 때만), Errorerror1!(요청 실패)
 */
const blockedPasswords = ['Password123!', 'Qwerty1234!', 'Abcd123456!'];

export function createMockSignupApi({ delayMs = 500 }: { delayMs?: number } = {}): SignupApi {
  const wait = () => new Promise<void>((resolve) => setTimeout(resolve, delayMs));

  return {
    async requestCode(email) {
      await wait();

      if (email === 'error@test.com') {
        throw new Error('mock request failed');
      }

      if (email === 'registered@test.com') {
        return 'registered';
      }

      if (email === 'soon@test.com') {
        return 'tooSoon';
      }

      return email === 'social@test.com' ? 'social' : 'sent';
    },

    async verifyCode(_email, code) {
      await wait();

      const digits = code.replace(/\D/g, '');

      if (digits === '000000') {
        return 'expired';
      }

      if (digits === '222222') {
        return 'reissued';
      }

      return digits === '111111' ? 'invalid' : { verificationToken: 'mock-verification-token' };
    },

    async checkNickname(nickname) {
      await wait();

      if (nickname === '중복확인') {
        return 'duplicated';
      }

      return nickname === '시스템관리자' ? 'forbidden' : 'available';
    },

    async signup({ password }) {
      await wait();

      if (password === 'Errorerror1!') {
        throw new Error('mock request failed');
      }

      return blockedPasswords.includes(password) ? 'blocked' : 'created';
    },

    async savePreference() {
      await wait();
    },
  };
}
