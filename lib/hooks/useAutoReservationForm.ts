'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {autoReservationSchema} from '@/lib/validation/reservation';

export function useAutoReservationForm() {
    const form = useForm<z.input<typeof autoReservationSchema>>({
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