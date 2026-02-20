let usuario_id = null;
let conversacionActiva = null;

const loginModal = document.getElementById("loginModal");
const mensajesContenedor = document.getElementById("mensajes");
const listaConversaciones = document.getElementById("listaConversaciones");
const inputMensaje = document.getElementById("mensajeInput");
const loginError = document.getElementById("loginError");

/* =========================
   LOGIN
========================= */

document.getElementById("loginBtn").onclick = async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    loginError.textContent = "";

    try {
        const res = await fetch("../api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username, password })
        });

        const data = await res.json();

        if (data.ok) {

            usuario_id = data.id;

            localStorage.setItem("chatbox_usuario_id", data.id);

            loginModal.style.display = "none";

            await mostrarBienvenida();
            await cargarConversaciones();

        } else {
            loginError.textContent = data.error || "Credenciales incorrectas";
        }

    } catch (err) {
        loginError.textContent = "Error de conexión con el servidor";
    }
};


/* =========================
   REGISTRO
========================= */

document.getElementById("registerBtn").onclick = async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const res = await fetch("../api/registro.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username, password })
        });

        const data = await res.json();

        if (data.ok) {
            loginError.textContent = "Usuario creado correctamente";
        } else {
            loginError.textContent = data.error;
        }

    } catch (err) {
        loginError.textContent = "Error al registrar usuario";
    }
};


/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("chatbox_usuario_id");

    usuario_id = null;
    conversacionActiva = null;

    mensajesContenedor.innerHTML = "";
    listaConversaciones.innerHTML = "";

    loginModal.style.display = "flex";
};


/* =========================
   BIENVENIDA CENTRAL
========================= */

async function mostrarBienvenida() {

    try {
        const res = await fetch("../api/bienvenida.php");
        const data = await res.json();

        mensajesContenedor.innerHTML = "";

        const div = document.createElement("div");
        div.id = "bienvenidaCentral";
        div.textContent = data[0]?.frase || "Bienvenido";

        mensajesContenedor.appendChild(div);

    } catch (err) {
        console.error("Error cargando bienvenida");
    }
}


/* =========================
   CARGAR CONVERSACIONES
========================= */

async function cargarConversaciones() {

    try {
        const res = await fetch("../api/conversaciones.php");
        const data = await res.json();

        if (data.error) return;

        listaConversaciones.innerHTML = "";

        data.forEach(conv => {

            const div = document.createElement("div");
            div.textContent = conv.titulo;
            div.onclick = () => cargarMensajes(conv.id);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.style.marginLeft = "10px";

            deleteBtn.onclick = async (e) => {
                e.stopPropagation();

                await fetch("../api/borrar_conversacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ id: conv.id })
                });

                await cargarConversaciones();
                mensajesContenedor.innerHTML = "";
            };

            div.appendChild(deleteBtn);
            listaConversaciones.appendChild(div);
        });

    } catch (err) {
        console.error("Error cargando conversaciones");
    }
}


/* =========================
   CARGAR MENSAJES
========================= */

async function cargarMensajes(id) {

    conversacionActiva = id;

    try {
        const res = await fetch(`../api/mensajes.php?conversacion_id=${id}`);
        const data = await res.json();

        mensajesContenedor.innerHTML = "";

        data.forEach(msg => {

            const div = document.createElement("div");
            div.classList.add("mensaje", msg.rol);
            div.textContent = msg.contenido;

            mensajesContenedor.appendChild(div);
        });

        mensajesContenedor.scrollTop = mensajesContenedor.scrollHeight;

    } catch (err) {
        console.error("Error cargando mensajes");
    }
}


/* =========================
   NUEVO CHAT
========================= */

document.getElementById("nuevoChat").onclick = async () => {
    conversacionActiva = null;
    await mostrarBienvenida();
};


/* =========================
   ENVIAR MENSAJE + OLLAMA
========================= */

async function enviarMensaje(texto) {

    if (!texto || texto.trim() === "") return;

    if (!usuario_id) {
        console.log("No hay sesión activa");
        return;
    }

    const bienvenida = document.getElementById("bienvenidaCentral");
    if (bienvenida) bienvenida.remove();

    try {

        if (!conversacionActiva) {

            const res = await fetch("../api/crear_conversacion.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ titulo: texto })
            });

            const data = await res.json();
            conversacionActiva = data.id;

            await cargarConversaciones();
        }

        const mensajeUsuario = document.createElement("div");
        mensajeUsuario.classList.add("mensaje", "usuario");
        mensajeUsuario.textContent = texto;
        mensajesContenedor.appendChild(mensajeUsuario);

        mensajesContenedor.scrollTop = mensajesContenedor.scrollHeight;

        const resIA = await fetch("../api/ollama.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                conversacion_id: conversacionActiva,
                mensaje: texto
            })
        });

        const dataIA = await resIA.json();

        const mensajeIA = document.createElement("div");
        mensajeIA.classList.add("mensaje", "asistente");
        mensajeIA.textContent = dataIA.respuesta || "Sin respuesta";

        mensajesContenedor.appendChild(mensajeIA);

        mensajesContenedor.scrollTop = mensajesContenedor.scrollHeight;

    } catch (err) {
        console.error("Error enviando mensaje");
    }
}

inputMensaje.addEventListener("keydown", async e => {
    if (e.key === "Enter") {
        const texto = inputMensaje.value.trim();
        inputMensaje.value = "";
        await enviarMensaje(texto);
    }
});


/* =========================
   SPEECH RECOGNITION
========================= */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    let escuchando = false;

    document.getElementById("micBtn").onclick = () => {

        if (escuchando) {
            recognition.stop();
            return;
        }

        recognition.start();
    };

    recognition.onstart = () => {
        escuchando = true;
        console.log("🎤 Escuchando...");
    };

    recognition.onend = () => {
        escuchando = false;
        console.log("🛑 Reconocimiento detenido");
    };

    recognition.onresult = async (event) => {
        const texto = event.results[0][0].transcript;
        await enviarMensaje(texto);
    };

    recognition.onerror = (event) => {
        console.log("Error reconocimiento:", event.error);
    };
}


/* =========================
   PERSISTENCIA DE SESIÓN
========================= */

window.addEventListener("DOMContentLoaded", async () => {

    const storedId = localStorage.getItem("chatbox_usuario_id");

    if (storedId) {
        usuario_id = storedId;
        loginModal.style.display = "none";
        await mostrarBienvenida();
        await cargarConversaciones();
    } else {
        loginModal.style.display = "flex";
    }
});
