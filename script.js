// ================= Elements =================
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");

const noBtn = document.querySelector(".no-btn");
// Target the real Yes button by id so other elements can reuse the same class for styling
const yesBtn = document.getElementById("real-yes");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const loading = document.getElementById("dikshaloading");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const finalGifs = document.getElementById("final-gifs");
const audio = document.getElementById("yapapa-audio");

const windowBox = document.querySelector(".letter-window");

// Loading overlay elements (CENTER)
const overlay = document.getElementById("loading-overlay");
const overlayGif = document.getElementById("center-loading-gif");

// Bee intro elements
const beeImg = document.getElementById('bee-img');
const beeSection = document.getElementById('bee-section');
const beeContinue = document.getElementById('bee-continue');
const titleSub = document.getElementById('title-sub');
const beeAnswer = document.querySelector('.bee-answer');
const beeQuestion = document.querySelector('.bee-question');
const beeSoImg = document.getElementById('bee-so');

// Loading GIF list
const loadingGifs = [
    "cat-spinning.gif",
    "loading-cat.gif",
    "spongbobmeme.gif",
    "batman_running.gif"
];

// ================= Envelope Click (WORKING) =================
envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    // If bee image is present and still loading, mark the window to hide title/cat/buttons
    if (beeImg && !beeImg.complete) {
        if (windowBox) windowBox.classList.add('bee-visible');
    }

    setTimeout(() => {
        windowBox.classList.add("open");
        // move focus to primary action for keyboard users
        if (beeContinue && typeof beeContinue.focus === 'function') {
            // focus the continue button so user can reveal the content
            beeContinue.focus();
        } else if (yesBtn && typeof yesBtn.focus === 'function') yesBtn.focus();
    }, 50);
});

// support keyboard activation for envelope (Enter / Space)
if (envelope) {
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            envelope.click();
        }
    });
}

// ================= NO Button (WORKING) =================
if (noBtn) {
    // Move the No button to a new random position within a comfortable radius.
    const moveNoButton = () => {
        const min = 140;
        const max = 260;
        const distance = Math.random() * (max - min) + min;
        const angle = Math.random() * Math.PI * 2;

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        noBtn.style.transition = "transform 0.32s ease";
        noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    // Trigger on hover, click, pointerdown and keyboard activation so it always responds.
    noBtn.addEventListener("mouseover", moveNoButton);
    noBtn.addEventListener("click", (e) => {
        e.preventDefault();
        moveNoButton();
    });
    noBtn.addEventListener('pointerdown', (e) => { /* keep responsive on touch */ moveNoButton(); }, { passive: true });

    // keyboard activation (Enter/Space) triggers the same movement
    noBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            moveNoButton();
        }
    });
} else {
    console.warn("noBtn element not found");
}

// Bee image: show spinning animation while loading, fallback if missing
if (beeImg) {
    // start spinning immediately
    beeImg.classList.add('spin');

    beeImg.addEventListener('load', () => {
        // stop spinning after load; give small scale pop
        beeImg.classList.remove('spin');
        beeImg.style.transition = 'transform 0.3s ease';
        beeImg.style.transform = 'scale(1.03)';
        setTimeout(() => beeImg.style.transform = 'scale(1)', 220);
        // do not auto-reveal main content here — wait for user to click 'Show me'
    });

    beeImg.addEventListener('error', () => {
        // replace with an existing placeholder if the user's image isn't present
        const fallback = 'cat_heart.gif';
        if (beeImg.src && !beeImg.src.includes(fallback)) {
            beeImg.src = fallback;
        }
        // do not auto-reveal main content on error — wait for user to click 'Show me'
    });


}

// Hide title/cat/buttons initially until the user clicks the bee continue button
function hideMainContent() {
    if (title) title.style.display = 'none';
    if (catImg) catImg.style.display = 'none';
    if (loading) loading.style.display = 'none';
    if (buttons) buttons.style.display = 'none';
}

function showMainContent() {
    if (title) title.style.display = 'block';
    if (catImg) catImg.style.display = 'block';
    if (loading) loading.style.display = 'block';
    if (buttons) buttons.style.display = 'flex';
    if (titleSub) {
        titleSub.classList.add('show');
        titleSub.style.display = 'block';
    }
}

// initial-hidden class in HTML hides main content by default; keep that until user clicks

