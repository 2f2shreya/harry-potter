/**
 * Main JavaScript logic for Kittu's Birthday Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    initMagicCursor();
    initStarsBackground();
    initCastleEntrance();
    // initHeroAnimations() will be called after castle entrance opens
    initPortal();
    initTimeline();
    initDailyProphet();
    initMemoryBook();
    initGames();
    initMusicPlayer();
    initSurprise();
    initBigCake();
    initVault();
    initMovies();
    initFloatingCandles();
    initGoldenSnitch();
    initHogwartsLetter();
    initPatronusGame();
    init3DTiltEffects();
    initSortingHat();
    initPotionsGame();
});

/**
 * 0. Magic Wand Cursor & Castle Entrance
 */
function initMagicCursor() {
    const cursor = document.getElementById('magic-cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

        // Occasional particle trail
        if (Math.random() > 0.8) {
            createMagicParticle(mouseX, mouseY);
        }
    });

    // Burst on click
    document.addEventListener('click', (e) => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.8)`;
        setTimeout(() => cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`, 100);

        for (let i = 0; i < 5; i++) {
            createMagicParticle(mouseX, mouseY);
        }
    });
}

function createMagicParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    gsap.to(particle, {
        y: `+=${Math.random() * 50 - 25}`,
        x: `+=${Math.random() * 50 - 25}`,
        opacity: 0,
        duration: Math.random() * 1 + 0.5,
        onComplete: () => particle.remove()
    });
}

function initCastleEntrance() {
    const entrance = document.getElementById('castle-entrance');
    if (!entrance) return;

    const openEntrance = (e) => {
        if (e.type === 'touchend') e.preventDefault(); // Prevent ghost clicks
        
        // Failsafe to ensure it ONLY fires once even with multiple events
        if (entrance.dataset.opened === 'true') return;
        entrance.dataset.opened = 'true';

        // Fade out text
        const content = entrance.querySelector('.entrance-content');
        if (content) content.style.opacity = '0';

        // Open doors
        const leftDoor = entrance.querySelector('.left-door');
        const rightDoor = entrance.querySelector('.right-door');
        if (leftDoor) leftDoor.classList.add('open');
        if (rightDoor) rightDoor.classList.add('open');

        // Play magical sound here if available

        // After doors open, hide overlay and trigger hero
        setTimeout(() => {
            entrance.style.display = 'none';
            initHeroAnimations();
        }, 2000); // Wait 2s for doors to open
    };

    entrance.addEventListener('click', openEntrance, { once: true });
    entrance.addEventListener('touchend', openEntrance, { once: true });
}

/**
 * 1. Background Stars Animation on Canvas
 */
