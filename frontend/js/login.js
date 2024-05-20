function onChangeEmail() {
   toggleButtonsDisable();
   toggleEmailErrors();
}

function onChangePassword(){
    toggleButtonsDisable();
    togglePasswordErrors();
}

function isEmailValid(){
    const email = form.email().value;
    
    if (!email){
        return false;
    }
    
    return validateEmail(email);
}

function isPasswordValid(){
    const password = form.password().value;
    
    if (!password){
        return false;
    }

    return true;

}

function toggleEmailErrors(){
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";

    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
    
}

function togglePasswordErrors(){
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";

}

function toggleButtonsDisable(){
    const emailValid = isEmailValid();
    form.recoverPasswordBtn().disabled = !emailValid;

    const PasswordValid = isPasswordValid();
    form.loginBtn().disabled = !emailValid || !PasswordValid;
}

const form = {
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    loginBtn: () => document.getElementById('login-btn'),

    password: () => document.getElementById('password'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    recoverPasswordBtn: () => document.getElementById('recover-password-btn'),
    
}

// função para validar email
function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}