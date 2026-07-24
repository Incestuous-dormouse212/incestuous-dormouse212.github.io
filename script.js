// 1. Connect to Supabase
const PROJECT_URL = "https://wzjlytqilsjcboqpwldz.supabase.co/";
const PUBLISHABLE_KEY = "sb_publishable_Nyt-q7qFiYGd7aV25sgGuQ_yk-1gHxN";

const client = window.supabase.createClient(
    PROJECT_URL,
    PUBLISHABLE_KEY
);


// Store selected appointments
let selectedAppointments = [];


// 2. Load appointments
async function loadAppointments() {

    const { data, error } = await client
        .from("appointments")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    const container = document.getElementById("dates");
    container.innerHTML = "";

    data.forEach(slot => {

        const option = document.createElement("div");

        option.innerHTML = `
            <label>
                <input type="checkbox" value="${slot.id}">
                ${slot.date} ${slot.time}
            </label>
        `;

        const checkbox = option.querySelector("input");

        if (slot.booked) {
            checkbox.disabled = true;
            option.innerHTML += " (Booked)";
        } else {

            checkbox.onchange = () => {

                if (checkbox.checked) {
                    selectedAppointments.push(slot.id);
                } else {
                    selectedAppointments =
                        selectedAppointments.filter(id => id !== slot.id);
                }

                console.log(selectedAppointments);
            };
        }

        container.appendChild(option);
    });
}


// 3. Submit selected appointment
async function submitAppointment() {

    for (const id of selectedAppointments) {

        const { error } = await client
            .from("appointments")
            .update({ booked: true })
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }
    }

    alert("Appointment submitted!");

    selectedAppointments = [];

    loadAppointments();
}


// 4. Button connection
document
    .getElementById("submitAppointment")
    .onclick = submitAppointment;


// 5. Start page
loadAppointments();
