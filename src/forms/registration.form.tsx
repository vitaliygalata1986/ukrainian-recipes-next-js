'use client';

import { Form, Input, Button } from '@heroui/react';
import { useState } from 'react';

interface IProps {
  onClose: () => void;
}

const RegistrationForm = ({ onClose }: IProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // закрываем моальное окно полсе регистрации
    onClose();
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
          if (!validateEmail(value)) return 'Невірний формат email';
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
          if (value.length < 6) return 'Пароль має бути не менше 6 символів';
          return null;
        }}
      />

      <Input
        aria-label="Confirm Password"
        isRequired
        name="confirmPassword"
        placeholder="Введіть пароль"
        type="confirmPassword"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm focus:outline-none',
        }}
        validate={(value) => {
          if (!value) return "Пароль обов'язковий";
          if (value !== formData.password) return 'Паролі не співпадають';
          return null;
        }}
      />
      <div className="flex w-[100%] justify-end gap-4 items-center pt-4">
        <Button variant="light" onPress={onClose}>
          Вiдмінити
        </Button>
        <Button color="primary" type="submit">
          Зарегіструватися
        </Button>
      </div>
    </Form>
  );
};

export default RegistrationForm;
