
/* --------------------------------------- */
/* -----------Scroll function ------------ */
function debounce(func, wait = 20, immediate = true) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const sliderImages = document.querySelectorAll('.animated');

const checkSlide = () => {
  sliderImages.forEach(sliderImage => {
    const slideInAt = (window.scrollY + window.innerHeight) - sliderImage.offsetHeight / 6;
    const imageBottom = sliderImage.offsetTop + sliderImage.offsetHeight;
    const isHalfShown = slideInAt > sliderImage.offsetTop;
    const isNotScrolledPast = window.scrollY < imageBottom;

    if (isHalfShown && isNotScrolledPast) {
      sliderImage.classList.add('active');
    } else {
      sliderImage.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', debounce(checkSlide));




/* --------------------------------------- */
/* ---------- Firebase Script ------------ */
var firebaseConfig = {
  apiKey: "AIzaSyBnhfTEk1sQCUCQ1bnwZ0hZJTk7DrVHtSM",
  authDomain: "dog-inn-contact-form.firebaseapp.com",
  databaseURL: "https://dog-inn-contact-form.firebaseio.com",
  projectId: "dog-inn-contact-form",
  storageBucket: "dog-inn-contact-form.appspot.com",
  messagingSenderId: "352317954400",
  appId: "1:352317954400:web:6ddc858a207d3c3e2d6605",
  measurementId: "G-RY4JNK00NN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

/* --------------------------------------- */
/* ------------- Contact Form ------------ */

// reference message collection
const form = document.querySelector('form');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const phone = document.querySelector('#number');
const message = document.querySelector('#message');
const send = document.querySelector('#send');
const alert = document.querySelector('.alert');

// reference mssages collection
var messagesRef = firebase.database().ref('messages');

// get form values
const getInputValue = (id) => {
  return document.querySelector(id).value;
}

// save message to firebase
function saveMessage(name, email, phone, message) {
  let newMessageRef = messagesRef.push();
  newMessageRef.set({
    nameVal: name,
    emailVal: email,
    phoneVal: phone,
    messageVal: message
  })
}

// form validation
const checkRequired = (inputArr) => {
  let areAllFilled = true;
  inputArr.forEach(input => {
    if (!areAllFilled) {
      return;
    } else if (input.value === '') {
      areAllFilled = false; 
    }
  })

  if (!areAllFilled) { // if any of the fields is left empty
    inputArr.forEach(input => {
      showError(input, `${input.id} is required`);
    })
  } else {
    showSuccess();
  }
}

// check if email is valid 
const validEmailRequired = (input) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(input.value)) {
   showError(input, 'wrong');
  }
}

// show success fuction 
const showSuccess = () => {
  alert.style.display = 'block';

  // hide alert after 3s
  setTimeout(function () {
    document.querySelector('.alert').style.display = 'none';
  }, 3000);

  form.reset();
}

// show error function - color, message
const showError = (input, message) => {
  input.parentElement.className = 'form-group error';
  input.parentElement.querySelector('small').textContent = message;
}

const submitForm = (e) => {
  e.preventDefault();
  // form validation
  checkRequired([name, email, message]);
  validEmailRequired(email);
  form.reset();

  // get values of each input
  const nameVal = getInputValue('#name');
  const emailVal = getInputValue('#email');
  const phoneVal = getInputValue('#number');
  const messageVal = getInputValue('#message');

  saveMessage(nameVal, emailVal, phoneVal, messageVal);
}

// event-listener for submit
form.addEventListener('submit', submitForm);