function initStarsBackground() {
    const canvas = document.getElementById('starsCanvas');
    const ctx = canvas.getContext('2d');

    let width, height, stars;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    function initStars() {
        stars = [];
        const numStars = Math.floor((width * height) / 2000); // Dynamic count based on screen size

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25,
                alpha: Math.random()
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#fff';

        stars.forEach(s => {
            ctx.globalAlpha = s.alpha;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();

            // Move stars slowly
            s.x += s.vx / 100;
            s.y += s.vy / 100;

            // Wrap around screen
            if (s.x < 0 || s.x > width) s.vx = -s.vx;
            if (s.y < 0 || s.y > height) s.vy = -s.vy;

            // Twinkle effect
            s.alpha += Math.random() * 0.05 - 0.025;
            if (s.alpha < 0.1) s.alpha = 0.1;
            if (s.alpha > 1) s.alpha = 1;
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

/**
 * 2. Hero Section Animations
 */
function initFloatingCandles() {
    const container = document.getElementById('floating-candles-container');
    if (!container) return;

    // Create 15-30 random candles
    const numCandles = Math.floor(Math.random() * 15) + 15;
    for (let i = 0; i < numCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'great-hall-candle';

        // Randomize position and animation delay
        candle.style.left = `${Math.random() * 100}%`;
        candle.style.top = `${Math.random() * 60 + 10}%`; // mostly upper half
        candle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        candle.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(candle);
    }
}

function initGoldenSnitch() {
    const snitch = document.getElementById('golden-snitch');
    if (!snitch) return;

    function moveSnitch() {
        const x = Math.random() * 90 + 5; // 5% to 95% width
        const y = Math.random() * 90 + 5; // 5% to 95% height

        snitch.style.left = `${x}%`;
        snitch.style.top = `${y}%`;

        // Move again after a random interval (2 to 5 seconds)
        setTimeout(moveSnitch, Math.random() * 3000 + 2000);
    }

    // Interactive easter egg: catch the snitch
    let score = 0;
    const scoreContainer = document.getElementById('snitch-score-container');
    const scoreSpan = document.getElementById('snitch-score');

    snitch.style.pointerEvents = 'auto';
    snitch.addEventListener('click', () => {
        snitch.style.transform = 'translate(-50%, -50%) scale(1.5)';
        snitch.style.filter = 'drop-shadow(0 0 20px #fbbf24)';
        triggerSmallConfetti(snitch);

        score++;
        if (scoreContainer && scoreSpan) {
            scoreContainer.style.display = 'block';
            scoreSpan.textContent = score;
        }

        setTimeout(() => {
            snitch.style.transform = 'translate(-50%, -50%) scale(1)';
            snitch.style.filter = 'drop-shadow(0 0 10px #fbbf24)';
            moveSnitch(); // Flit away immediately
        }, 1000);
    });

    // Start moving after a short delay
    setTimeout(moveSnitch, 2000);
}

function initHeroAnimations() {
    // Reveal text and elements
    const greeting = document.getElementById('birthday-greeting');
    const instruction = document.getElementById('spell-instruction');
    const spellContainer = document.getElementById('hero-spell');

    if (greeting) greeting.classList.remove('hidden-start');

    // Animate typing effect delay
    setTimeout(() => {
        if (instruction) {
            instruction.classList.remove('hidden-start');
            gsap.fromTo(instruction, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });
        }
        if (spellContainer) {
            spellContainer.classList.remove('hidden-start');
            gsap.fromTo(spellContainer, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: 'back.out(1.5)' });
        }
    }, 3500); // Give typing text 3.5s to finish

    // Cast spell button logic
    const spellBtn = document.getElementById('cast-spell-btn');
    if (spellBtn) {
        spellBtn.addEventListener('click', () => {
            // Magical burst!
            fireworksConfetti();
            releaseBalloons();

            // Add flash effect
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100vw';
            flash.style.height = '100vh';
            flash.style.backgroundColor = 'white';
            flash.style.zIndex = '9999';
            flash.style.opacity = '0';
            flash.style.pointerEvents = 'none';
            document.body.appendChild(flash);

            gsap.to(flash, {
                opacity: 0.8,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => flash.remove()
            });

            spellBtn.innerHTML = "✨ Magic Unleashed! ✨";
            spellBtn.disabled = true;
        }, { once: true });
    }
}

/**
 * Balloon Logic
 */
function releaseBalloons() {
    const container = document.getElementById('balloons-container');
    const colors = ['#740001', '#1a472a', '#d3a625', '#0e1a40', '#eee117']; // Hogwarts House Colors
    const numBalloons = 20;

    for (let i = 0; i < numBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        // Randomize
        const left = Math.random() * 90 + 5; // 5% to 95%
        const color = colors[Math.floor(Math.random() * colors.length)];
        const scale = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
        const duration = Math.random() * 4 + 4; // 4s to 8s

        balloon.style.left = left + '%';
        balloon.style.backgroundColor = color;
        balloon.style.transform = `scale(${scale})`;

        container.appendChild(balloon);

        // Animate up
        gsap.to(balloon, {
            y: -window.innerHeight - 200,
            x: `+=${Math.random() * 100 - 50}`, // slight sway
            duration: duration,
            ease: "power1.inOut",
            onComplete: () => {
                balloon.remove();
            }
        });
    }
}

/**
 * Helper: Confetti & Fireworks
 */
function triggerInitialConfetti() {
    // Small sparkle confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#740001', '#1a472a', '#d3a625', '#ffffff'] // Hogwarts House Colors
    });
}

function fireworksConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

/**
 * 3. 3D Memory Portal
 */
function initPortal() {
    const portalContainer = document.querySelector('.portal-container');
    if (!portalContainer) return;

    // Sample memories
    const memories = [
        { img: 'assets/portal-1.jpg', text: 'That special day we first met. 🌟' },
        { img: 'assets/portal-2.jpg', text: 'You looking absolutely radiant! 💖' },
        { img: 'assets/portal-3.jpg', text: 'Our unexpected adventure together. 🚗' },
        { img: 'assets/portal-4.jpg', text: 'Just a beautiful random memory. 🌻' },
        { img: 'assets/portal-5.jpg', text: 'You make every moment magical. ✨' },
        { img: 'assets/portal-7.jpg', text: 'Stunning as always! 💖' },
        { img: 'assets/portal-8.jpg', text: 'A splash of fun! 💦' }
    ];

    const cards = [];
    const radius = 250; // spread radius

    memories.forEach((mem, index) => {
        const card = document.createElement('div');
        card.className = 'portal-card';
        card.style.backgroundImage = `url(${mem.img})`;

        // Distribute in a circle
        const angle = (index / memories.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = -400 + (Math.random() * 200); // random depth

        // Initial setup
        gsap.set(card, {
            x: x,
            y: y,
            z: z,
            rotateY: angle * (180 / Math.PI) + 90,
            opacity: 0
        });

        portalContainer.appendChild(card);
        cards.push({ element: card, angle: angle, z: z, mem: mem });

        // Click event to open modal
        card.addEventListener('click', () => {
            openMemoryModal(mem.img, mem.text);
        });
    });

    // Animate cards floating towards screen when portal is in view
    ScrollTrigger.create({
        trigger: '#portal',
        start: 'top center',
        onEnter: () => {
            cards.forEach((c, i) => {
                gsap.to(c.element, {
                    opacity: 1,
                    z: c.z + 200, // Move forward
                    duration: 2,
                    ease: "back.out(1.2)",
                    delay: i * 0.2
                });

                // Add continuous floating animation
                gsap.to(c.element, {
                    y: `+=${Math.random() * 30 - 15}`,
                    rotateX: `+=${Math.random() * 10 - 5}`,
                    rotateY: `+=${Math.random() * 10 - 5}`,
                    duration: 3 + Math.random() * 2,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: 2 // Start after intro animation
                });
            });
        },
        once: true
    });

    // Modal close logic
    const modal = document.getElementById('memory-modal');
    const closeBtn = document.getElementById('close-memory');

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

function openMemoryModal(imgSrc, text) {
    const modal = document.getElementById('memory-modal');
    const img = document.getElementById('memory-img');
    const caption = document.getElementById('memory-text');

    img.src = imgSrc;
    caption.textContent = text;
    modal.classList.remove('hidden');
}

/**
 * 4. Interactive Timeline Animation (Map Footprints)
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const footprintContainer = document.getElementById('marauder-footprints');

    // Existing timeline items animation
    timelineItems.forEach((item, i) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%', // when top of element hits 80% of viewport
                toggleActions: 'play none none reverse' // play on enter, reverse on leave back
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    if (!footprintContainer) return;

    // Track scroll to spawn footprints
    let lastScrollY = window.scrollY;
    let isLeftFoot = true;
    let footprintCount = 0;
    let lastFootprintY = 0;

    ScrollTrigger.create({
        trigger: '#timeline-container',
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
            const currentY = self.progress * footprintContainer.clientHeight;

            // Only spawn a footprint if we scrolled down enough distance
            if (currentY > lastFootprintY + 40 && self.direction === 1) {
                spawnFootprint(currentY, isLeftFoot);
                isLeftFoot = !isLeftFoot;
                lastFootprintY = currentY;
                footprintCount++;
            }
        }
    });

    function spawnFootprint(yPos, left) {
        const foot = document.createElement('i');
        foot.className = `fas fa-shoe-prints footprint ${left ? 'left-foot' : 'right-foot'}`;
        foot.style.top = `${yPos}px`;

        footprintContainer.appendChild(foot);

        // Animate appearance and disappearance
        foot.classList.add('appear');

        // Cleanup DOM after animation completes (3s)
        setTimeout(() => {
            if (foot.parentNode === footprintContainer) {
                foot.remove();
            }
        }, 3500);
    }
}

/**
 * 4.5 The Daily Prophet Animation
 */
function initDailyProphet() {
    const prophetContainer = document.querySelector('.prophet-container');
    if (!prophetContainer) return;

    gsap.fromTo(prophetContainer,
        {
            y: 100,
            opacity: 0,
            rotationZ: -5
        },
        {
            scrollTrigger: {
                trigger: '#daily-prophet',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            rotationZ: 0,
            duration: 1.5,
            ease: "back.out(1.5)"
        }
    );

    // Secret Message Reveal Logic
    const revealWand = document.getElementById('prophet-reveal-wand');
    const hiddenLines = document.getElementById('prophet-hidden-lines');
    let isRevealed = false;

    function revealSecretMessage() {
        if (isRevealed) return;
        isRevealed = true;
        
        hiddenLines.classList.add('revealed');
        triggerSmallConfetti(revealWand);
        
        // Hide the wand trigger
        gsap.to(revealWand, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            onComplete: () => {
                revealWand.style.display = 'none';
            }
        });
        
        // Play magic sound if available
        const magicSound = document.getElementById('magic-sound-effect');
        if (magicSound) {
            magicSound.currentTime = 0;
            magicSound.play().catch(e => console.log('Audio play blocked:', e));
        }
    }

    if (revealWand && hiddenLines) {
        // Reveal on click
        revealWand.addEventListener('click', revealSecretMessage);

        // Reveal on "mischief managed" typing
        let typedString = "";
        const secretCode = "mischiefmanaged";
        
        window.addEventListener('keydown', (e) => {
            if (isRevealed) return;
            // Only capture letters to avoid long strings
            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/i)) {
                typedString += e.key.toLowerCase();
            }
            
            // Keep string length to the secret code length
            if (typedString.length > secretCode.length) {
                typedString = typedString.slice(-secretCode.length);
            }
            
            if (typedString === secretCode) {
                // Find and scroll to the prophet section before revealing
                document.getElementById('daily-prophet').scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(revealSecretMessage, 800);
            }
        });
    }
}

