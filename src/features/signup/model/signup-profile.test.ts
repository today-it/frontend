import { describe, expect, it } from 'vitest';

import { signupPasswordMessages, signupProfileSchema } from './signup-profile';

function passwordMessage(password: string) {
  const result = signupProfileSchema.safeParse({ nickname: '유저', password });

  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('비밀번호 규칙', () => {
  it('영문·숫자·특수문자를 포함한 10~72자는 통과한다', () => {
    expect(passwordMessage('Password123!')).toBeUndefined();
    expect(passwordMessage('my pass 1 word!!')).toBeUndefined();
  });

  it('10자 미만은 형식 문구를 보여준다', () => {
    expect(passwordMessage('Ab1!')).toBe(signupPasswordMessages.format);
  });

  it('73자 이상은 형식 문구를 보여준다', () => {
    expect(passwordMessage(`Ab1!${'a'.repeat(69)}`)).toBe(signupPasswordMessages.format);
  });

  it('72자 이하여도 UTF-8 72바이트를 넘으면 형식 문구를 보여준다', () => {
    // 한글 25자는 75바이트입니다.
    expect(passwordMessage(`Ab1!${'가'.repeat(25)}`)).toBe(signupPasswordMessages.format);
  });

  it.each(['abcdefghij1', '1234567890!', 'abcdefghij!', '가나다라마바사아자차1!'])(
    '영문·숫자·특수문자 중 빠진 것이 있으면 형식 문구를 보여준다: %s',
    (password) => {
      expect(passwordMessage(password)).toBe(signupPasswordMessages.format);
    },
  );
});
