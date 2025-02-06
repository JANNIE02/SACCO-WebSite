// Admissions Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // File Upload Preview
    const fileInput = document.getElementById('documents');
    const fileList = document.getElementById('fileList');

    if (fileInput && fileList) {
        fileInput.addEventListener('change', function() {
            fileList.innerHTML = '';
            Array.from(this.files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <small>(${(file.size / 1024).toFixed(2)} KB)</small>
                `;
                fileList.appendChild(fileItem);
            });
        });
    }

    // Form Validation
    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        admissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = admissionForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Your application has been submitted successfully!</p>
                `;
                admissionForm.appendChild(successMessage);

                // Reset form after 3 seconds
                setTimeout(() => {
                    admissionForm.reset();
                    successMessage.remove();
                    fileList.innerHTML = '';
                }, 3000);
            }
        });
    }

    // Process Timeline Animation
    const processSteps = document.querySelectorAll('.process-step');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    processSteps.forEach(step => processObserver.observe(step));
});