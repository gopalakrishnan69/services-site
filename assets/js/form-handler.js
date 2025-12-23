// Simple form validation and handling
class FormHandler {
    constructor() {
        this.initFormValidation();
    }

    initFormValidation() {
        const form = document.getElementById('enquiryForm');
        if (!form) return;

        // Add input event listeners for real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'tel':
                isValid = /^[0-9]{10}$/.test(value);
                errorMessage = 'Please enter a valid 10-digit phone number';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'text':
                isValid = value.length >= 3;
                errorMessage = 'Please enter at least 3 characters';
                break;
            case 'select-one':
                isValid = value !== '';
                errorMessage = 'Please select an option';
                break;
            default:
                // Handle textarea
                if (field.tagName === 'TEXTAREA') {
                    isValid = value.length >= 10;
                    errorMessage = 'Please describe the issue in at least 10 characters';
                }
                break;
        }

        if (!isValid && field.required) {
            this.showFieldError(field, errorMessage);
            return false;
        }

        this.clearError(field);
        return true;
    }

    validateForm() {
        const form = document.getElementById('enquiryForm');
        if (!form) return true;

        // Get all required fields including textarea
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        this.clearError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#dc2626';
    }

    clearError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '#d1d5db';
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
});