'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    autoReservationSchema,
    type AutoReservationInput,
} from '@/lib/validation/reservation';

export function useAutoReservationForm() {
    const form = useForm<AutoReservationInput>({
        resolver: zodResolver(autoReservationSchema),
        defaultValues: {
            date: '',
            time: '',
            people: 2,
            name: '',
            phone: '',
            email: '',
            notes: '',
        },
    });

    return form;
}