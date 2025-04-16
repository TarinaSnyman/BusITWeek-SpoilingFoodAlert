document.addEventListener('DOMContentLoaded', () => {
    let passwordInput = document.querySelector("#password");
    let pic = document.querySelector("#pic");
    const togglePasswordIcon = document.querySelector("#togglePassword");

    // Event listener for password image 
    document.getElementById('password').addEventListener('focus', function() {
        pic.src = "../Images/eyesclosed.png";
    });
    document.getElementById('password').addEventListener('blur', function() {
        pic.src = "../Images/login.png";
    });

    // Event listener for password visibility 
    togglePasswordIcon.addEventListener('click', () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.classList.replace("bx-lock-alt", "bx-lock-open-alt");
            pic.src = "../Images/login.png";
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.classList.replace("bx-lock-open-alt", "bx-lock-alt");
            pic.src = "../Images/eyesclosed.png";
        }
    });

    // Login form submission
    document.getElementById('loginBox').addEventListener('submit', async function(event) {
        event.preventDefault();

        let userName = document.getElementById('user').value.trim();
        let password = document.getElementById('password').value.trim();

        try {
            // Send login request to backend
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: userName, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Successful login
                localStorage.setItem('name', data.firstName); // Store firstName
                window.location.href = 'home.html'; // Redirect to home page
            } else {
                // Display error message
                displayErrorMessage();
            }
        } catch (error) {
            console.error('Login error:', error);
            displayErrorMessage();
        }
    });
});

//function that changes the image and appends the error message paragraph to the container
function displayErrorMessage() {
    let container = document.querySelector("#message");
    container.innerHTML = '';
    let paragraph = document.createElement('p');
    paragraph.textContent = "Username or password is incorrect. Please try again";
    container.appendChild(paragraph);

    // Styling
    paragraph.style.color = "red";
    paragraph.style.fontWeight = "bold";
    paragraph.style.padding = "10px";
    paragraph.style.textAlign = "center";
    let pic = document.querySelector("#pic");
    pic.src = "../Images/error.png";
    document.getElementById('user').value = '';
    document.getElementById('password').value = '';
}