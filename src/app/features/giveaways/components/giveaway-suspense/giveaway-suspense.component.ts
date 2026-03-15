import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { LucideAngularModule, Trophy } from 'lucide-angular';

interface Stage {
    emoji: string;
    text: string;
}

const STAGES: Stage[] = [
    { emoji: '🔍', text: 'Verificando elegibilidad de participantes...' },
    { emoji: '📊', text: 'Analizando transacciones del período...' },
    { emoji: '🔀', text: 'Mezclando participantes aleatoriamente...' },
    { emoji: '🎯', text: 'El destino está a punto de decidir...' },
    { emoji: '✨', text: 'Seleccionando a los ganadores...' },
];

interface Ball {
    num: number;
    colorClass: string;
}

@Component({
    selector: 'app-giveaway-suspense',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './giveaway-suspense.component.html',
    styles: [`
        @keyframes orbit {
            from { transform: rotate(0deg) translateX(70px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
        }
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px 6px rgba(234, 179, 8, 0.45); }
            50%       { box-shadow: 0 0 48px 16px rgba(234, 179, 8, 0.75); }
        }
        @keyframes progressLoop {
            0%   { width: 4%; }
            70%  { width: 85%; }
            85%  { width: 90%; }
            100% { width: 93%; }
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
            50%       { opacity: 1;   transform: scale(1.4) rotate(180deg); }
        }
        @keyframes floatUp {
            0%, 100% { transform: translateY(0px)  scale(1);   opacity: 0.5; }
            50%       { transform: translateY(-20px) scale(1.1); opacity: 1;   }
        }

        .orbit-ball { position: absolute; }
        .orbit-ball-0 { animation: orbit 3.5s linear 0s      infinite; }
        .orbit-ball-1 { animation: orbit 3.5s linear -0.875s infinite; }
        .orbit-ball-2 { animation: orbit 3.5s linear -1.75s  infinite; }
        .orbit-ball-3 { animation: orbit 3.5s linear -2.625s infinite; }

        .trophy-glow  { animation: pulseGlow 2s ease-in-out infinite; }
        .progress-bar { animation: progressLoop 4.5s ease-in-out infinite; }

        .particle { position: absolute; pointer-events: none; user-select: none; }
        .p1 { animation: twinkle 1.5s ease-in-out 0.0s  infinite; top:  8%; left: 12%; }
        .p2 { animation: twinkle 2.1s ease-in-out 0.3s  infinite; top: 14%; left: 82%; }
        .p3 { animation: twinkle 1.8s ease-in-out 0.7s  infinite; top: 72%; left:  8%; }
        .p4 { animation: twinkle 2.3s ease-in-out 1.1s  infinite; top: 77%; left: 86%; }
        .p5 { animation: floatUp  2.0s ease-in-out 0.2s  infinite; top: 42%; left:  4%; }
        .p6 { animation: floatUp  2.5s ease-in-out 0.6s  infinite; top: 38%; left: 93%; }
    `]
})
export class GiveawaySuspenseComponent implements OnInit, OnDestroy {
    private _stageIndex = signal(0);
    private intervalId: ReturnType<typeof setInterval> | null = null;

    readonly stage = computed(() => STAGES[this._stageIndex()]);

    readonly orbitBalls: Ball[] = [
        { num: 7,  colorClass: 'bg-green-500' },
        { num: 42, colorClass: 'bg-yellow-500' },
        { num: 13, colorClass: 'bg-blue-500' },
        { num: 88, colorClass: 'bg-pink-500' },
    ];

    readonly bottomBalls: Ball[] = [
        { num: 3,  colorClass: 'bg-purple-500' },
        { num: 27, colorClass: 'bg-red-500' },
        { num: 55, colorClass: 'bg-cyan-500' },
        { num: 19, colorClass: 'bg-orange-500' },
        { num: 61, colorClass: 'bg-green-600' },
        { num: 34, colorClass: 'bg-indigo-500' },
    ];

    readonly icons = { Trophy };

    ngOnInit(): void {
        this.intervalId = setInterval(() => {
            this._stageIndex.update(i => (i + 1) % STAGES.length);
        }, 1000);
    }

    ngOnDestroy(): void {
        if (this.intervalId) clearInterval(this.intervalId);
    }
}
