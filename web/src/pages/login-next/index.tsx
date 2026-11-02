import SvgIcon from '@/components/svg-icon';
import { PixelMark, PixelPattern } from '@/components/pixel-mark';
import { BrandLogo } from '@/components/brand-logo';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/auth-hooks';
import {
  useLogin,
  useLoginChannels,
  useLoginWithChannel,
  useRegister,
} from '@/hooks/use-login-request';
import { useSystemConfig } from '@/hooks/use-system-request';
import ThemeButton from '@/layouts/components/theme-button';
import { rsaPsw } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { NICKNAME_PATTERN } from '../user-setting/profile/constants';
import './index.less';

type AuthMode = 'login' | 'register';
type AuthFormValues = {
  nickname?: string;
  email: string;
  password: string;
  remember?: boolean;
};
type LoginChannel = { channel: string; icon?: string; display_name: string };

const Features: { key: string; pattern: PixelPattern; tone: string }[] = [
  { key: 'summariseTitle', pattern: 'spark', tone: 'forest' },
  { key: 'compareTitle', pattern: 'compare', tone: 'plum' },
  { key: 'answerTitle', pattern: 'answer', tone: 'orange' },
  { key: 'reportTitle', pattern: 'report', tone: 'yellow' },
];

function LoginChannelButton({
  channel,
  onSignIn,
}: {
  channel: LoginChannel;
  onSignIn: (channel: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const handleSignIn = () => onSignIn(channel.channel);
  return (
    <Button
      type="button"
      variant="outline"
      className="aw-auth-channel"
      onClick={handleSignIn}
    >
      <SvgIcon name={channel.icon || 'sso'} width={20} height={20} />
      {t('workspace.signInWith', { provider: channel.display_name })}
    </Button>
  );
}

function LoginFormContent({
  mode,
  form,
  loading,
  onCheck,
  changeMode,
  registerEnabled,
  channels,
  handleLoginWithChannel,
  disablePasswordLogin,
}: {
  mode: AuthMode;
  form: UseFormReturn<AuthFormValues>;
  loading: boolean;
  onCheck: (params: AuthFormValues) => Promise<void>;
  changeMode: () => void;
  registerEnabled: boolean;
  channels: LoginChannel[];
  handleLoginWithChannel: (channel: string) => Promise<void>;
  disablePasswordLogin: boolean;
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const { t: tw } = useTranslation('translation', { keyPrefix: 'workspace' });
  return (
    <section
      className="aw-auth-card"
      data-testid="auth-card-active"
      aria-labelledby="auth-title"
    >
      <header className="aw-auth-form-heading">
        <p className="aw-eyebrow">{tw('authWorkspace')}</p>
        <h2 className="aw-title" id="auth-title">
          {mode === 'login' ? t('loginTitle') : t('signUpTitle')}
        </h2>
        <p className="text-sm text-text-secondary">
          {tw(
            mode === 'login'
              ? 'authSignInDescription'
              : 'authRegisterDescription',
          )}
        </p>
      </header>
      {!disablePasswordLogin && (
        <Form {...form}>
          <form
            className="aw-auth-form"
            data-testid="auth-form"
            data-active="true"
            onSubmit={form.handleSubmit(onCheck)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="auth-email"
                      type="email"
                      inputMode="email"
                      placeholder={t('emailPlaceholder')}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === 'register' && (
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('nicknameLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="auth-nickname"
                        placeholder={t('nicknamePlaceholder')}
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="auth-password"
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === 'login' && (
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="aw-auth-remember">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm font-normal text-text-secondary">
                      {t('rememberMe')}
                    </FormLabel>
                  </FormItem>
                )}
              />
            )}
            <ButtonLoading
              data-testid="auth-submit"
              type="submit"
              loading={loading}
              className="aw-auth-submit"
            >
              {mode === 'login' ? t('login') : t('continue')}
              <ArrowRight className="size-4" />
            </ButtonLoading>
          </form>
        </Form>
      )}
      {mode === 'login' && channels.length > 0 && (
        <div className="aw-auth-channels">
          {!disablePasswordLogin && (
            <p className="aw-auth-divider">{tw('authOrContinue')}</p>
          )}
          {channels.map((channel) => (
            <LoginChannelButton
              key={channel.channel}
              channel={channel}
              onSignIn={handleLoginWithChannel}
            />
          ))}
        </div>
      )}
      {!disablePasswordLogin && (mode === 'register' || registerEnabled) && (
        <footer className="aw-auth-switch">
          <span>{mode === 'login' ? t('signInTip') : t('signUpTip')}</span>
          <Button
            type="button"
            data-testid={
              mode === 'login' ? 'auth-toggle-register' : 'auth-toggle-login'
            }
            variant="link"
            onClick={changeMode}
            className="h-auto px-1 text-accent-primary font-semibold"
          >
            {mode === 'login' ? t('signUp') : t('login')}
          </Button>
        </footer>
      )}
    </section>
  );
}

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { channels, loading: channelsLoading } = useLoginChannels();
  const { login: loginWithChannel, loading: loginWithChannelLoading } =
    useLoginWithChannel();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const { t: tSetting } = useTranslation('translation', {
    keyPrefix: 'setting',
  });
  const { t: tw } = useTranslation('translation', { keyPrefix: 'workspace' });
  const { config } = useSystemConfig();
  const registerEnabled =
    config?.registerEnabled === 1 || config?.registerEnabled === true;
  const { isLogin } = useAuth();
  const loading =
    signLoading ||
    registerLoading ||
    channelsLoading ||
    loginWithChannelLoading;

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin, navigate]);

  const FormSchema = z
    .object({
      nickname: z.string().optional(),
      email: z
        .string()
        .email()
        .min(1, { message: t('emailPlaceholder') }),
      password: z.string().min(1, { message: t('passwordPlaceholder') }),
      remember: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (mode !== 'register') return;
      if (!data.nickname) {
        ctx.addIssue({
          path: ['nickname'],
          message: t('nicknamePlaceholder'),
          code: z.ZodIssueCode.custom,
        });
        return;
      }
      if (!NICKNAME_PATTERN.test(data.nickname))
        ctx.addIssue({
          path: ['nickname'],
          message: tSetting('usernameInvalidCharacters'),
          code: z.ZodIssueCode.custom,
        });
    });
  const form = useForm<AuthFormValues>({
    defaultValues: { nickname: '', email: '', password: '', remember: false },
    resolver: zodResolver(FormSchema),
  });

  const changeMode = () => {
    if (mode === 'login' && !registerEnabled) return;
    form.clearErrors();
    setMode(mode === 'login' ? 'register' : 'login');
  };
  const handleLoginWithChannel = async (channel: string) => {
    await loginWithChannel(channel);
  };
  const onCheck = async (params: AuthFormValues) => {
    try {
      const rsaPassWord = rsaPsw(params.password) as string;
      if (mode === 'login') {
        const code = await login({
          email: params.email.trim(),
          password: rsaPassWord,
        });
        if (code === 0) navigate('/');
      } else if (params.nickname) {
        const code = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) setMode('login');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div className="aw-auth">
      <header className="aw-auth-header">
        <BrandLogo />
        <ThemeButton />
      </header>
      <main className="aw-auth-layout">
        <section className="aw-auth-intro" aria-labelledby="auth-hero-title">
          <p className="aw-eyebrow">{tw('authEyebrow')}</p>
          <h1 className="aw-auth-heading" id="auth-hero-title">
            {tw('heroTitle')} <span>{tw('heroAccent')}</span>
          </h1>
          <p className="aw-auth-description">{tw('authDescription')}</p>
          <div className="aw-auth-features">
            {Features.map(({ key, pattern, tone }) => (
              <div className={`aw-auth-feature aw-tone-${tone}`} key={key}>
                <PixelMark pattern={pattern} className="size-9" />
                <span>{tw(key)}</span>
              </div>
            ))}
          </div>
        </section>
        <LoginFormContent
          mode={mode}
          form={form}
          loading={loading}
          onCheck={onCheck}
          changeMode={changeMode}
          registerEnabled={registerEnabled}
          channels={channels || []}
          handleLoginWithChannel={handleLoginWithChannel}
          disablePasswordLogin={!!config?.disablePasswordLogin}
        />
      </main>
    </div>
  );
}
