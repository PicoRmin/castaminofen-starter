import { Form, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { ReactNode, FormHTMLAttributes } from 'react';

export type PodcastFormProps = {
  title: string;
  submitLabel: string;
  error?: string | null;
  isLoading?: boolean;
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>;

export function PodcastForm({ title, submitLabel, error, isLoading, children, className, ...props }: PodcastFormProps) {
  return (
    <section className={['card', className].filter(Boolean).join(' ')}>
      <h1>{title}</h1>
      <Form {...props} className="form-root">
        {children}
        {error && <FormMessage>{error}</FormMessage>}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </Form>
    </section>
  );
}
