
// MENÚ PARA MÓVILES

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// CERRAR MENÚ AL SELECCIONAR UNA SECCIÓN

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// EVITAR SELECCIONAR FECHAS PASADAS

const dateInput = document.getElementById("date");

const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;

// FORMULARIO DE SOLICITUD DE CITA

const appointmentForm = document.getElementById("appointmentForm");
const formMessage = document.getElementById("formMessage");

appointmentForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    formMessage.textContent = "";

    // VALIDAR LOS CAMPOS Y LA ACEPTACIÓN DE PRIVACIDAD
    if (!appointmentForm.reportValidity()) {
        return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const modality = document.getElementById("modality").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (date < localToday) {
        showMessage("Selecciona una fecha válida.", false);
        dateInput.focus();
        return;
    }

    // Solo se envían datos de contacto y preferencias de cita.
    const payload = {
        name,
        email,
        phone,
        modality,
        date,
        time,
        _replyto: email
    };
    const submitButton = appointmentForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    appointmentForm.setAttribute("aria-busy", "true");

    try {
        const response = await fetch(
            "https://formsubmit.co/ajax/albamartospsico@gmail.com",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );
        const result = await response.json().catch(() => null);

        if (!response.ok || !result ||
            (result.success !== true && result.success !== "true")) {
            throw new Error("FormSubmit did not accept the request.");
        }

        showMessage(
            `Gracias, ${name}. Tu solicitud se ha enviado. Te contactaremos para confirmar la cita.`,
            true
        );
        appointmentForm.reset();
        dateInput.min = localToday;
    } catch (error) {
        showMessage(
            "No se pudo enviar la solicitud. Comprueba tu conexión e inténtalo de nuevo; tus datos siguen en el formulario.",
            false
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar solicitud";
        appointmentForm.setAttribute("aria-busy", "false");
    }
});

// // FUNCIÓN PARA MOSTRAR MENSAJES

function showMessage(message, success) {

    formMessage.textContent = message;

    formMessage.style.color = success ? "#405747" : "#b33a3a";
}
