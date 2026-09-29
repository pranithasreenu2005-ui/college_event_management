async function loadDashboard() {
  const user = currentUser();
  if (!user) return location.href = "login.html";
  document.getElementById("welcome").textContent = `Hi, ${user.name.split(" ")[0]}.`;
  try {
    const regs = await api("/registrations/my");
    const now = new Date();
    const upcoming = regs.filter(r => r.event && new Date(r.event.date) >= now);
    const attended = regs.filter(r => r.attendance === "present");

    document.getElementById("registeredCount").textContent = regs.length;
    document.getElementById("upcomingCount").textContent = upcoming.length;
    document.getElementById("attendedCount").textContent = attended.length;

    document.getElementById("myRegistrations").innerHTML = regs.length
      ? regs.map(r => `<article class="event-card compact-card">
          <div class="event-image ${r.event.category.toLowerCase()}"><span>${r.event.category}</span><b>✦</b></div>
          <div class="event-body"><h3>${escapeHtml(r.event.title)}</h3>
          <p class="muted">📅 ${new Date(r.event.date).toLocaleDateString("en-IN")} · 📍 ${escapeHtml(r.event.venue)}</p>
          <div class="card-bottom"><small class="pill">${r.attendance}</small><button class="text-button" onclick="cancelRegistration('${r._id}')">Cancel</button></div></div>
        </article>`).join("")
      : `<div class="empty">You haven't registered for an event yet.</div>`;
  } catch (err) {
    if (err.message.includes("Authentication")) location.href = "login.html";
  }
}

async function cancelRegistration(id) {
  if (!confirm("Cancel this registration?")) return;
  try {
    await api("/registrations/" + id, { method: "DELETE" });
    loadDashboard();
  } catch (err) { alert(err.message); }
}

async function createEvent(e) {
  e.preventDefault();
  const msg = document.getElementById("message");
  try {
    await api("/events", {
      method: "POST",
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        category: eventCategory.value,
        capacity: Number(capacity.value),
        date: date.value,
        venue: venue.value,
        startTime: startTime.value,
        endTime: endTime.value
      })
    });
    msg.textContent = "Event created successfully.";
    msg.className = "form-message success";
    e.target.reset();
    loadAdmin();
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-message error";
  }
}

async function loadAdmin() {
  const user = currentUser();
  if (!user || !["admin", "faculty"].includes(user.role)) return location.href = "login.html";
  try {
    const events = await api("/events");
    document.getElementById("adminEvents").innerHTML = events.length ? events.map(e => `
      <div class="admin-event">
        <div><strong>${escapeHtml(e.title)}</strong><small>${new Date(e.date).toLocaleDateString("en-IN")} · ${e.registeredCount}/${e.capacity}</small></div>
        <button class="danger-button" onclick="deleteEvent('${e._id}')">Delete</button>
      </div>`).join("") : `<div class="empty">No events created yet.</div>`;
  } catch (err) {
    document.getElementById("adminEvents").innerHTML = `<div class="empty">${err.message}</div>`;
  }
}

async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;
  try { await api("/events/" + id, { method: "DELETE" }); loadAdmin(); }
  catch (err) { alert(err.message); }
}