/**
 * 5. Childhood Memory Book Logic
 */
function initMemoryBook() {
    const book = document.getElementById('memory-book-el');
    if (!book) return;

    const pages = document.querySelectorAll('.page');
    let currentState = 1;
    const maxState = pages.length + 1;

    // We have 3 pages. state 1: closed cover. state 2: page 1 opened, state 3: page 2 opened, state 4: page 3 opened (back cover)

    pages.forEach((page, index) => {
        // Z-index is already set in HTML descending: page 3 is 1, page 2 is 2, page 1 is 3.
        // We attach click on front and back to flip

        const pageNum = index + 1; // page1, page2, page3

        page.addEventListener('click', (e) => {
            // Determine if clicking to open or close
            if (page.classList.contains('flipped')) {
                // If flipped, clicking closes it
                page.classList.remove('flipped');
                page.style.zIndex = pages.length - index; // restore original z-index
                currentState--;
            } else {
                // If not flipped, clicking opens it
                page.classList.add('flipped');
                // update z-index so flipped page shows properly underneath previous flipped pages
                setTimeout(() => {
                    page.style.zIndex = index + 1;
                }, 300); // update halfway through animation
                currentState++;
            }

            // Adjust book container translation dependent on state to center the spread
            const shiftVal = window.innerWidth < 768 ? 100 : 150;

            if (currentState === 1) {
                book.classList.remove('open');
                book.style.transform = 'translateX(0)';
            } else if (currentState === maxState) {
                // when viewing back cover, shift it left so back cover is centered
                book.style.transform = `translateX(-${shiftVal}px)`;
            } else {
                book.classList.add('open');
                book.style.transform = `translateX(${shiftVal}px)`;
            }
        });
    });
}

/**
 * 6. Games Logic
 */
function initGames() {
    initPuzzle();
    initMiniCandles();
}

