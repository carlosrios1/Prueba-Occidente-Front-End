import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LucideAngularModule, User, Lock, Eye, EyeOff, TriangleAlert } from 'lucide-angular';

export interface LoginCredentials {
    username: string;
    password: string;
}

@Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
    @Input() isLoading = false;
    @Input() mensajeError = '';

    @Output() submitLogin = new EventEmitter<LoginCredentials>();

    readonly UserIcon = User;
    readonly LockIcon = Lock;
    readonly EyeIcon = Eye;
    readonly EyeOffIcon = EyeOff;
    readonly TriangleAlert = TriangleAlert;

    username = '';
    password = '';
    showPassword = false;
    rememberDevice = false;

    validacionUsuario = signal('');
    validacionContrasena = signal('');

    onSubmit(form: NgForm, event: Event): void {
        event.preventDefault();
        if (form.invalid) return;
        this.submitLogin.emit({ username: this.username, password: this.password });
    }
}
