import { z } from "zod";

export const LoginSchema = z.object({
  telefono: z.string()
    .refine(data => data.trim() !== '', {
      message: 'El correo o Telefono es requerido',
    })
    .refine(data => data.length >= 10 && data.length <= 90, {
      message: 'El correo o Telefono debe ser entre de al menos 10 caracteres',
    }),
    password: z.string()
    .refine(data => data.trim() !== '', {
      message: 'La contraseña es requerida',
    })
    .refine(data => data.length >= 8, {
      message: 'La contraseña debe tener al menos 8 caracteres',
    })
    .refine(data => /[A-Z]/.test(data), {
      message: 'La contraseña debe contener al menos una letra mayúscula',
    })
    .refine(data => /[a-z]/.test(data), {
      message: 'La contraseña debe contener al menos una letra minúscula',
    })
    .refine(data => /\d/.test(data), {
      message: 'La contraseña debe contener al menos un número',
    })
    .refine(data => /[!@#$%^&*]/.test(data), {
      message: 'La contraseña debe contener al menos uno de los siguientes caracteres especiales: !, @, #, $, %, ^, &, *',
    }),
})


/*

export const registerSchema = z.object({
  nombre: z.string({
    required_error: 'Username is required',
    min: 3,
    max: 50,
    nonempty: true,
  }),
  telefono: z.string({
    required_error: 'Phone number is required',
    min: 10,
    max: 15,
    nonempty: true,
  }),
  contraseña: z.string({
    required_error: 'Password is required',
    min: 8,
    max: 20,
    nonempty: true,
  }),
});

*/