function eventCard(event) {
  const seats = Math.max(event.capacity - event.registeredCount, 0);
  const date = new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `
    <article class="event-card">
      <div class="event-image ${event.category.toLowerCase()}"><span>${event.category}</span><b>✦</b></div>
      <div class="event-body">
        <h3>${escapeHtml(event.title)}</h3>
        <p class="muted">${escapeHtml(event.description).slice(0, 100)}${event.description.length > 100 ? "..." : ""}</p>
        <div class="event-meta"><span>📅 ${date}</span><span>📍 ${escapeHtml(event.venue)}</span></div>
        <div class="card-bottom"><small>${seats} seats left</small><a class="text-link" href="event-details.html?id=${event._id}">Details →</a></div>
      </div>
    </article>`;
}

async function loadEvents(targetId = "eventsGrid", limit = null) {
  const target = typeof targetId === "string" ? document.getElementById(targetId) : document.getElementById("eventsGrid");
  if (!target) return;
  try {
    const params = new URLSearchParams();
    const s = document.getElementById("search")?.value;
    const c = document.getElementById("category")?.value;
    if (s) params.set("search", s);
    if (c && c !== "All") params.set("category", c);

    let events = await api("/events?" + params.toString());
    if (limit) events = events.slice(0, limit);
    target.innerHTML = events.length ? events.map(eventCard).join("") : `<div class="empty">No events found.</div>`;
  } catch (err) {
    target.innerHTML = `<div class="empty">${err.message}. Start the backend server first.</div>`;
  }
}

async function loadEventDetail() {
  const target = document.getElementById("eventDetail");
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return target.innerHTML = `<div class="empty">Event ID missing.</div>`;

  try {
    const e = await api("/events/" + id);
    const date = new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const seats = Math.max(e.capacity - e.registeredCount, 0);
    target.innerHTML = `
      <div class="detail">
        <div class="detail-banner ${e.category.toLowerCase()}"><span>${e.category}</span><b>✦</b></div>
        <div class="detail-content">
          <p class="eyebrow">${e.status.toUpperCase()}</p>
          <h1>${escapeHtml(e.title)}</h1>
          <p class="lead">${escapeHtml(e.description)}</p>
          <div class="detail-grid">
            <div><span>DATE</span><strong>${date}</strong></div>
            <div><span>TIME</span><strong>${e.startTime} – ${e.endTime}</strong></div>
            <div><span>VENUE</span><strong>${escapeHtml(e.venue)}</strong></div>
            <div><span>SEATS</span><strong>${seats} available</strong></div>
          </div>
          <button class="btn" onclick="registerForEvent('${e._id}')">Register Now →</button>
          <p id="detailMessage" class="form-message"></p>
        </div>
      </div>`;
  } catch (err) {
    target.innerHTML = `<div class="empty">${err.message}</div>`;
  }
}

async function registerForEvent(eventId) {
  if (!localStorage.getItem("token")) return location.href = "login.html";
  const message = document.getElementById("detailMessage");
  try {
    await api("/registrations", { method: "POST", body: JSON.stringify({ eventId }) });
    message.textContent = "Registration successful! Check your dashboard.";
    message.className = "form-message success";
  } catch (err) {
    message.textContent = err.message;
    message.className = "form-message error";
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}
