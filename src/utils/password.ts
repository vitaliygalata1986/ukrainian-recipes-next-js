import bcryptjs from 'bcryptjs';

export async function saltAndHashPassword(password: string): Promise<string> {
    const saltRounds = 10; // кількість раундів соління - строка, яка визначає складність хешування
    // чтобы увеличить безопасность пароля даже для одинаковых паролей
    return await bcryptjs.hash(password, saltRounds);
}