document.addEventListener("DOMContentLoaded", function () {
    // Load timeline JSON
    fetch("events.json")
        .then(response => response.json())
        .then(data => {
            console.log("JSON loaded:", data);

            // Prepare events
            const timelineData = {
                events: data.Sudan_Internet_History.map(item => ({
                    year: item.year,
                    event: item.event,
                    description: item.impact,
                    category: categorizeEvent(item.event),
                    impact: "High" // optional tag, you can adjust per event
                }))
            };

            // Compile Handlebars template
            const source = document.getElementById("timeline-template").innerHTML;
            const template = Handlebars.compile(source);
            const timelineHTML = template(timelineData);

            // Inject events into page
            document.getElementById("timeline-events").innerHTML = timelineHTML;

            // Filtering buttons
            const filterButtons = document.querySelectorAll(".filter-btn");
            filterButtons.forEach(btn => {
                btn.addEventListener("click", function () {
                    const category = this.getAttribute("data-filter");

                    filterButtons.forEach(b => b.classList.remove("active"));
                    this.classList.add("active");

                    const items = document.querySelectorAll(".timeline-item");
                    items.forEach(item => {
                        if (category === "all" || item.dataset.category === category) {
                            item.style.display = "flex";
                        } else {
                            item.style.display = "none";
                        }
                    });
                });
            });

            // Render Challenges if available
            if (data.Challenges) {
                renderChallenges(data.Challenges);
            }
        })
        .catch(error => console.error("Error loading timeline data:", error));
});

// Categorize events for filtering
function categorizeEvent(eventText) {
    const text = eventText.toLowerCase();
    if (text.includes("2g") || text.includes("3g") || text.includes("4g") || text.includes("services") || text.includes("infrastructure")) {
        return "technology";
    } else if (text.includes("protest") || text.includes("revolution") || text.includes("youth") || text.includes("diaspora") || text.includes("startups")) {
        return "social";
    } else if (text.includes("shutdown") || text.includes("blackout") || text.includes("war") || text.includes("blocks") || text.includes("control")) {
        return "challenges";
    }
    return "technology"; // fallback
}

// Render challenges section
function renderChallenges(challenges) {
    const container = document.createElement("section");
    container.classList.add("challenges-section");
    container.innerHTML = `
        <div class="container">
            <h2>Key Digital Challenges in Sudan</h2>
            <div class="challenges-grid">
                ${challenges.map(c => `
                    <div class="challenge-card">
                        <h3>${c.challenge}</h3>
                        <p>${c.impact}</p>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    // Insert just before footer (so it shows after the summary section)
    document.querySelector("footer").before(container);
}
