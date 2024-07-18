/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./auth.js":
/*!*****************!*\
  !*** ./auth.js ***!
  \*****************/
/***/ (() => {

eval("console.log(\"MISSING_ENV_VAR\");\n\n\n// Initialize Firebase\nconst firebaseConfig = {\n    apiKey: \"AIzaSyBXPFdQ4YNOyPjqTMwNssURy2nGO9x9DDo\",\n    authDomain: \"split-8e44a.firebaseapp.com\",\n    projectId: \"split-8e44a\",\n    storageBucket: \"split-8e44a.appspot.com\",\n    messagingSenderId: \"334620063763\",\n    appId: \"1:334620063763:web:b75fbded49e40d1d5de7e6\",\n    measurementId: \"G-M3THEHE4J3\"\n  };\n\nfirebase.initializeApp(firebaseConfig);\n\n// Get elements\nconst txtEmail = document.getElementById('txtEmail');\nconst txtPassword = document.getElementById('txtPassword');\nconst btnLogin = document.getElementById('btnLogin');\nconst btnSignUp = document.getElementById('btnSignUp');\nconst modal = document.getElementById(\"myModal\");\nconst closeBtn = document.getElementsByClassName(\"close-button\")[0];\nconst modalMessage = document.getElementById(\"modal-message\");\n\n// Show modal function\nfunction showModal(message) {\n    modalMessage.textContent = message;\n    modal.style.display = \"block\";\n}\n\n// Close modal event\ncloseBtn.onclick = function() {\n    modal.style.display = \"none\";\n}\n\nwindow.onclick = function(event) {\n    if (event.target == modal) {\n        modal.style.display = \"none\";\n    }\n}\n\n// Add login event\nbtnLogin.addEventListener('click', e => {\n    const email = txtEmail.value;\n    const pass = txtPassword.value;\n    const auth = firebase.auth();\n\n    auth.signInWithEmailAndPassword(email, pass)\n        .then(userCredential => {\n            console.log('User logged in:', userCredential.user);\n            window.location.href = 'index.html';\n        })\n        .catch(error => {\n            console.error('Login error:', error);\n            showModal('Login failed: ' + \"Incorrect email or password\");\n        });\n});\n\n// Add signup event\nbtnSignUp.addEventListener('click', e => {\n    const email = txtEmail.value;\n    const pass = txtPassword.value;\n    const auth = firebase.auth();\n\n    auth.createUserWithEmailAndPassword(email, pass)\n        .then(userCredential => {\n            console.log('User signed up:', userCredential.user);\n            window.location.href = 'index.html';\n        })\n        .catch(error => {\n            console.error('Signup error:', error);\n            showModal('Signup failed: ' + error.message);\n        });\n});\n\n// Add a realtime listener\nfirebase.auth().onAuthStateChanged(firebaseUser => {\n    if (firebaseUser) {\n        console.log('User is logged in:', firebaseUser);\n    } else {\n        console.log('User is not logged in');\n    }\n});\n\n\n//# sourceURL=webpack://group-trip/./auth.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./auth.js"]();
/******/ 	
/******/ })()
;