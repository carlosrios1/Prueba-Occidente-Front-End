import { Pipe, PipeTransform } from '@angular/core';
import {
    User,
    Calendar,
    CheckCircle2,
    AlertCircle,
    FileText,
    Mail,
    Phone,
    MessageSquare,
    DollarSign,
    Package,
    LucideIconData,
} from 'lucide-angular';

export interface TimelineEventStyle {
    icon: LucideIconData;
    bgColor: string;
    borderColor: string;
    iconColor: string;
}

@Pipe({
    name: 'timelineEvent',
    standalone: true
})
export class TimelineEventPipe implements PipeTransform {

    private eventStyles: Record<string, TimelineEventStyle> = {
        'user': {
            icon: User,
            bgColor: 'bg-blue-50 dark:bg-blue-900',
            borderColor: 'border-blue-300 dark:border-blue-700',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        'meeting': {
            icon: Calendar,
            bgColor: 'bg-purple-50 dark:bg-purple-900',
            borderColor: 'border-purple-300 dark:border-purple-700',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        'completed': {
            icon: CheckCircle2,
            bgColor: 'bg-green-50 dark:bg-green-900',
            borderColor: 'border-green-300 dark:border-green-700',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        'alert': {
            icon: AlertCircle,
            bgColor: 'bg-red-50 dark:bg-red-900',
            borderColor: 'border-red-300 dark:border-red-700',
            iconColor: 'text-red-600 dark:text-red-400'
        },
        'document': {
            icon: FileText,
            bgColor: 'bg-amber-50 dark:bg-amber-900',
            borderColor: 'border-amber-300 dark:border-amber-700',
            iconColor: 'text-amber-600 dark:text-amber-400'
        },
        'email': {
            icon: Mail,
            bgColor: 'bg-cyan-50 dark:bg-cyan-900',
            borderColor: 'border-cyan-300 dark:border-cyan-700',
            iconColor: 'text-cyan-600 dark:text-cyan-400'
        },
        'call': {
            icon: Phone,
            bgColor: 'bg-emerald-50 dark:bg-emerald-900',
            borderColor: 'border-emerald-300 dark:border-emerald-700',
            iconColor: 'text-emerald-600 dark:text-emerald-400'
        },
        'message': {
            icon: MessageSquare,
            bgColor: 'bg-indigo-50 dark:bg-indigo-900',
            borderColor: 'border-indigo-300 dark:border-indigo-700',
            iconColor: 'text-indigo-600 dark:text-indigo-400'
        },
        'payment': {
            icon: DollarSign,
            bgColor: 'bg-teal-50 dark:bg-teal-900',
            borderColor: 'border-teal-300 dark:border-teal-700',
            iconColor: 'text-teal-600 dark:text-teal-400'
        },
        'delivery': {
            icon: Package,
            bgColor: 'bg-orange-50 dark:bg-orange-900',
            borderColor: 'border-orange-300 dark:border-orange-700',
            iconColor: 'text-orange-600 dark:text-orange-400'
        }
    };

    transform(eventType: string): TimelineEventStyle {
        return this.eventStyles[eventType] || this.eventStyles['user'];
    }
}