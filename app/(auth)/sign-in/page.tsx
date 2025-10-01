"use client";

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithEmail as firebaseSignIn, waitForAuth } from '@/lib/firebase/client';

const SignIn = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });


    const onSubmit = async (data: SignInFormData) => {
        try {
            await firebaseSignIn(data.email, data.password);
            // wait for client auth state to update before routing
            await waitForAuth(8000);
            router.push('/');
        } catch (e) {
            console.error('Sign in error', e);
            let code: string | undefined;
            if (typeof e === 'object' && e !== null) {
                const maybe = e as Record<string, unknown>;
                if (typeof maybe.code === 'string') code = maybe.code;
                else if (typeof maybe.name === 'string') code = maybe.name;
            }
            toast.error('Sign in failed', {
                description: e instanceof Error ? `${e.message}${code ? ` (code: ${code})` : ''}` : 'Failed to sign in.'
            });
        }
    }

    const onGoogle = async () => {
        try {
            const user = await signInWithGoogle();
            console.info('signInWithGoogle returned', user);
            if (user) {
                toast.success(`Signed in as ${user.displayName ?? user.email}`);
                router.push('/');
                return;
            }
            // Fallback: wait for client auth to be set by Firebase, then navigate
            const waited = await waitForAuth(8000);
            if (waited) {
                toast.success(`Signed in as ${waited.name ?? waited.email}`);
            }
            router.push('/');
        } catch (e) {
            console.error('Google sign in error', e);
            let code: string | undefined;
            if (typeof e === 'object' && e !== null) {
                const maybe = e as Record<string, unknown>;
                if (typeof maybe.code === 'string') code = maybe.code;
                else if (typeof maybe.name === 'string') code = maybe.name;
            }
            toast.error('Google sign in failed', { description: code ? `code: ${code}` : undefined });
        }
    }

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@jsmastery.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <Button type="button" onClick={onGoogle} className="w-full mt-3">Sign in with Google</Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
            </form>
        </>
    );
};
export default SignIn;
