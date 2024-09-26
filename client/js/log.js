(() => {
    const setHeader = () => {
        const header = document.createElement('header');
        header.innerHTML = `
    <nav class="navbar navbar-expand-lg" data-bs-theme="dark">
        <div class="container-fluid justify-content-center bg-primary">
            <!-- Toggle -->
            <!-- Logo -->
            <div class="offset-md-3">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <!-- Nav Item -->
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <a class="navbar-brand mb-2 mb-lg-0 ms-auto h6" data-page="home">
                    <img src="img/MochaMAp.png" alt="Bootstrap" width="100"
                        class="py-1 d-inline-block align-middle my-2">
                </a>
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 h6">
                        <li class="nav-item ml-4">
                            
                        </li>
                        <li class="nav-item ml-4">
                            
                        </li>
                        <li class="nav-item ml-4">
                            
                        </li>
                    </ul>
                
                
                </div>
            </div>
        </div>
    </nav>`;
        // Create the form element
        const form = document.createElement('form');
        form.classList.add('h3', 'text-white', 'ms-auto', 'justify-content-center', 'offset-md-4', 'mt-1');

        // Create the "Login" button
        const loginButton = document.createElement('button');
        loginButton.type = 'button';
        loginButton.classList.add('btn', 'btn-info');
        loginButton.textContent = 'Login';
        loginButton.id = 'login-button';

        // Create the "Register" button
        const registerButton = document.createElement('button');
        registerButton.type = 'button';
        registerButton.classList.add('btn', 'btn-warning');
        registerButton.textContent = 'Register';
        registerButton.id = 'register-button';

        // Add elements to the form
        form.appendChild(registerButton);
        form.appendChild(loginButton);

        const navContainer = header.querySelector('.container-fluid');
        navContainer.appendChild(form);

        // Attach event listeners to buttons
        loginButton.addEventListener('click', handleLoginButtonClick);
        registerButton.addEventListener('click', handleRegisterButtonClick); // Added

        document.body.insertBefore(header, document.body.firstChild);
    };


    //Login Function
    const handleLoginButtonClick = () => {
        // Redirect to Login Page
        window.location.href = "index.html";
    };

    // Attach event listener to login button
    const loginButton = document.querySelector("#login-button");
    if (loginButton) {
        loginButton.addEventListener("click", handleLoginButtonClick);
    }

    //Register Function
    const handleRegisterButtonClick = () => {
        // Redirect to Register Page
        window.location.href = "register.html";
    };

    // Attach event listener to register button
    const registerButton = document.querySelector("#register-button");
    if (registerButton) {
        registerButton.addEventListener("click", handleRegisterButtonClick);
    }

    // Singleton Modal Warning
    const ModalWarning = (() => {
        let instance;

        function createInstance() {
            const noticeDialog = document.getElementById('noticeDialog');

            function showModal() {
                if (noticeDialog && !getCookie("popupShown")) { // Verifica se o cookie "popupShown" não está presente
                    noticeDialog.showModal();

                    const noticeButton = document.querySelector("#noticeButton");
                    noticeButton.addEventListener('click', () => {
                        const agreeCheckbox = document.querySelector("#agree");
                        if (agreeCheckbox && agreeCheckbox.checked) {
                            noticeDialog.close();
                            setCookie("popupShown", "true", 365); // Define o cookie "popupShown" por 365 dias
                        }
                    });
                }
            }

            return {
                showModal: showModal
            };
        }

        return {
            getInstance: function() {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();

    // cookies
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString();
    }

    function getCookie(name) {
        const keyValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    // Call modal and get instance
    const modalWarning = ModalWarning.getInstance();
    modalWarning.showModal();

    // Define footer
    const setFooter = () => {
        const footer = document.createElement('footer');
        footer.classList.add('bg-primary', 'vh-075', 'fixed-bottom');
        footer.id = 'footer';
        footer.innerHTML = `
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-auto">
                    <div class="fs-6 d-flex justify-content-center align-items-center mt-3">
                        <p class="text-white mb-0 mx-3 ">FOLLOW US</p>
                        <a href="https://www.youtube.com" target="_blank" class="text-decoration-none">
                            <i class="bi bi-youtube mx-1 bg-warning px-2 py-1 text-white rounded-1"></i>
                        </a>
                        <a href="https://www.twitter.com" target="_blank" class="text-decoration-none">
                            <i class="bi bi-twitter mx-1 px-2 py-1 text-white rounded-1 bg-warning"></i>
                        </a>
                        <a href="https://www.whatsapp.com" target="_blank" class="text-decoration-none">
                            <i class="bi bi-whatsapp mx-1 px-2 py-1 text-white rounded-1 bg-warning"></i>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" class="text-decoration-none">
                            <i class="bi bi-instagram mx-1 px-2 py-1 text-white rounded-1 bg-warning"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
        document.body.appendChild(footer);
        addCopyright();
    };

    //add copyright text
    const addCopyright = () => {
        const year = new Date().getFullYear();
        const copyright = document.createElement('div');
        copyright.classList.add('mb-0', 'text-small', 'text-white', 'text-center');
        copyright.innerHTML = `© ${year} MochaMap. All Rights Reserved.`;
        document.getElementById('footer').appendChild(copyright);
    };
    window.addEventListener('DOMContentLoaded', () => {
        setHeader();
        setFooter();
    });
})();