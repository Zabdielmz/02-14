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

    document.body.addEventListener('touchstart', () => {
        if(introMusic.paused) {
            introMusic.volume = 0.3; // Volumen suave para la intro
            introMusic.play();
        }
    }, { once: true });

    // --- Lógica del SÍ ---
    btnYes.addEventListener('click', () => {
        let fadeOut = setInterval(() => {
            if (introMusic.volume > 0.05) {
                introMusic.volume -= 0.05;
            } else {
                introMusic.pause();
                clearInterval(fadeOut);
            }
        }, 100);

        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        memoriesScreen.classList.remove('hidden');

        // --- EFECTO FADE-IN DE MÚSICA ---
        bgMusic.volume = 0; // Empezamos en silencio total
        bgMusic.play().then(() => {
            // Subir el volumen gradualmente cada 200 milisegundos
            let fadeAudio = setInterval(() => {
                // Si el volumen es menor a 0.5 (o el máximo que quieras)
                if (bgMusic.volume < 0.5) {
                    bgMusic.volume = Math.min(0.5, bgMusic.volume + 0.05);
                } else {
                    // Cuando llega al volumen deseado, detenemos el intervalo
                    clearInterval(fadeAudio);
                }
            }, 100); // Velocidad del incremento
        }).catch(e => console.log("Error al reproducir:", e));

    }, 800);
    });

    // --- Lógica del NO (Persuasión sin superposición) ---
    const hacerTrampa = () => {
        if (e.type === 'touchstart') e.preventDefault();
        sndError.currentTime = 0; // Reinicia el sonido si ya estaba sonando
        sndError.volume = 0.4;    // Volumen un poco más bajo que la música
        sndError.play().catch(e => console.log("Sonido bloqueado temporalmente"));
        clickCount++;

        // 1. Aumentar el tamaño VISUAL del botón SÍ
        const escalaBase = 1 + (clickCount * 0.35); 
        btnYes.style.transform = `scale(${escalaBase})`;

        if(window.innerWidth < 480) {
            btnYes.style.marginBottom = `${clickCount * 20}px`;
        } else {
            btnYes.style.marginRight = `${clickCount * 30}px`;
        }
        
        // 2. NUEVO: Añadir MARGEN FÍSICO para empujar al otro botón
        // Cuantos más clicks, más margen a la derecha del botón SÍ
        const nuevoMargen = clickCount * 40; // 40px extra por cada interacción
        btnYes.style.marginRight = `${nuevoMargen}px`;

        // 3. Mover un poco el botón NO para que sea juguetón
        const x = Math.random() * 30 - 15;
        const y = Math.random() * 30 - 15;
        // Aplicamos el movimiento sutil
        btnNo.style.transform = `translate(${x}px, ${y}px)`;

        // 4. Cambiar el texto del botón NO
        if (clickCount < mensajesNo.length) {
            btnNo.textContent = mensajesNo[clickCount];
        } else {
            btnNo.textContent = "Ok, ya no hay opción";
            btnNo.style.opacity = "0.5";
            btnNo.style.pointerEvents = "none"; 
        }

        // 5. Latido si es muy grande
        if (clickCount > 4) {
            btnYes.classList.add('heartbeat');
        }
    };

    // Eventos para el botón NO
    btnNo.addEventListener('mouseover', hacerTrampa);
    btnNo.addEventListener('touchstart', hacerTrampa);

    btnYes.addEventListener('click', () => {
        // Fade out intro, Fade in principal
        let vol = 0.2;
        const fadeOut = setInterval(() => {
            if (vol > 0) {
                vol -= 0.02;
                introMusic.volume = Math.max(0, vol);
            } else {
                introMusic.pause();
                clearInterval(fadeOut);
            }
        }, 50);

        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('memories-screen').classList.remove('hidden');
        
        // Scroll habilitado para ver los recuerdos
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        bgMusic.volume = 0;
        bgMusic.play();
        // Fade in
        let volIn = 0;
        const fadeIn = setInterval(() => {
            if (volIn < 0.5) {
                volIn += 0.05;
                bgMusic.volume = volIn;
            } else {
                clearInterval(fadeIn);
            }
        }, 200);
    });
});
