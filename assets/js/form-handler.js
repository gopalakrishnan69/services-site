// Form Handler Module
class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.init();
    }

    init() {
        this.setupValidation();
        this.setupSubmitHandler();
        this.setupInputEnhancements();
    }

    setupValidation() {
        // Add real-time validation
        this.form.querySelectorAll('[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm()) {
                return;
            }

            await this.handleSubmit();
        });
    }

    setupInputEnhancements() {
        // Phone number formatting
        const phoneInput = this.form.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);
                e.target.value = value;
            });
        }

        // Auto-focus next input on Enter
        this.form.querySelectorAll('input, select').forEach((input, index, inputs) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && index < inputs.length - 1) {
                    e.preventDefault();
                    inputs[index + 1].focus();
                }
            });
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
                isValid = value.length >= 2;
                errorMessage = 'Please enter at least 2 characters';
                break;
            case 'select-one':
                isValid = value !== '';
                errorMessage = 'Please select an option';
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
        let isValid = true;
        
        this.form.querySelectorAll('[required]').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call (replace with actual fetch)
            await this.simulateApiCall(formData);
            
            // Show success
            this.showSuccessMessage();
            this.form.reset();
            
        } catch (error) {
            this.showErrorMessage();
        } finally {
            // Reset button
            this.setButtonLoading(submitBtn, false, originalContent);
        }
    }

    async simulateApiCall(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                Math.random() > 0.1 ? resolve() : reject();
            }, 1500);
        });
    }

    setButtonLoading(button, isLoading, originalContent = null) {
        if (isLoading) {
            button.dataset.originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.innerHTML = originalContent || button.dataset.originalContent;
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    showFieldError(field, message) {
        this.clearError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('error');
        
        // Scroll to error
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    clearError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    showSuccessMessage() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'form-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>Thank You!</h4>
                    <p>Your enquiry has been submitted successfully. We'll contact you shortly.</p>
                </div>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // Add to page
        this.form.parentNode.insertBefore(notification, this.form.nextSibling);

        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    showErrorMessage() {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'form-notification error';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <h4>Oops!</h4>
                    <p>Something went wrong. Please try again or call us directly.</p>
                </div>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // Add to page
        this.form.parentNode.insertBefore(notification, this.form.nextSibling);

        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        new FormHandler('enquiryForm');
    }
});

// In the validateField method, add email validation:
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
            isValid = value.length >= 2;
            errorMessage = 'Please enter at least 2 characters';
            break;
        case 'select-one':
            isValid = value !== '';
            errorMessage = 'Please select an option';
            break;
    }

    if (!isValid && field.required) {
        this.showFieldError(field, errorMessage);
        return false;
    }

    this.clearError(field);
    return true;
}