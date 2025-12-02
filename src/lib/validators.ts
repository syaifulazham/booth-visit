import { z } from 'zod'

// Admin Login Schema
export const adminLoginSchema = z.object({
  email: z.string().email('Email tidak sah / Invalid email'),
  password: z.string().min(6, 'Kata laluan sekurang-kurangnya 6 aksara / Password must be at least 6 characters'),
})

// Booth Schema
export const boothSchema = z.object({
  boothNumber: z.string().optional(),
  boothName: z.string().min(1, 'Nama gerai diperlukan / Booth name is required'),
  ministry: z.string().min(1, 'Kementerian diperlukan / Ministry is required'),
  agency: z.string().min(1, 'Agensi diperlukan / Agency is required'),
  abbreviationName: z.string().min(1, 'Singkatan diperlukan / Abbreviation is required'),
  picName: z.string().optional(),
  picPhone: z.string().optional(),
  picEmail: z.string().email('Email tidak sah / Invalid email').optional().or(z.literal('')),
})

// Visitor Registration Schema
export const visitorSchema = z.object({
  name: z.string().min(2, 'Nama penuh diperlukan / Full name is required'),
  phone: z.string().min(10, 'No. telefon tidak sah / Invalid phone number').max(15, 'No. telefon terlalu panjang / Phone number too long'),
  email: z.string().email('Email tidak sah / Invalid email').optional().or(z.literal('')),
  state: z.enum([
    'JOHOR',
    'KEDAH',
    'KELANTAN',
    'MELAKA',
    'NEGERI SEMBILAN',
    'PAHANG',
    'PULAU PINANG',
    'PERAK',
    'PERLIS',
    'SELANGOR',
    'TERENGGANU',
    'SABAH',
    'SARAWAK',
    'WP KUALA LUMPUR',
    'WP LABUAN',
    'WP PUTRAJAYA',
  ], {
    errorMap: () => ({ message: 'Sila pilih negeri / Please select state' }),
  }),
  gender: z.enum(['Lelaki', 'Perempuan'], {
    errorMap: () => ({ message: 'Sila pilih jantina / Please select gender' }),
  }),
  age: z.number()
    .int('Umur mesti nombor bulat / Age must be a whole number')
    .min(1, 'Umur tidak sah / Invalid age')
    .max(120, 'Umur tidak sah / Invalid age'),
  visitorType: z.enum([
    'Awam',
    'Kakitangan Kerajaan',
    'Kakitangan Swasta',
    'Pelajar',
    'Pensyarah/Guru',
    'Lain-lain',
  ], {
    errorMap: () => ({ message: 'Sila pilih jenis pelawat / Please select visitor type' }),
  }),
  sektor: z.enum([
    'Pertanian',
    'Penternakan',
    'Perindustrian',
    'Automotif',
    'Teknologi',
    'Pendidikan',
    'Kesihatan',
    'Lain-lain',
  ], {
    errorMap: () => ({ message: 'Sila pilih sektor / Please select sector' }),
  }),
})

// Visit Log Schema
export const visitLogSchema = z.object({
  hashcode: z.string().min(1, 'Hashcode diperlukan / Hashcode is required'),
})

// Event Schema
export const eventSchema = z.object({
  name: z.string().min(1, 'Nama acara diperlukan / Event name is required'),
  slogan: z.string().optional(),
  venue: z.string().min(1, 'Tempat diperlukan / Venue is required'),
  dateStart: z.string().min(1, 'Tarikh mula diperlukan / Start date is required'),
  dateEnd: z.string().min(1, 'Tarikh tamat diperlukan / End date is required'),
  description: z.string().optional(),
})

// Rating Schema
export const ratingSchema = z.object({
  visitId: z.string().min(1, 'Visit ID diperlukan / Visit ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(500, 'Komen terlalu panjang / Comment too long').optional(),
})

// Export types
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type BoothInput = z.infer<typeof boothSchema>
export type VisitorInput = z.infer<typeof visitorSchema>
export type VisitLogInput = z.infer<typeof visitLogSchema>
export type EventInput = z.infer<typeof eventSchema>
export type RatingInput = z.infer<typeof ratingSchema>