/* Photo Puzzle Logic */
function initPuzzle() {
    const board = document.getElementById('puzzle-board');
    if (!board) return;

    const size = 3; // 3x3
    let pieces = [];
    let selectedPiece = null;

    // Create pieces
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const index = row * size + col;
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';

            // Calculate background position based on 200px width/height of container grid
            // Grid cell is 200/3 ≈ 66.66px
            const bgX = (col / (size - 1)) * 100;
            const bgY = (row / (size - 1)) * 100;

            piece.style.backgroundPosition = `${bgX}% ${bgY}%`;
            piece.dataset.index = index; // correct original position
            piece.dataset.current = index;

            piece.addEventListener('click', () => handlePieceClick(piece));
            pieces.push(piece);
        }
    }

    shuffleAndAppend();

    document.getElementById('puzzle-reset').addEventListener('click', () => {
        board.innerHTML = '';
        shuffleAndAppend();
    });

    function shuffleAndAppend() {
        // Randomize
        pieces.sort(() => Math.random() - 0.5);

        // Update current position mapping
        pieces.forEach((p, i) => {
            p.dataset.current = i;
            board.appendChild(p);
        });
    }

    function handlePieceClick(piece) {
        if (!selectedPiece) {
            selectedPiece = piece;
            piece.classList.add('selected');
        } else {
            // Swap pieces in the DOM
            const board = selectedPiece.parentNode;

            // Swap visually using generic node swap trick
            const siblingA = selectedPiece.nextSibling === piece ? selectedPiece : selectedPiece.nextSibling;
            const siblingB = piece.nextSibling === selectedPiece ? piece : piece.nextSibling;

            board.insertBefore(piece, siblingA);
            board.insertBefore(selectedPiece, siblingB);

            // Swap dataset current
            const temp = selectedPiece.dataset.current;
            selectedPiece.dataset.current = piece.dataset.current;
            piece.dataset.current = temp;

            selectedPiece.classList.remove('selected');
            selectedPiece = null;

            checkPuzzleWin();
        }
    }

    function checkPuzzleWin() {
        const currentPieces = Array.from(board.children);
        let win = true;

        currentPieces.forEach((p, index) => {
            if (parseInt(p.dataset.index) !== index) {
                win = false;
            }
        });

        if (win) {
            triggerSmallConfetti(board);
            document.getElementById('puzzle-reset').textContent = 'You Did It! 🎉';
            setTimeout(() => { document.getElementById('puzzle-reset').textContent = 'Shuffle Puzzle'; }, 3000);
        }
    }
}

/* Lumos / Nox Candles logic */
function initMiniCandles() {
    const flames = document.querySelectorAll('.mini-flame');
    const resultMsg = document.getElementById('candles-result');

    flames.forEach(flame => {
        // Start unlit
        flame.style.opacity = '0';
        flame.dataset.lit = 'false';

        flame.parentElement.addEventListener('click', function castSpell(e) {
            const isLit = flame.dataset.lit === 'true';

            // Create Floating Spell Text
            const spellText = document.createElement('div');
            spellText.className = 'floating-spell';
            spellText.textContent = isLit ? 'Nox!' : 'Lumos!';
            spellText.style.left = `${e.clientX}px`;
            spellText.style.top = `${e.clientY}px`;
            spellText.style.color = isLit ? '#cbd5e1' : '#fbbf24';
            document.body.appendChild(spellText);

            gsap.to(spellText, {
                y: -50,
                opacity: 0,
                duration: 1,
                onComplete: () => spellText.remove()
            });

            if (isLit) {
                // Extinguish
                flame.style.opacity = '0';
                flame.dataset.lit = 'false';
            } else {
                // Light up
                flame.style.opacity = '1';
                flame.dataset.lit = 'true';
                triggerSmallConfetti(this);
            }

            // Check if all lit
            const allLit = Array.from(flames).every(f => f.dataset.lit === 'true');
            if (allLit) {
                resultMsg.textContent = "Brilliant! You've mastered the Lumos spell! ✨";
                resultMsg.classList.add('show');
            } else {
                resultMsg.classList.remove('show');
            }
        });
    });
}

