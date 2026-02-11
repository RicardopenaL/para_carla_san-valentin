/* =========================
   CONTRASEÑA
========================= */
const PASSWORD = "3012cr"; // cámbiala si quieres

const passwordScreen = document.getElementById("passwordScreen");
const passwordInput  = document.getElementById("passwordInput");
const passwordBtn    = document.getElementById("passwordBtn");
const passwordError  = document.getElementById("passwordError");

function checkPassword(){
  if(passwordInput.value === PASSWORD){
    passwordScreen.style.display = "none";
    passwordError.textContent = "";
  } else {
    passwordError.textContent = "Contraseña incorrecta 💔";
  }
}

if (passwordBtn) passwordBtn.addEventListener("click", checkPassword);
if (passwordInput) {
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPassword();
  });
}

/* =========================
   ELEMENTOS PRINCIPALES
========================= */
const screenQuestion = document.getElementById("screen-question");
const screenMessage  = document.getElementById("screen-message");

const btnYes   = document.getElementById("btnYes");
const btnNo    = document.getElementById("btnNo");
const btnAgain = document.getElementById("btnAgain"); // <- VOLVER
const hint     = document.getElementById("hint");

const card = document.getElementById("card");
const heartsLayer = document.getElementById("hearts-layer");

/* =========================
   MODAL FOTOS
========================= */
const photoModal   = document.getElementById("photoModal");
const modalImg     = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const closeModal   = document.getElementById("closeModal");

function showModal(src, caption){
  if(!photoModal) return;
  modalImg.src = src;
  modalCaption.textContent = caption;
  photoModal.classList.add("show");
  photoModal.setAttribute("aria-hidden", "false");
}

function hideModal(){
  if(!photoModal) return;
  photoModal.classList.remove("show");
  photoModal.setAttribute("aria-hidden", "true");
  if(modalImg) modalImg.src = "";
}

if (closeModal) closeModal.addEventListener("click", hideModal);
if (photoModal) {
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) hideModal();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideModal();
});

document.querySelectorAll(".btn.photo").forEach((btn) => {
  btn.addEventListener("click", () => {
    showModal(btn.dataset.photo, btn.dataset.caption);
  });
});

/* =========================
   PANTALLAS
========================= */
let noCount = 0;

function showMessageScreen(){
  if(!screenQuestion || !screenMessage) return;
  screenQuestion.classList.remove("active");
  screenMessage.classList.add("active");
  startHearts();
}

function showQuestionScreen(){
  if(!screenQuestion || !screenMessage) return;
  screenMessage.classList.remove("active");
  screenQuestion.classList.add("active");

  stopHearts();
  hideModal();

  noCount = 0;
  if (hint) hint.textContent = "";

  // reset botón NO si se movió
  if (btnNo) btnNo.style.transform = "translate(0px,0px)";
  moveCount = 0;
}

/* =========================
   TEMBLOR (SI EXISTE)
========================= */
function shakeCard(){
  if(!card) return;
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

/* =========================
   LÓGICA SI / NO
========================= */
function handleYes(){
  if (hint) hint.textContent = "Sabía que ibas a decir que sí 😄❤️";
  setTimeout(showMessageScreen, 350);
}

function handleNo(){
  noCount++;
  shakeCard();

  if(!hint) return;

  if(noCount === 1){
    hint.textContent = "😳 ¿Segura? Te doy otra oportunidad...";
  } else if(noCount === 2){
    hint.textContent = "🥺 Vamos… intenta otra vez";
  } else {
    hint.textContent = "😌 Ok ok… igual te lo muestro porque te amo ❤️";
    setTimeout(showMessageScreen, 850);
  }
}

if (btnYes) btnYes.addEventListener("click", handleYes);
if (btnNo)  btnNo.addEventListener("click", handleNo);

/* ✅ ESTE ES EL ARREGLO PRINCIPAL */
if (btnAgain) {
  btnAgain.addEventListener("click", showQuestionScreen);
}

/* =========================
   BOTÓN NO QUE SE MUEVE
========================= */
let moveCount = 0;
const maxMoves = 6;

if (btnNo) {
  btnNo.addEventListener("mouseenter", () => {
    if (moveCount >= maxMoves) return;
    moveCount++;

    let x, y;

    if (moveCount < maxMoves) {
      x = Math.random() * 140 - 70;
      y = Math.random() * 60 - 30;
    } else {
      x = 140;
      y = -70;
    }

    btnNo.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/* =========================
   CORAZONES
========================= */
let heartsInterval = null;

function createHeart(){
  if(!heartsLayer) return;

  const heart = document.createElement("div");
  heart.className = "heart";

  const hearts = ["❤️","💖","💘","💕","💗","💓"];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  const left = Math.random() * 100;
  const duration = 4 + Math.random() * 3;
  const drift = (Math.random() * 120 - 60) + "px";
  const scale = (0.8 + Math.random() * 1.2).toFixed(2);

  heart.style.left = left + "vw";
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--drift", drift);
  heart.style.setProperty("--scale", scale);

  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 200);
}

function startHearts(){
  for (let i = 0; i < 14; i++) setTimeout(createHeart, i * 70);
  if (heartsInterval) return;
  heartsInterval = setInterval(createHeart, 260);
}

function stopHearts(){
  clearInterval(heartsInterval);
  heartsInterval = null;
  if (heartsLayer) heartsLayer.innerHTML = "";
}
