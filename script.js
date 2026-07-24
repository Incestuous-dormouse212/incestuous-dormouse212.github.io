// 1. Connect to Supabase
const PROJECT_URL = "https://wzjlytqilsjcboqpwldz.supabase.co/";
const PUBLISHABLE_KEY = "sb_publishable_Nyt-q7qFiYGd7aV25sgGuQ_yk-1gHxN";

const client = window.supabase.createClient(
    PROJECT_URL,
    PUBLISHABLE_KEY
);


// Store selected appointments
let selectedAppointments = [];


// Format dates for display
function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}


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

    // Group appointments by date
    const groupedDates = {};

    data.forEach(slot => {

        if (!groupedDates[slot.date]) {
            groupedDates[slot.date] = [];
        }

        groupedDates[slot.date].push(slot);

    });


    // Create sections for each day
    Object.keys(groupedDates).forEach(date => {

        const daySection = document.createElement("div");
        daySection.className = "day-section";


        const heading = document.createElement("h3");
        heading.textContent = formatDate(date);

        daySection.appendChild(heading);


      groupedDates[date].forEach(slot => {

    const option = document.createElement("label");
    option.className = "appointment-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = slot.id;


    const labelText = document.createElement("span");
    labelText.textContent = slot.time;


           if (slot.booked) {

    checkbox.disabled = true;
    labelText.textContent += " (Booked)";

            } else {

                checkbox.addEventListener("change", () => {

                    if (checkbox.checked) {
                        selectedAppointments.push(slot.id);
                    } else {
                        selectedAppointments = selectedAppointments.filter(
                            id => id !== slot.id
                        );
                    }

                    console.log("Selected:", selectedAppointments);

                });

            }


          option.appendChild(checkbox);
option.appendChild(labelText);

daySection.appendChild(option);

        });


        container.appendChild(daySection);

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
