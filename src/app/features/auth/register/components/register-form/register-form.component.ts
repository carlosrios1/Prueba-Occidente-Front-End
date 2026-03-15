import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, User, Lock, Eye, EyeOff, TriangleAlert } from 'lucide-angular';

export interface RegisterCredentials {
    username: string;
    password: string;
}

@Component({
    selector: 'app-register-form',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink],
    templateUrl: './register-form.component.html'
})
export class RegisterFormComponent {
    @Input() isLoading = false;
    @Input() mensajeError = '';

    @Output() submitRegister = new EventEmitter<RegisterCredentials>();

    readonly UserIcon = User;
    readonly LockIcon = Lock;
    readonly EyeIcon = Eye;
    readonly EyeOffIcon = EyeOff;
    readonly TriangleAlert = TriangleAlert;

    // Regex: mínimo 8 chars, al menos una letra, un número y un carácter especial
    readonly passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    username = '';
    password = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;

    validacionUsuario = signal('');
    validacionContrasena = signal('');

    get passwordsMatch(): boolean {
        return this.password === this.confirmPassword;
    }

    get passwordValid(): boolean {
        return this.passwordPattern.test(this.password);
    }

    onSubmit(form: NgForm, event: Event): void {
        event.preventDefault();
        if (form.invalid || !this.passwordsMatch || !this.passwordValid) return;
        this.submitRegister.emit({ username: this.username, password: this.password });
    }
}
