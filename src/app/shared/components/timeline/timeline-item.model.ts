export type TimelineEventType =
    | 'user'
    | 'meeting'
    | 'completed'
    | 'alert'
    | 'document'
    | 'email'
    | 'call'
    | 'message'
    | 'payment'
    | 'delivery';

export interface TimelineItem {
    title: string;
    description?: string;
    date: string;
    user?: string;
    type: TimelineEventType;
}