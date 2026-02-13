document.addEventListener('DOMContentLoaded', () => {
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const welcomeScreen = document.getElementById('welcome-screen');
    const memoriesScreen = document.getElementById('memories-screen');
    const introMusic = document.getElementById('music-intro');
    const bgMusic = document.getElementById('bg-music');
    const sndError = document.getElementById('snd-error');

    let clickCount = 0;

    const mensajesNo = [
        "¿Segura?",
        "Piénsalo otra vez...",
        "Kiki va a estar triste",
        "¿Y si te doy un abrazo?",
        "Mira el botón azul, es más bonito",
        "Andaaaaa, di que sí...",
        "Me voy a ir con la otra",
        "Voy a llorar...",
        "Este botón no funciona, de verdad",
        "YAAAAAA"
    ];

    // Iniciar música de intro al primer toque (Permiso del navegador)
    document.body.addEventListener('touchstart', () => {
        if(introMusic.paused) {
            introMusic.volume = 0.3;
            introMusic.play();
        }
    }, { once: true });

    // --- FUNCIÓN ÚNICA PARA EL BOTÓN NO ---
    const hacerTrampa = (e) => {
        // Prevenir comportamiento por defecto en móviles
        if (e && e.type === 'touchstart') e.preventDefault();

        // Sonido de error
        if (sndError) {
            sndError.currentTime = 0;
            sndError.volume = 0.4;
            sndError.play().catch(err => console.log("Audio bloqueado"));
        }

        clickCount++;

        // 1. Aumentar el tamaño del botón SÍ
        const escalaBase = 1 + (clickCount * 0.35); 
        btnYes.style.transform = `scale(${escalaBase})`;

        // 2. Empuje físico para que no se encimen
        if(window.innerWidth < 480) {
            btnYes.style.marginBottom = `${clickCount * 25}px`;
        } else {
            btnYes.style.marginRight = `${clickCount * 40}px`;
        }

        // 3. Mover un poco el botón NO
        const x = Math.random() * 30 - 15;
        const y = Math.random() * 30 - 15;
        btnNo.style.transform = `translate(${x}px, ${y}px)`;

        // 4. Cambiar el texto del botón NO
        if (clickCount < mensajesNo.length) {
            btnNo.textContent = mensajesNo[clickCount];
        } else {
            btnNo.textContent = "Ok, ya no hay opción";
            btnNo.style.opacity = "0.5";
            btnNo.style.pointerEvents = "none"; 
        }

        // 5. Agregar latido si es muy grande
        if (clickCount > 4) {
            btnYes.classList.add('heartbeat');
        }
    };

    // --- ASIGNACIÓN DE EVENTOS AL NO ---
    btnNo.addEventListener('mouseover', hacerTrampa);
    btnNo.addEventListener('touchstart', hacerTrampa);

    // --- LÓGICA DEL SÍ ---
    btnYes.addEventListener('click', () => {
        // Fade out música de intro
        let fadeOut = setInterval(() => {
            if (introMusic.volume > 0.05) {
                introMusic.volume -= 0.05;
            } else {
                introMusic.pause();
                clearInterval(fadeOut);
            }
        }, 100);

        // Cambio de pantalla
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            memoriesScreen.classList.remove('hidden');

            // Scroll habilitado para ver recuerdos
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';

            // Fade in música de fondo
            bgMusic.volume = 0;
            bgMusic.play().then(() => {
                let fadeAudio = setInterval(() => {
                    if (bgMusic.volume < 0.5) {
                        bgMusic.volume = Math.min(0.5, bgMusic.volume + 0.05);
                    } else {
                        clearInterval(fadeAudio);
                    }
                }, 150);
            }).catch(e => console.log("Error de audio:", e));
        }, 800);
    });
});
