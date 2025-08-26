document.addEventListener("DOMContentLoaded", function () {
    // Load timeline JSON
    fetch("events.json")
        .then(response => response.json())
        .then(data => {
            console.log("JSON loaded:", data);

            // ===============================
            // Merge Sudan_Internet_History + Challenges
            // ===============================
            const historyEvents = data.Sudan_Internet_History.map(item => ({
                year: item.year,
                event: item.event,
                description: item.impact,
                category: categorizeEvent(item.event),
                impact: "High"
            }));

          const challengeEvents = data.Challenges.map(item => ({
    year: "—", // use a dash instead of "Challenges"
    event: item.challenge,
    description: item.impact,
    category: "challenge",
    impact: "Ongoing"
}));


            // Combine both arrays
            const timelineData = {
                events: [...historyEvents, ...challengeEvents]
            };

            // ===============================
            // Compile Handlebars template
            // ===============================
            const source = document.getElementById("timeline-template").innerHTML;
            const template = Handlebars.compile(source);
            const timelineHTML = template(timelineData);
            document.getElementById("timeline-events").innerHTML = timelineHTML;

            // ===============================
            // Filtering buttons
            // ===============================
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
        })
        .catch(error => console.error("Error loading timeline data:", error));
});

// Categorize events
function categorizeEvent(eventText) {
    const text = eventText.toLowerCase();
    if (
        text.includes("2g") || text.includes("3g") || text.includes("4g") ||
        text.includes("5g") || text.includes("services") ||
        text.includes("infrastructure") || text.includes("broadband") ||
        text.includes("telecom") || text.includes("satellite") ||
        text.includes("dsl")
    ) {
        return "technology";
    }
    return "social";
}
