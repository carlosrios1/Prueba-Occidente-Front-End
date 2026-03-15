import {
    Component,
    ElementRef,
    ViewChild,
    OnDestroy,
    AfterViewInit,
    ChangeDetectionStrategy,
    inject,
    NgZone,
} from '@angular/core';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
    spin: number;
    width: number;
    height: number;
    color: string;
    shape: 'rect' | 'circle' | 'ribbon';
    opacity: number;
    gravity: number;
    wobble: number;
    wobbleSpeed: number;
    wobblePhase: number;
}

const COLORS = [
    '#f59e0b', '#10b981', '#3b82f6', '#ec4899',
    '#8b5cf6', '#f97316', '#06b6d4', '#84cc16',
    '#ef4444', '#a855f7', '#14b8a6', '#fbbf24',
];

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function createParticle(canvasWidth: number): Particle {
    const shape = Math.random() < 0.5 ? 'rect' : Math.random() < 0.6 ? 'circle' : 'ribbon';
    return {
        x: randomBetween(0, canvasWidth),
        y: randomBetween(-80, -10),
        vx: randomBetween(-3, 3),
        vy: randomBetween(2, 6),
        angle: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-0.15, 0.15),
        width: shape === 'circle' ? randomBetween(6, 12) : randomBetween(8, 16),
        height: shape === 'circle' ? 0 : (shape === 'ribbon' ? randomBetween(2, 5) : randomBetween(6, 14)),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
        opacity: 1,
        gravity: randomBetween(0.05, 0.15),
        wobble: 0,
        wobbleSpeed: randomBetween(0.04, 0.1),
        wobblePhase: randomBetween(0, Math.PI * 2),
    };
}

@Component({
    selector: 'app-giveaway-confetti',
    standalone: true,
    template: `<canvas #canvas class="fixed inset-0 w-full h-full pointer-events-none z-[10002]"></canvas>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiveawayConfettiComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    private zone = inject(NgZone);
    private particles: Particle[] = [];
    private animFrameId: number | null = null;
    private spawnTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private ctx!: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
        const canvas = this.canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.ctx = canvas.getContext('2d')!;

        // Explosión inicial de partículas
        for (let i = 0; i < 180; i++) {
            this.particles.push(createParticle(canvas.width));
        }

        // Oleada secundaria a los 600 ms
        this.spawnTimeoutId = setTimeout(() => {
            for (let i = 0; i < 100; i++) {
                this.particles.push(createParticle(canvas.width));
            }
        }, 600);

        // Ejecutar fuera de Angular zone para no disparar CD innecesariamente
        this.zone.runOutsideAngular(() => this.loop());
    }

    ngOnDestroy(): void {
        if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
        if (this.spawnTimeoutId !== null) clearTimeout(this.spawnTimeoutId);
    }

    private loop(): void {
        const canvas = this.canvasRef.nativeElement;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Física
            p.vy += p.gravity;
            p.vx += Math.sin(p.wobblePhase + p.wobble) * 0.08;
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.spin;
            p.wobble += p.wobbleSpeed;

            // Fade out cuando está en el 70% inferior
            if (p.y > canvas.height * 0.7) {
                p.opacity -= 0.012;
            }

            // Eliminar partícula
            if (p.opacity <= 0 || p.y > canvas.height + 40) {
                this.particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;

            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === 'rect') {
                ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            } else {
                // ribbon: rectángulo muy delgado y alargado
                ctx.fillRect(-p.width / 2, -p.height / 2, p.width * 1.8, p.height);
            }

            ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animFrameId = requestAnimationFrame(() => this.loop());
        }
    }
}
