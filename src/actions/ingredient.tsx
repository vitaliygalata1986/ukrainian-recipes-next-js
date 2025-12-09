"use server"

export async function createIngredint(formData: FormData) {
  // try catch нужен для того, чтобы отловить ошибку
  try {
    console.log('formData', formData);
  } catch (error) {
    console.error('Error creating ingredint:', error);
    return { error: 'Error creating ingredint' };
  }
}