if (beeContinue) {
    beeContinue.addEventListener('click', () => {
        // create or reveal the bee answer paragraph
        let answer = beeSection ? beeSection.querySelector('.bee-answer') : null;
        if (!answer) {
            answer = document.createElement('p');
            answer.className = 'bee-answer';
            answer.textContent = 'so that i can bee yours! 😘';
        }

        // always reveal the answer (CSS hides .bee-answer by default)
        if (!answer.classList.contains('revealed')) answer.classList.add('revealed');

        // ensure the answer is placed just before the so.png image if present
        const existingSo = beeSoImg || (beeSection ? beeSection.querySelector('img[src*="so.png"]') : null);

        // prepare a kiss image to show with the answer (avoid duplicates)
        let kiss = beeSection ? beeSection.querySelector('.bee-kiss') : null;
        if (!kiss) {
            kiss = document.createElement('img');
            kiss.className = 'bee-kiss mid';
            kiss.src = 'cat-kiss.gif';
            kiss.alt = 'kiss';
            kiss.style.maxWidth = '180px';
            kiss.style.display = 'none';
        }
        if (beeSection && !beeSection.contains(answer)) {
            if (existingSo) beeSection.insertBefore(answer, existingSo);
            else beeSection.appendChild(answer);
        }

        // hide all children of beeSection except the answer, the kiss, and the so.png image
        if (beeSection) {
            Array.from(beeSection.children).forEach(child => {
                if (child === answer) return;
                if (child === kiss) return;
                if (child === existingSo) return;
                child.style.display = 'none';
            });

            // make sure the so.png is visible and focusable
            if (existingSo) {
                existingSo.style.display = 'inline-block';
                existingSo.tabIndex = 0;

                // insert the kiss image before so.png if not already present
                if (!beeSection.contains(kiss)) {
                    beeSection.insertBefore(kiss, existingSo);
                }
                // show the kiss image
                kiss.style.display = 'block';

                // attach a one-time reveal handler to the existing so image
                if (!existingSo.dataset.bound) {
                    existingSo.addEventListener('click', () => {
                        // hide the bee answer text (and kiss) when So is clicked
                        const answerEl = beeSection ? beeSection.querySelector('.bee-answer') : null;
                        if (answerEl) {
                            answerEl.style.display = 'none';
                            answerEl.classList.remove('revealed');
                        }
                        const kissEl = beeSection ? beeSection.querySelector('.bee-kiss') : null;
                        if (kissEl) kissEl.style.display = 'none';

                        // reveal the main question and UI elements
                        if (windowBox) windowBox.classList.remove('initial-hidden');
                        if (windowBox) windowBox.classList.remove('bee-visible');
                        showMainContent();

                        // hide the bee intro area
                        if (beeSection) beeSection.style.display = 'none';

                        // Do NOT show final gifs/audio here — the Yes button will handle the loading overlay
                        // and the final reveal. Keep the flow simple: So -> show question; Yes -> loading -> final text.
                    });

                    existingSo.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            existingSo.click();
                        }
                    });

                    existingSo.dataset.bound = '1';
                }

                if (typeof existingSo.focus === 'function') existingSo.focus();
            }
        }
    });
    // allow keyboard activation
    beeContinue.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            beeContinue.click();
        }
    });
}

// ================= YES Button (RESTORED FLOW) =================
if (yesBtn) {
    yesBtn.addEventListener("click", async() => {

        // --- restore original behaviour ---
        title.style.display = "none";
        catImg.style.display = "none";
        loading.style.display = "none";
        buttons.style.display = "none";

        windowBox.classList.add("final");

        // --- CENTER LOADING (NEW, SAFE) ---
        if (overlay && overlayGif) {
            overlay.style.display = "flex";

            for (let i = 0; i < loadingGifs.length; i++) {
                overlayGif.src = loadingGifs[i];
                await new Promise(r => setTimeout(r, 900));
            }

            overlay.style.display = "none";
        }

        // --- ORIGINAL FINAL REVEAL ---
        title.textContent = "Yayyyyyyy! 💖";
        title.style.display = "block";

        if (finalGifs) finalGifs.style.display = "flex";

        // ensure loading overlay does not leave a shadow or block interaction
        if (overlay) {
            overlay.style.display = "none";
            overlay.style.background = "transparent";
            overlay.style.pointerEvents = "none";
        }

        if (finalText) finalText.style.display = "block";

        // --- AUDIO (5 LOOPS, SAFE) ---
        if (audio) {
            let playCount = 0;
            audio.currentTime = 0;
            audio.volume = 0.7;
            audio.play();

            audio.onended = () => {
                playCount++;
                if (playCount < 5) {
                    audio.currentTime = 0;
                    audio.play();
                } else {
                    audio.onended = null;
                }
            };
        }
    });
    // keyboard activation (Enter/Space)
    yesBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            yesBtn.click();
        }
    });
} else {
    console.warn("yesBtn element not found");
}

// ---------------- Click / Keyboard press visual effect for image-buttons ----------------
function installClickEffects() {
    // pointer interactions
    document.addEventListener('pointerdown', (e) => {
        const btn = e.target.closest ? e.target.closest('.btn') : null;
        if (btn) btn.classList.add('click-effect');
    }, { passive: true });

    document.addEventListener('pointerup', (e) => {
        const btn = e.target.closest ? e.target.closest('.btn') : null;
        if (btn) setTimeout(() => btn.classList.remove('click-effect'), 120);
    });

    // keyboard activation visual: Enter / Space
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const el = document.activeElement;
            if (el && el.classList && el.classList.contains('btn')) {
                el.classList.add('click-effect');
            }
        }
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const el = document.activeElement;
            if (el && el.classList && el.classList.contains('btn')) {
                setTimeout(() => el.classList.remove('click-effect'), 90);
            }
        }
    });
}


// install on load
installClickEffects();
