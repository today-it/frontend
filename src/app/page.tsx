import { TempLoginPreview } from './_components/temp-login-preview';
import { TempTermsPreview } from './_components/temp-terms-preview';

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <TempTermsPreview />
      <TempLoginPreview />
    </>
  );
}
