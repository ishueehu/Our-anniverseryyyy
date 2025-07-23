document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "01 08 2022"; // The secret date!

  const passwordScreen = document.getElementById("password-screen");
  const passwordInput = document.getElementById("passwordInput");
  const passwordSubmit = document.getElementById("passwordSubmit");
  const passwordError = document.getElementById("passwordError");

  const startBtn = document.getElementById("startBtn");
  const startScreen = document.getElementById("start-screen");
  const mainContent = document.getElementById("main-content");
  const music = document.getElementById("bg-music");

  // Get buttons for revealing sections
  const showPhotosBtn = document.getElementById('show-photos-btn');
  const showMyPhotoBtn = document.getElementById('show-my-photo-btn');
  const showCouplePhotoBtn = document.getElementById('show-couple-photo-btn');
  const showChatsBtn = document.getElementById('show-chats-btn');
  const showSurpriseBtn = document.getElementById('show-surprise-btn');
  const showFinalContentBtn = document.getElementById('show-ending-btn'); // Renamed constant for clarity


  // --- Password Logic ---
  passwordSubmit.addEventListener("click", () => {
    if (passwordInput.value === correctPassword) {
      passwordScreen.style.display = "none"; // Hide password screen
      startScreen.style.display = "flex"; // Show the start button screen
    } else {
      passwordError.style.display = "block"; // Show error message
      passwordInput.value = ""; // Clear input for retry
    }
  });

  // Allow pressing Enter key in password input
  passwordInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      passwordSubmit.click(); // Simulate button click
    }
  });
  // --- End Password Logic ---


  startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    mainContent.style.display = "block";
    music.play();
    createFloatingHearts();
    revealAndTypeSection('anniversary-message-section', showPhotosBtn);
  });

  // Event listeners for reveal buttons
  showPhotosBtn.addEventListener('click', () => {
    showPhotosBtn.style.display = 'none';
    revealAndTypeSection('her-photo-section', showMyPhotoBtn);
  });

  showMyPhotoBtn.addEventListener('click', () => {
    showMyPhotoBtn.style.display = 'none';
    revealAndTypeSection('my-photo-section', showCouplePhotoBtn);
  });

  showCouplePhotoBtn.addEventListener('click', () => {
    showCouplePhotoBtn.style.display = 'none';
    revealAndTypeSection('couple-photo-section', showChatsBtn);
  });

  showChatsBtn.addEventListener('click', () => {
    showChatsBtn.style.display = 'none';
    revealAndTypeSection('chat-screenshots-section', showSurpriseBtn);
  });

  showSurpriseBtn.addEventListener('click', () => {
    showSurpriseBtn.style.display = 'none';
    document.getElementById('surprise-section').style.display = 'block';
    animateSurpriseGift();
  });

  // Event listener for the final content button
  showFinalContentBtn.addEventListener('click', async () => {
    showFinalContentBtn.style.display = 'none';
    await revealFinalImages();
    revealAndTypeSection('ending-section', null);
  });

});

async function revealSurprise() {
  document.getElementById("hidden-message").style.display = "block";
  const surpriseTextElement = document.querySelector('#hidden-message .type-text');
  const surpriseImages = document.querySelectorAll('#hidden-message .surprise-image');
  const surpriseImageCaptions = document.querySelectorAll('#hidden-message .ss-caption.type-text');

  if (surpriseTextElement) {
    await typeWriter(surpriseTextElement, surpriseTextElement.getAttribute('data-text'), 150);
  }

  for (let i = 0; i < surpriseImages.length; i++) {
    const img = surpriseImages[i];
    const caption = surpriseImageCaptions[i];

    img.style.display = 'block';
    img.style.opacity = '0';
    img.style.transition = 'opacity 1s ease-in-out';
    await new Promise(r => setTimeout(r, 50));
    img.style.opacity = '1';
    await new Promise(r => setTimeout(r, 1000));

    if (caption) {
      await typeWriter(caption, caption.getAttribute('data-text'), 150);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  document.getElementById('show-ending-btn').style.display = 'block';
  document.getElementById('show-ending-btn').scrollIntoView({ behavior: 'smooth', block: 'start' });

  const revealButton = document.querySelector("#surprise button");
  if (revealButton) {
    revealButton.style.display = 'none';
  }
}

async function revealFinalImages() {
    const finalImagesSection = document.getElementById('final-images-section');
    finalImagesSection.style.display = 'block';

    const finalSectionHeading = finalImagesSection.querySelector('h2 .type-text');
    if (finalSectionHeading) {
        await typeWriter(finalSectionHeading, finalSectionHeading.getAttribute('data-text'), 150);
        await new Promise(r => setTimeout(r, 500));
    }

    const finalImageBoxes = finalImagesSection.querySelectorAll('.final-img-box');

    for (const box of finalImageBoxes) {
        box.style.display = 'block';
        box.style.opacity = '0';
        box.style.transition = 'opacity 1s ease-in-out';
        await new Promise(r => setTimeout(r, 50));
        box.style.opacity = '1';

        const captionElement = box.querySelector('.ss-caption.type-text');
        if (captionElement) {
            await typeWriter(captionElement, captionElement.getAttribute('data-text'), 150);
        }
        await new Promise(r => setTimeout(r, 500));
    }
    finalImagesSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
}


function createFloatingHearts() {
  const emojis = ["💌", "❤️", "🎁", "💖", "💍"];
  for (let i = 0; i < 25; i++) {
    const span = document.createElement("span");
    span.classList.add("floating");
    span.style.left = Math.random() * 100 + "vw";
    span.style.top = Math.random() * 100 + "vh";
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 5000);
  }
}

/**
 * Types text word by word into an element.
 * @param {HTMLElement} element - The DOM element to type into.
 * @param {string} text - The full text content.
 * @param {number} [delay=150] - Delay between words in milliseconds.
 * @param {Function} [callback=null] - Function to call when typing is complete.
 */
function typeWriter(element, text, delay = 150, callback = null) {
  return new Promise(resolve => {
    let words = text.split(/\s+/);
    let i = 0;
    element.textContent = '';

    function addWord() {
      if (i < words.length) {
        element.textContent += words[i] + ' ';
        i++;
        setTimeout(addWord, delay);
      } else {
        if (callback) {
          callback();
        }
        resolve();
      }
    }
    addWord();
  });
}

/**
 * Reveals a section, types out its content, and then shows the next button.
 * @param {string} sectionId - The ID of the section to reveal and type.
 * @param {HTMLElement} [nextButton=null] - The button to show after typing is complete.
 */
async function revealAndTypeSection(sectionId, nextButton = null) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.style.display = 'block';

  if (sectionId !== 'anniversary-message-section') {
     section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const elementsToTypeInSection = section.querySelectorAll('.type-text, .ss-caption.type-text');

  for (const element of elementsToTypeInSection) {
    const text = element.getAttribute('data-text');
    if (text) {
      await typeWriter(element, text, 150);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (nextButton) {
    nextButton.style.display = 'block';
    nextButton.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

function animateSurpriseGift() {
  const surpriseElement = document.getElementById('surprise');
  surpriseElement.classList.remove('surprise-animation');
  void surpriseElement.offsetWidth;
  surpriseElement.classList.add('surprise-animation');
}