/* Quiz logic */
window.checkQuiz = function (isCorrect, btnElement) {
    const resultMsg = document.getElementById('quiz-result');

    // reset other buttons
    const buttons = btnElement.parentElement.querySelectorAll('.quiz-btn');
    buttons.forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.disabled = true; // disable after answer
    });

    if (isCorrect) {
        btnElement.classList.add('correct');
        resultMsg.textContent = "Yay! You know her so well! 🥰";
        resultMsg.style.color = "#10b981";
        triggerSmallConfetti(btnElement);
    } else {
        btnElement.classList.add('wrong');
        resultMsg.textContent = "Oops! Try again next year! 😝";
        resultMsg.style.color = "#ef4444";
    }

    resultMsg.classList.add('show');
}

function triggerSmallConfetti(element) {
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#ec4899', '#8b5cf6', '#fbbf24']
    });
}

/**
 * 7. Music Player Logic
 */
function initMusicPlayer() {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const playerContainer = document.getElementById('music-player-container');
    const title = document.getElementById('song-title');
    const cover = document.getElementById('album-cover');

    if (!audio || !playBtn) return;

    // Magical Playlist
    const songs = [
        { title: "Hogwarts Music", src: "assets/harry_potter_theme.mp3", cover: "assets/portal-1.jpg" },
        { title: "Leaving Hogwarts", src: "assets/music-song2.mp3", cover: "assets/portal-2.jpg" },
        { title: "Wizarding World Magic", src: "assets/music-song3.mp3", cover: "assets/portal-3.jpg" }
    ];

    let songIndex = 0;
    let isPlaying = false;
    let particleInterval;

    function loadSong(song) {
        title.innerText = song.title;
        audio.src = song.src;
        cover.src = song.cover;
    }

    function playSong() {
        playerContainer.classList.add('playing');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
        isPlaying = true;

        // Start sparkles
        particleInterval = setInterval(createMusicParticle, 500);
    }

    function pauseSong() {
        playerContainer.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
        isPlaying = false;

        clearInterval(particleInterval);
    }

    function prevSong() {
        songIndex--;
        if (songIndex < 0) songIndex = songs.length - 1;
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) songIndex = 0;
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (isNaN(duration)) return;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    function createMusicParticle() {
        const icons = ['✨', '🎵', '💖', '🌟'];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const particle = document.createElement('div');
        particle.className = 'music-particle';
        particle.innerText = icon;

        // Position around the player
        const rect = playerContainer.getBoundingClientRect();
        const x = Math.random() * rect.width;

        particle.style.left = `${x}px`;
        particle.style.bottom = `50px`;

        playerContainer.appendChild(particle);

        gsap.to(particle, {
            y: -200 - Math.random() * 100,
            x: `+=${Math.random() * 60 - 30}`,
            opacity: 0,
            duration: 2 + Math.random() * 2,
            ease: "power1.out",
            onComplete: () => particle.remove()
        });
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) pauseSong();
        else playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    audio.addEventListener('ended', nextSong);

    // Init first song
    loadSong(songs[songIndex]);
}

/**
 * 8. Surprise Section Logic
 */
function initSurprise() {
    const btn = document.getElementById('surprise-btn');
    const msgContainer = document.getElementById('surprise-message');

    if (!btn) return;

    btn.addEventListener('click', () => {
        // Hide button
        gsap.to(btn, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.in(1.7)",
            onComplete: () => {
                btn.classList.add('hidden');
                msgContainer.classList.remove('hidden');

                // Show message
                gsap.fromTo(msgContainer,
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
                );

                // Confetti shower
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;

                function frame() {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return;

                    confetti({
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#ec4899', '#8b5cf6', '#fbbf24']
                    });
                    confetti({
                        particleCount: 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#ec4899', '#8b5cf6', '#fbbf24']
                    });

                    requestAnimationFrame(frame);
                }
                frame();

                // Release balloons from bottom
                releaseBalloons();
            }
        });
    });
}

/**
 * 9. Interactive Big Cake Celebration
 */
