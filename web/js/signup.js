/**
 * Created by StarkX on 16-Apr-18.
 */

$('#btnSignup').click(() => {
    let form = $('#formSignup');
    let emailFeedback = $('#formSignup #emailFeedback');
    let handleFeedback = $('#formSignup #handleFeedback');
    let passwordFeedback = $('#formSignup #passwordFeedback');
    let otherFeedback = $('#formSignup #otherFeedback');
    let btn = $('#btnSignup');
    let email = $('#formSignup #email');
    let handle = $('#formSignup #handle');
    let password = $('#formSignup #password');
    let other = $('#formSignup #other');
    let btnText = $('#formSignup #text');
    let spinner = $('#formSignup #signupSpinner');
    
    
    passwordFeedback.html('');
    emailFeedback.html('');
    otherFeedback.html('');
    handleFeedback.html('');
    form.removeClass('was-validated');
    email.removeClass('is-valid');
    email.removeClass('is-invalid');
    password.removeClass('is-valid');
    password.removeClass('is-invalid');
    other.removeClass('is-valid');
    other.removeClass('is-invalid');
    handle.removeClass('is-valid');
    handle.removeClass('is-invalid');
    
    let fields = {
        email : (email.val() + '').trim(),
        handle : (handle.val() + '').trim(),
        password : (password.val() + '')
    };
    let ef = false, pf = false, hf = false;
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
    
    if (!fields.handle) {
        handleFeedback.html('Enter your Username too!');
        hf = true;
    } else if (!validator.isAscii(fields.handle)) {
        handleFeedback.html('Oops, please try again');
        hf = true;
    } else if (fields.handle.length < 3) {
        handleFeedback.html('Username too short');
        hf = true;
    } else if (fields.handle.length > 10) {
        handleFeedback.html('Username too long');
        hf = true;
    }
    
    if (!ef && !pf && !hf) {
        btn.addClass('disabled');
        btnText.html('');
        spinner.removeClass('d-none');
        
        $.post('/api/auth/signup', fields)
            .done((res) => {
                if (res.head.code === 200) {
                    if (res.body[ 'auth-token' ]) {
                        localStorage.authToken = res.body[ 'auth-token' ];
                        location.href = '/onAuth?auth-token=' + localStorage.authToken;
                    }
                    else {
                        otherFeedback.html('Server Error');
                        other.addClass('is-invalid');
                    }
                }
                
            })
            .fail((res) => {
                let call = {
                    'handle' : [ handle, handleFeedback ],
                    'email' : [ email, emailFeedback ],
                    'password' : [ password, passwordFeedback ]
                };
                
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
                            otherFeedback.html('SignUp Fields Missing');
                            other.addClass('is-invalid');
                        }
                        else if (res.body.tag === 'invalid_user') {
                            otherFeedback.html('Invalid User/Password');
                            other.addClass('is-invalid');
                        }
                        else if (res.body.tag === 'missing_parameter') {
                            otherFeedback.html('Signup Fields Missing');
                            other.addClass('is-invalid');
                        }
                        else if (res.body.tag === 'invalid_parameter') {
                            call[ res.body.target ][ 0 ].addClass('is-invalid');
                            call[ res.body.target ][ 1 ].html('Invalid Value')
                        }
                        else if (res.body.tag === 'short_param') {
                            call[ res.body.target ][ 0 ].addClass('is-invalid');
                            call[ res.body.target ][ 1 ].html('Too Short!')
                        }
                        else if (res.body.tag === 'long_param') {
                            call[ res.body.target ][ 0 ].addClass('is-invalid');
                            call[ res.body.target ][ 1 ].html('Too Long!')
                        }
                        else if (res.body.tag === 'user_exists') {
                            if (res.body.target === 'handle') {
                                handleFeedback.html('Username already in use');
                                handle.addClass('is-invalid');
                            }
                            else {
                                emailFeedback.html('Email already in use');
                                email.addClass('is-invalid');
                            }
                        }
                    }
                }
                else if (res.head.code === 503 && res.head.msg === 'server_error') {
                    otherFeedback.html('Server Error');
                    other.addClass('is-invalid');
                }
                
                btn.removeClass('disabled');
                btnText.html('SignUp');
                spinner.addClass('d-none');
            })
            .always(() => {
            });
    }
    else {
        if (ef) email.addClass('is-invalid');
        if (pf) password.addClass('is-invalid');
        if (hf) handle.addClass('is-invalid');
    }
    form.addClass('was-validated');
});