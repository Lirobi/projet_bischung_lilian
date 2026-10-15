const form = document.getElementById('signup-form');
const signupSection = document.getElementById('signup-section');
const summarySection = document.getElementById('summary-section');
const errorMessage = document.getElementById('error-message');
const backButton = document.getElementById('back-button');

const fieldIds = [
  'login',
  'password',
  'confirmPassword',
  'name',
  'firstName',
  'address',
  'email',
  'phone',
  'birthDate',
];

function setError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('visible');
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.remove('visible');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function showSummary(data) {
  const summaryFields = {
    login: document.getElementById('summary-login'),
    name: document.getElementById('summary-name'),
    firstName: document.getElementById('summary-firstName'),
    address: document.getElementById('summary-address'),
    email: document.getElementById('summary-email'),
    phone: document.getElementById('summary-phone'),
    birthDate: document.getElementById('summary-birthDate'),
  };

  Object.entries(summaryFields).forEach(([key, element]) => {
    const value = key === 'birthDate' ? formatDate(data[key]) : data[key];
    element.textContent = value;
  });

  signupSection.classList.add('hidden');
  summarySection.classList.remove('hidden');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError();

  const data = {};

  for (const fieldId of fieldIds) {
    const input = document.getElementById(fieldId);
    const value = input.value.trim();
    data[fieldId] = value;

    if (!value) {
      setError('Veuillez remplir tous les champs obligatoires.');
      input.focus();
      return;
    }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    setError('L’adresse email est invalide.');
    document.getElementById('email').focus();
    return;
  }

  if (data.password !== data.confirmPassword) {
    setError('Le mot de passe et sa confirmation ne correspondent pas.');
    document.getElementById('confirmPassword').focus();
    return;
  }

  showSummary(data);
});

backButton.addEventListener('click', () => {
  summarySection.classList.add('hidden');
  signupSection.classList.remove('hidden');
  form.reset();
  clearError();
});
