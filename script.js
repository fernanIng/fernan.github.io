
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

appointmentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // RECUPERAR LOS DATOS

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const modality = document.getElementById("modality").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const privacy = document.getElementById("privacy").checked;

    // VALIDAR LOS DATOS

    if (!name || !email || !modality || !date || !time) {
        showMessage("Completa todos los campos obligatorios.", false);
        return;
    }

    if (!privacy) {
        showMessage("Debes aceptar la información de privacidad.", false);
        return;
    }

    if (date < localToday) {
        showMessage("Selecciona una fecha válida.", false);
        return;
    }

    // MOSTRAR RESULTADO DE LA DEMOSTRACIÓN

    const formattedDate = new Date(date + "T12:00:00")
        .toLocaleDateString("es-ES");

    showMessage(
        `Gracias, ${name}. Has seleccionado una solicitud para el ${formattedDate}, en horario de ${time}, modalidad ${modality}. Esta es una demostración: la solicitud no se ha enviado ni la cita está confirmada.`,
        true
    );

    appointmentForm.reset();

    // RESTABLECER LA FECHA MÍNIMA

    dateInput.min = localToday;
});

// FUNCIÓN PARA MOSTRAR MENSAJES

function showMessage(message, success) {

    formMessage.textContent = message;

    formMessage.style.color = success ? "#405747" : "#b33a3a";
}
