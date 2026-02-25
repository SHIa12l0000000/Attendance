// Admin: Generate QR Code
function generateQRCode() {
    const event = document.getElementById('event-name').value;
    if (!event) { alert("Enter event name"); return; }
    QRCode.toCanvas(document.getElementById('qrcode'), event + "|" + Date.now(), function (error) {
        if (error) console.error(error);
        else alert("QR Code Generated! Students can scan it now.");
    });
}

// Simulated QR scan + geo validation
function scanAttendance() {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }

    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);

        const name = prompt("Enter Your Name:");
        if(!name) return alert("Name required");

        const qrData = prompt("Enter QR Code data (from QR scanner or canvas):");
        if(!qrData) return alert("QR required");

        // Save to localStorage as attendance record
        const record = { name, event: qrData.split("|")[0], time: new Date().toLocaleString(), location:`${lat},${lng}` };
        const allRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
        allRecords.push(record);
        localStorage.setItem("attendance", JSON.stringify(allRecords));
        document.getElementById("scan-result").textContent = "Attendance Registered Successfully!";
        renderDashboard();
    }, (error) => { alert("Unable to get location. " + error.message); });
}

// Render dashboard table
function renderDashboard() {
    const tbody = document.querySelector("#attendance-table tbody");
    tbody.innerHTML='';
    const allRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
    allRecords.forEach(rec => {
        const tr = document.createElement('tr');
        tr.innerHTML=`<td>${rec.name}</td><td>${rec.event}</td><td>${rec.time}</td><td>${rec.location}</td>`;
        tbody.appendChild(tr);
    });
}

// Download CSV
function downloadReport() {
    const allRecords = JSON.parse(localStorage.getItem("attendance") || "[]");
    if(allRecords.length===0) return alert("No records found!");
    let csv = "Name,Event,Time,Location\n";
    allRecords.forEach(r => { csv += `${r.name},${r.event},${r.time},${r.location}\n`; });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "attendance_report.csv"; a.click();
    URL.revokeObjectURL(url);
}

// Initial render
renderDashboard();
