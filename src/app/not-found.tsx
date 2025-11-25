'use client';

import { Button } from '@heroui/react';
import { div } from 'framer-motion/client';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-8xl font-bold text-gray-300">404</div>
      <h1 className="text-3xl font-bold tracking-tight">Страница не найдена</h1>
      <div className="pt-6">
        <Button as={Link} color="primary" variant="shadow" href="/">
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
