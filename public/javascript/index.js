// BOOTSTRAP
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

const navbarToggler = document.querySelector('.navbar-toggler');
const container = document.querySelector('.container');

navbarToggler.addEventListener('click',function(){
    if(!navbarToggler.classList.contains('collapsed')){
        container.style.paddingTop = '220px';
    } else{
        container.style.paddingTop = '80px';
    }
});