function initBigCake() {
    const bigCake = document.getElementById('big-cake');
    const flames = document.querySelectorAll('.bc-flame');
    const msg = document.getElementById('big-cake-msg');

    if (!bigCake || flames.length === 0) return;

    let blown = 0;

    flames.forEach(flame => {
        flame.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent clicking cake
            if (flame.style.opacity === '0') return;

            flame.style.opacity = '0';
            flame.style.pointerEvents = 'none';
            blown++;

            if (blown === flames.length) {
                // All blown, ready to cut
                msg.textContent = "2. Now click the cake to cut a slice!";
                bigCake.classList.add('ready-to-cut');
                triggerSmallConfetti(msg);
            }
        });
    });

    bigCake.addEventListener('click', () => {
        if (bigCake.classList.contains('ready-to-cut') && !bigCake.classList.contains('cut')) {
            bigCake.classList.remove('ready-to-cut');
            bigCake.classList.add('cut');
            msg.textContent = "Cake is served! Happy Birthday! 🎉💖";

            // Grand fireworks
            fireworksConfetti();
        }
    });

}

/**
 * 10. Secret Vault Logic
 */
function initVault() {
    const trigger = document.getElementById('secret-trigger');
    const vault = document.getElementById('secret-vault');
    const closeBtn = document.getElementById('close-vault');

    if (!trigger || !vault) return;

    trigger.addEventListener('click', () => {
        vault.classList.remove('hidden');

        // Change icon to unlock momentarily
        trigger.innerHTML = '<i class="fas fa-unlock"></i>';
        trigger.style.color = 'var(--accent-gold)';

        triggerSmallConfetti(trigger);
    });

    closeBtn.addEventListener('click', () => {
        vault.classList.add('hidden');
        trigger.innerHTML = '<i class="fas fa-lock"></i>';
        trigger.style.color = 'rgba(255, 255, 255, 0.1)';
    });

    vault.addEventListener('click', (e) => {
        if (e.target === vault) {
            closeBtn.click();
        }
    });
}

/**
 * 11. Mini Movie Logic
 */
function initMovies() {
    const playBtn = document.getElementById('movie-start-btn');
    const audio = document.getElementById('movie-audio');
    const slides = document.querySelectorAll('.movie-slide');

    if (!playBtn || slides.length === 0) return;

    let currentSlide = 0;
    let movieInterval;
    let isPlaying = false;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function startMovie() {
        if (isPlaying) {
            // Stop Movie
            clearInterval(movieInterval);
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i> Play Movie';
            isPlaying = false;
            return;
        }

        // Start Movie
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Movie';
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio autoplay prevented'));

        currentSlide = 0;
        showSlide(currentSlide);

        // Slide duration = 5 seconds
        movieInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= slides.length) {
                // End of movie
                clearInterval(movieInterval);
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-redo"></i> Replay Movie';
                isPlaying = false;
            } else {
                showSlide(currentSlide);
            }
        }, 5000);
    }

    playBtn.addEventListener('click', startMovie);
}

/**
 * 12. Hogwarts Letter Animation
 */
