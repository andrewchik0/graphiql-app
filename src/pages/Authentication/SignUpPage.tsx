import AuthForm, { AuthType } from '../../components/AuthForm/AuthForm';

export default function SignInPage() {
  return (
    <AuthForm authType={AuthType.register} handleSubmit={() => {}}/>
  );
}
