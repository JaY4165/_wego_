import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: 'Email must be at least 2 characters.',
    })
    .max(70, {
      message: 'Email must be at most 70 characters.',
    })
    .email({
      message: 'Invalid email format.',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(70, { message: 'Password must be at most 70 characters.' })
    .refine(
      (value) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
          value,
        );
      },
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
      },
    ),
});

export const signupFormSchema = z
  .object({
    email: z
      .string()
      .toLowerCase()
      .min(2, {
        message: 'Email must be at least 2 characters.',
      })
      .max(70, {
        message: 'Email must be at most 70 characters.',
      })
      .email({
        message: 'Invalid email format.',
      }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .max(70, { message: 'Password must be at most 70 characters.' })
      .refine(
        (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            value,
          );
        },
        {
          message:
            'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        },
      ),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters.' })
      .max(70, { message: 'Confirm Password must be at most 70 characters.' })
      .refine(
        (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
            value,
          );
        },
        {
          message: 'Passwords must match!',
        },
      ),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    },
  );


export const tripPlannerFormSchema = z.object({
  tripDays: z.coerce
    .number()
    .min(1, {
      message: 'Trip days must be at least 1',
    })
    .max(3, {
      message: 'Trip days must be at most 3',
    }),
  placesPerDay: z.coerce
    .number()
    .min(1, {
      message: 'Trip days must be at least 1',
    })
    .max(3, {
      message: 'Trip days must be at most 3',
    }),
  country: z.string({
    required_error: "Please select a country.",
  }),
  state: z.string({
    required_error: "Please select a state.",
  }),
  city: z.string({
    required_error: "Please select a city.",
  }),
});