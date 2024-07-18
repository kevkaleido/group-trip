console.log(process.env);


// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };

firebase.initializeApp(firebaseConfig);

// Get elements
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close-button")[0];
const modalMessage = document.getElementById("modal-message");

// Show modal function
function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Close modal event
closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Add login event
btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, pass)
        .then(userCredential => {
            console.log('User logged in:', userCredential.user);
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Login error:', error);
            showModal('Login failed: ' + "Incorrect email or password");
        });
});

// Add signup event
btnSignUp.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    auth.createUserWithEmailAndPassword(email, pass)
        .then(userCredential => {
            console.log('User signed up:', userCredential.user);
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Signup error:', error);
            showModal('Signup failed: ' + error.message);
        });
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log('User is logged in:', firebaseUser);
    } else {
        console.log('User is not logged in');
    }
});
