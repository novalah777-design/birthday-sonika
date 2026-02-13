document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const state = {
        currentPage: 1,
        isMusicPlaying: false,
        isTyping: false
    };

    // --- DOM Elements ---
    const pages = {
        1: document.getElementById('page-1'),
        2: document.getElementById('page-2'),
        3: document.getElementById('page-3')
    };

    const sounds = {
        bgMusic: document.getElementById('bg-music'),
        cutSound: document.getElementById('cut-sound')
    };

    // Page 1 Elements
    const mainCake = document.getElementById('main-cake');
    const cakeSlice = document.getElementById('cake-slice');
    const cutBtn = document.getElementById('cut-cake-btn');
    const postCutContent = document.getElementById('post-cut-content');
    const controlsP1 = document.querySelector('.controls-p1');
    const toPage2Btn = document.getElementById('to-page-2-btn');

    // Page 2 Elements
    const typewriterText = document.getElementById('typewriter-text');
    const cursor = document.querySelector('.cursor');
    const toPage3Btn = document.getElementById('to-page-3-btn');

    // Background Elements
    const floatingContainer = document.getElementById('floating-container');

    // --- Initialization ---
    initFloatingBg('assets/images/strawberry.png'); // Initialize Page 1 background

    // --- Event Listeners ---

    // PAGE 1: Cut Cake Action
    cutBtn.addEventListener('click', () => {
        // Start music on first interaction (browser policy requirement)
        if (!state.isMusicPlaying) {
            sounds.bgMusic.volume = 0.4; // Set volume lower
            sounds.bgMusic.play().catch(e => console.log("Audio autoplay blocked until interaction"));
            state.isMusicPlaying = true;
        }

        // Play cut sound
        sounds.cutSound.currentTime = 0;
        sounds.cutSound.play();

        // 1. Shake the cake
        mainCake.classList.add('cake-cut-anim');
        
        // 2. After shake, move slice and show content
        setTimeout(() => {
            cakeSlice.classList.remove('hidden');
            cakeSlice.classList.add('slice-moved');
            
            // Hide the cut button
            controlsP1.classList.add('hidden');

            // Show the "Make a wish" section
            setTimeout(() => {
                postCutContent.classList.remove('hidden');
                // Reveal next page button shortly after
                setTimeout(() => {
                    toPage2Btn.classList.remove('hidden');
                }, 1000);
            }, 600);

        }, 500); // Wait for shake to mostly finish
    });


    // Transition to Page 2
    toPage2Btn.addEventListener('click', () => {
        transitionPage(1, 2);
    });

    // Transition to Page 3
    toPage3Btn.addEventListener('click', () => {
        transitionPage(2, 3);
    });


    // --- Helper Functions ---

    function transitionPage(from, to) {
        pages[from].classList.remove('active-section');
        pages[from].classList.add('hidden-section');
        
        setTimeout(() => {
            pages[from].classList.add('hidden'); // Fully hide from layout
            pages[to].classList.remove('hidden');
            
            // Small delay to allow browser to render before fading in
            setTimeout(() => {
                 pages[to].classList.remove('hidden-section');
                 pages[to].classList.add('active-section');
                 
                 // Page specific setup upon arrival
                 if (to === 2) {
                     startTypewriter();
                 } else if (to === 3) {
                     changeFloatingBg('assets/images/heart.png');
                     startConfetti();
                 }
            }, 50);
        }, 800); // Match transition duration in CSS
    }


    // --- Typewriter Effect (Page 2) ---
    function startTypewriter() {
        if (state.isTyping) return;
        state.isTyping = true;
        
        const fullText = typewriterText.getAttribute('data-text');
        typewriterText.textContent = ''; // Clear initial text
        let index = 0;
        
        // Lock navigation during typing
        toPage3Btn.classList.add('disabled');

        function type() {
            if (index < fullText.length) {
                typewriterText.textContent += fullText.charAt(index);
                index++;
                // Vary typing speed slightly for realism
                let speed = Math.random() * (70 - 30) + 30; 
                // Pause longer at punctuation
                const char = fullText.charAt(index -1);
                if(char === '.' || char === ',' || char === '!') speed += 400;
                
                setTimeout(type, speed);
            } else {
                // Finished typing
                state.isTyping = false;
                cursor.style.display = 'none'; // Hide cursor
                
                // Unlock navigation button
                toPage3Btn.classList.remove('hidden');
                setTimeout(() => {
                    toPage3Btn.classList.remove('disabled');
                }, 500);
            }
        }
        // Start typing after a short pause upon entering page
        setTimeout(type, 1000);
    }


    // --- Background Animations ---
    function initFloatingBg(imageSrc) {
        floatingContainer.innerHTML = ''; // Clear existing
        const count = window.innerWidth < 500 ? 15 : 30; // Fewer on mobile

        for (let i = 0; i < count; i++) {
            createFloater(imageSrc);
        }
    }

    function createFloater(imageSrc) {
        const floater = document.createElement('img');
        floater.src = imageSrc;
        floater.classList.add('floater');
        // Randomize positions and animation details
        floater.style.left = `${Math.random() * 100}vw`;
        floater.style.width = `${Math.random() * 20 + 10}px`; // Size between 10px and 30px
        floater.style.animationDuration = `${Math.random() * 10 + 10}s`; // 10-20s duration
        floater.style.animationDelay = `${Math.random() * 5}s`;
        floatingContainer.appendChild(floater);
    }

    function changeFloatingBg(newImageSrc) {
        // Smoothly swap out background elements
        const floaters = document.querySelectorAll('.floater');
        floaters.forEach(f => {
            f.style.opacity = 0;
            setTimeout(() => f.remove(), 1000);
        });
        setTimeout(() => {
             initFloatingBg(newImageSrc);
        }, 500);
    }

    // --- Confetti Effect (Page 3) ---
    function startConfetti() {
        const container = document.getElementById('confetti-container');
        const colors = ['#ff8fab', '#d65d7a', '#ffe4e9', '#ffffff'];
        
        for(let i=0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.opacity = Math.random();
            container.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => confetti.remove(), 5000);
        }
    }
});
