'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchProfile, registerUser } from '@/lib/auth';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPageView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        name: values.name?.trim() ? values.name.trim() : undefined,
      };

      await registerUser(payload);
      const profile = await fetchProfile();
      useAuthStore.getState().setUser(profile);
      useAuthStore.getState().setHydrated(true);
      router.push('/profile');
    } catch (err) {
      setError((err as Error).message || 'Unable to create an account. Please try again.');
    }
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Register</h1>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
            {form.formState.errors.email && <p className="error-text">{form.formState.errors.email.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
            {form.formState.errors.password && <p className="error-text">{form.formState.errors.password.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input id="name" type="text" autoComplete="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="error-text">{form.formState.errors.name.message}</p>}
          </FormField>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating account...' : 'Register'}
          </Button>
        </Form>
      </section>
    </main>
  );
}

export default RegisterPageView;
