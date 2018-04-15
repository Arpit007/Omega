/**
 * Created by StarkX on 15-Apr-18.
 */

$('#btnLogin').click(() => {
    let form = $('#formLogin');
    let emailFeedback = $('#formLogin #emailFeedback');
    let passwordFeedback = $('#formLogin #passwordFeedback');
    let otherFeedback = $('#formLogin #otherFeedback');
    let btn = $('#btnLogin');
    let email = $('#formLogin #email');
    let password = $('#formLogin #password');
    let other = $('#formLogin #other');
    let btnText = $('#btnLogin #text');
    let spinner = $('#btnLogin #loginSpinner');
    
    
    passwordFeedback.html('');
    emailFeedback.html('');
    otherFeedback.html('hello there');
    form.removeClass('was-validated');
    email.removeClass('is-valid');
    email.removeClass('is-invalid');
    password.removeClass('is-valid');
    password.removeClass('is-invalid');
    other.removeClass('is-valid');
    other.removeClass('is-invalid');
    
    let fields = {
        email : (email.val() + '').trim(),
        password : (password.val() + '')
    };
    let ef = false, pf = false;
    if (!fields.email) {
        emailFeedback.html('Oops, you missed this one');
        ef = true;
    } else if (!validator.isAscii(fields.email)) {
        emailFeedback.html('Oops, please try again');
        ef = true;
    }
    
    if (!fields.password) {
        passwordFeedback.html('Enter your password too!');
        pf = true;
    } else if (!validator.isAscii(fields.password)) {
        passwordFeedback.html('Oops, please try again');
        pf = true;
    } else if (fields.password.length < 8) {
        passwordFeedback.html('Password too short');
        pf = true;
    } else if (fields.password.length > 16) {
        passwordFeedback.html('Password too long');
        pf = true;
    }
    
    if (!ef && !pf) {
        btn.addClass('disabled');
        btnText.html('');
        spinner.removeClass('d-none');
        
        $.post('/api/auth/login', fields)
            .done((res) => {
                if (res.head.code === 200) {
                    if (res.body[ 'auth-token' ]) {
                        localStorage.authToken = res.body[ 'auth-token' ];
                        location.href = '/onLogin?auth-token=' + localStorage.authToken;
                    }
                    else {
                        otherFeedback.html('Server Error');
                        other.addClass('is-invalid');
                    }
                }
                
            })
            .fail((res) => {
                res = res.responseJSON;
                if (res.head.code === 400) {
                    if (res.head.msg === 'unsupported_client') {
                        if (res.body.tag === 'user_not_authenticated') {
                            otherFeedback.html('UnAuthorised');
                            other.addClass('is-invalid');
                        }
                    }
                    else if (res.head.msg === 'invalid_request') {
                        if (res.body.tag === 'missing_parameter') {
                            otherFeedback.html('Login Fields Missing');
                            other.addClass('is-invalid');
                        }
                        else if (res.body.tag === 'invalid_user') {
                            otherFeedback.html('Invalid User/Password');
                            other.addClass('is-invalid');
                        }
                    }
                }
                else if (res.head.code === 503 && res.head.msg === 'server_error') {
                    if (res.body.tag === 'missing_parameter') {
                        otherFeedback.html('Login Fields Missing');
                        other.addClass('is-invalid');
                    }
                }
                
                btn.removeClass('disabled');
                btnText.html('Login');
                spinner.addClass('d-none');
            })
            .always(() => {
            });
    }
    else {
        if (ef) email.addClass('is-invalid');
        if (pf) password.addClass('is-invalid');
    }
    form.addClass('was-validated');
});