function initHogwartsLetter() {
    const letterBtn = document.getElementById('letter-btn');
    const modal = document.getElementById('letter-modal');
    const closeBtn = document.getElementById('close-letter');
    const envelope = document.getElementById('envelope');

    if (!letterBtn || !modal) return;

    letterBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        envelope.classList.remove('open');
        envelope.classList.remove('drop-in');

        // Let display apply, then animate drop
        setTimeout(() => {
            envelope.classList.add('drop-in');
        }, 100);

        // Trigger envelope open and paper slide after drop
        setTimeout(() => {
            envelope.classList.add('open');
            triggerSmallConfetti(envelope);
            // Show close button
            setTimeout(() => {
                closeBtn.style.opacity = '1';
                closeBtn.style.pointerEvents = 'auto';
            }, 2500);
        }, 1500);
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        closeBtn.style.opacity = '0';
        closeBtn.style.pointerEvents = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

/**
 * 13. Patronus Game
 */
function initPatronusGame() {
    const btn = document.getElementById('patronus-btn');
    const container = document.querySelector('.patronus-game-container');
    if (!btn || !container) return;

    const icons = ['fa-cat', 'fa-dog', 'fa-horse', 'fa-dragon', 'fa-dove', 'fa-otter'];

    btn.addEventListener('click', () => {
        let spirit = container.querySelector('.patronus-spirit');
        if (spirit) spirit.remove();

        spirit = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        spirit.className = `fas ${randomIcon} patronus-spirit`;
        container.appendChild(spirit);

        setTimeout(() => {
            spirit.classList.add('summoned');
            triggerSmallConfetti(btn);
        }, 50);

        btn.innerHTML = "Expecto Patronum! ✨";
        btn.style.boxShadow = "0 0 30px var(--accent-glow)";

        setTimeout(() => {
            spirit.classList.remove('summoned');
            setTimeout(() => spirit.remove(), 1000);
            btn.innerHTML = "Expecto Patronum 🪄";
            btn.style.boxShadow = "0 0 15px var(--accent-glow)";
        }, 5000);
    });
}

/**
 * 14. Global 3D Tilt Hover Effect for Premium Layout
 */
function init3DTiltEffects() {
    const cards = document.querySelectorAll('.glass-card, .polaroid-card');

    cards.forEach(card => {
        // Prevent stacking matrix transforms logic clashes
        let initialTransform = window.getComputedStyle(card).transform;
        if (initialTransform === 'none') {
            initialTransform = '';
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angle (-8 to 8 deg max)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
}

/**
 * 15. Sorting Hat Ceremony
 */
function initSortingHat() {
    const btn = document.getElementById('sorting-hat-btn');
    const modal = document.getElementById('sorting-modal');
    const startBtn = document.getElementById('start-sorting');
    const closeBtn = document.getElementById('close-sorting');
    const result = document.getElementById('sorting-result');
    const text = document.getElementById('sorting-text');

    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        result.style.opacity = '0';
        closeBtn.style.display = 'none';
        startBtn.style.display = 'inline-block';
        text.textContent = "Hmm, difficult. Very difficult. Plenty of courage, I see. Not a bad mind either. There's talent, oh my goodness, yes... but where to put you?";
    });

    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        text.textContent = "Better be...";

        let dots = 0;
        let thinkingInterval = setInterval(() => {
            text.textContent += ".";
            dots++;
            if (dots % 3 === 0) text.textContent = "Better be...";
        }, 500);

        setTimeout(() => {
            clearInterval(thinkingInterval);
            text.textContent = "I know exactly where you belong!";
            result.style.opacity = '1';

            // Randomly select house, or special House of Kittu
            const houses = [
                { name: 'GRYFFINDOR!', color: '#dc2626' },
                { name: 'RAVENCLAW!', color: '#3b82f6' },
                { name: 'HUFFLEPUFF!', color: '#eab308' },
                { name: 'SLYTHERIN!', color: '#16a34a' },
                { name: 'HOUSE OF KITTU!', color: '#d946ef' }
            ];
            const house = houses[Math.floor(Math.random() * houses.length)];

            result.textContent = house.name;
            result.style.color = house.color;

            fireworksConfetti();
            closeBtn.style.display = 'inline-block';
        }, 2500);
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

/**
 * 16. Potions Game
 */
function initPotionsGame() {
    const btns = document.querySelectorAll('.ingredient-btn');
    const liquid = document.getElementById('cauldron-liquid');
    const result = document.getElementById('potion-result');
    if (!liquid || btns.length === 0) return;

    let added = 0;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            btn.disabled = true;
            btn.style.opacity = '0.5';
            added++;

            // Drop effect
            triggerSmallConfetti(btn);

            if (added === 1) {
                liquid.style.height = '40px';
                liquid.style.background = btn.dataset.color === 'blue' ? '#3b82f6' : '#eab308';
            } else if (added === 2) {
                liquid.classList.add('mixed');
                result.textContent = "Felix Felicis brewed! Good luck is coming your way! ✨";
                result.classList.add('show');
                result.style.color = '#10b981';
                setTimeout(() => fireworksConfetti(), 500);
            }
        });
    });
}
