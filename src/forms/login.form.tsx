'use client';

import { signInWithCredentials } from '@/actions/sign-in';
import { Form, Input, Button } from '@heroui/react';
import { useState } from 'react';

interface IProps {
  onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signInWithCredentials(
      formData.email,
      formData.password
    );

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? null);
      return;
    }

    // успех: можно закрыть модалку и обновить страницу
    onClose();
    window.location.reload();
  };

  return (
    <Form className="w-full max-w-xs" onSubmit={handleSubmit}>
      <Input
        aria-label="Email"
        isRequired
        name="email"
        placeholder="Введіть email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        validate={(value) => {
          if (!value) return "Email обов'язковий";
          return null;
        }}
      />
      <Input
        aria-label="Password"
        isRequired
        name="password"
        placeholder="Введіть пароль"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        validate={(value) => {
          if (!value) return "Пароль обов'язковий";
          return null;
        }}
      />

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <div className="flex w-[100%] justify-end gap-4 items-center pt-4">
        <Button variant="light" onPress={onClose}>
          Вiдмінити
        </Button>
        <Button color="primary" type="submit">
          Увiйти
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
