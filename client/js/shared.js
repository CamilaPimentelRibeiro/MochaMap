(() => {
    // define theme
    //    const setStyle = (style) => {
    //     const link = document.createElement('link');
    //     link.rel = 'stylesheet';
    //     link.href = style;
    //     document.head.appendChild(link);
    // };

    // Define header NAV + Login and Register Button

    const setHeader = () => {

        const header = document.createElement('header');
        header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid justify-content-center">
                <button class="navbar-toggler mx-auto" type="button" data-bs-toggle="collapse"
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
                            <a class="nav-link" aria-current="page" href="home.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="find.html">Coffee Map Here</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="user.html">My Account</a>
                        </li>
                        <li class="nav-item">
                        <button class="btn btn-primary" id="logoutButton">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`;


        document.body.insertBefore(header, document.body.firstChild);

        const handleLogOutButtonClick = () => {
            console.log("Logout clicked!");
        };

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', handleLogOutButtonClick);
    };

    //Login Function
    const handleLogOutButtonClick = () => {
        // Redirect to Login Page
        window.location.href = "index.html";
    };

    // Attach event listener to login button
    const loginButton = document.querySelector("#logoutButton");
    if (loginButton) {
        loginButton.addEventListener("click", handleLogOutButtonClick);
    }

    function showProfileLoading() {
        document.querySelector('#profile_loading').style.display = 'block';
    }

    function hideProfileLoading() {
        document.querySelector('#profile_loading').style.display = 'none';
    }

    //Delete user Function

    const deleteUser = () => {
        fetch('/delete', { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    // If server responds with a bad HTTP status, throw an error
                    throw new Error('Network response was not good');
                }
                return response.text(); // Assuming server sends back a JSON response
            })
            .then(data => {
                console.log('Success:', data);
                // Here you can update the UI to remove the deleted user or show a success message
                alert('User deleted successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete user: ' + error.message);
            });

    }
    const deleteButton = document.querySelector("#deleteButton");
    if (deleteButton) {
        deleteButton.addEventListener("click", deleteUser);
    }

    //get profile info
    const getProfileInfo = async() => {
        showProfileLoading()
        fetch('/profile')
            .then(response => response.json())
            .then(data => {
                const profile_container = document.querySelector('#profile_name');
                const points_container = document.querySelector('#points_level');
                const member_container = document.querySelector('#member_type');
                if (data) {
                    console.log("you got the profile data")
                    console.log(data);

                    profile_container.textContent = `${data.firstName} ${data.lastName}`;
                    points_container.textContent = `${data.role}`;
                    member_container.textContent = `Points: ${data.points}`;
                    hideProfileLoading();
                }
            })
            .catch(error => {
                console.error('Error fetching cafe data:', error);
            });
    };


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
        getProfileInfo();
        // setStyle('../css/style.css');
        // setStyle('../css/pulse.min.css');

    });
})();