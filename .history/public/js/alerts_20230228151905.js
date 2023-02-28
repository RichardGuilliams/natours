// type is success or error
export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if(el) el.parentElement.removeChild(el);
}

export const showAlert = (type, message, time = 5) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${message}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}