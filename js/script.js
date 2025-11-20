const btn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");

btn.addEventListener("click", () => {
  if (window.innerWidth < 768) {
    menu.classList.toggle("hidden");
  }
});

// Form Pekerjaan
const jobForm = document.getElementById("jobForm");
let currentFilterEmail = null;

if (jobForm) jobForm.addEventListener("submit", saveJob);

function saveJob(event) {
    event.preventDefault();

    let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const fotoInput = document.getElementById("foto");
    const fotoFile = fotoInput ? fotoInput.files[0] : null;

    const saveData = (fotoBase64) => {
        const job = {
            id: Date.now(),
            email: document.getElementById("email").value,
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            location: document.getElementById("location")?.value || "",
            salary: document.getElementById("salary")?.value || "",
            duration: document.getElementById("duration")?.value || "",
            phone: document.getElementById("phone").value,
            pin: document.getElementById("pin")?.value || "",
            foto: fotoBase64 || "",
            title: document.getElementById("title")?.value || "Pekerjaan"
        };

        jobs.push(job);
        localStorage.setItem("jobs", JSON.stringify(jobs));

        alert("Pekerjaan berhasil diposting!");
        jobForm.reset();
        reloadMyJobs();
    };

    if (fotoFile) {
        let reader = new FileReader();
        reader.onload = () => saveData(reader.result);
        reader.readAsDataURL(fotoFile);
    } else {
        saveData("");
    }
}

// Render Pekerjaan Saya
function renderJobItem(job) {
    return `
        <div class="job-item bg-white p-4 rounded-lg shadow-md" id="job-${job.id}">
            <strong class="text-lg">${job.description}</strong><br>
            <small>Oleh: ${job.name}</small><br>
            <span>Email: ${job.email}</span><br>
            <span>Gaji: ${job.salary}</span><br>
            <span>Durasi: ${job.duration}</span><br>
            <span>Telp: ${job.phone}</span><br>

            ${job.foto ? `<img src="${job.foto}" class="w-24 h-24 mt-2 rounded-lg">` : ""}

            <div class="flex justify-end space-x-3">
            <button class="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    onclick="deleteJob(${job.id})">
                Hapus
            </button>

            <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onclick="viewMessages(${job.id})">
            Pesan
            </button>
            </div>
        </div>
    `;
}

// Filter Pekerjaan Saya
function loadJobs() {
    let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    let jobList = document.getElementById("jobList");
    if (!jobList) return;

    jobList.innerHTML = jobs.length === 0
        ? "<p>Belum ada pekerjaan.</p>"
        : jobs.map(renderJobItem).join("");
}

function openMyJobs() {
    let email = prompt("Masukkan email yang digunakan saat posting:");
    if (!email) return;

    currentFilterEmail = email;

    document.getElementById("form").classList.remove("active");
    document.getElementById("list").classList.add("active");

    reloadMyJobs();
}

function reloadMyJobs() {
    let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    let myJobs = jobs.filter(j => j.email === currentFilterEmail);

    let jobList = document.getElementById("jobList");
    if (!jobList) return;

    jobList.innerHTML = myJobs.length === 0
        ? "<p>Semua pekerjaan telah dihapus atau belum pernah posting.</p>"
        : myJobs.map(renderJobItem).join("");
}

// Hapus Pekerjaan Saya
function deleteJob(id) {
    let pin = prompt("Masukkan PIN:");
    let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    let job = jobs.find(j => j.id === id);

    if (!job) return;

    if (!job.pin || job.pin === pin) {
        jobs = jobs.filter(j => j.id !== id);
        localStorage.setItem("jobs", JSON.stringify(jobs));
        alert("Pekerjaan berhasil dihapus.");

        currentFilterEmail ? reloadMyJobs() : loadJobs();
    } else {
        alert("PIN salah!");
    }
}

// Cari Pekerjaan
document.addEventListener("DOMContentLoaded", () => {

    const defaultJobs = [];
    const localJobs = JSON.parse(localStorage.getItem("jobs")) || [];

    const localJobsFormatted = localJobs.map(j => ({
        id: j.id,
        title: j.title || "Pekerjaan",
        company: j.name || "Tidak disebutkan",
        location: j.location || "Lokasi tidak ditentukan",
        salary: j.salary || "-",
        type: j.type || "Harian",
        email: j.email || "-",
        phone: j.phone || "-",
        desc: j.description || "",
        foto: j.foto || "https://via.placeholder.com/600x400?text=No+Image"
    }));

    const allJobs = [...defaultJobs, ...localJobsFormatted];

    const jobGrid = document.getElementById("jobGrid");
    if (!jobGrid) return;

    function renderJobs(list) {
        jobGrid.innerHTML = list.map(job => `
        <div class="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition mb-6">

            <div class="flex items-start">
                
                <!-- AREA TEKS -->
                <div class="w-150 flex-shrink-0 ml-2"> <!-- pr-3 untuk memberi sedikit jarak agar rapi -->
                    <h3 class="text-lg font-bold">${job.title}</h3>
                    <p class="text-gray-600 text-sm">${job.company} • ${job.location}</p>
                    <p class="text-sm mt-1"><strong>Gaji:</strong> ${job.salary}</p>
                    <p class="text-sm"><strong>Tipe:</strong> ${job.type}</p>
                    <p class="text-gray-700 text-sm mt-2">${job.email}</p>
                    <p class="text-gray-700 text-sm mt-2">${job.phone}</p>
                    <p class="text-gray-700 text-sm mt-2">${job.desc}</p>
                </div>

                <!-- AREA GAMBAR -->
                ${job.foto ? `
                <div class="w-60 flex-shrink-0 ml-2">
                    <img 
                        src="${job.foto}" 
                        class="w-full h-full object-cover rounded-lg"
                    >
                </div>
                ` : ""}
                
            </div>
            <button 
                class="btn-lamar mt-3 bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700"
                data-job-id="${job.id}">
                Lamar Sekarang
            </button>
        </div>

        `).join("");
    }

    renderJobs(allJobs);

    // filter pencarian
    const mainSearch = document.getElementById("mainSearch");
    const filterLocation = document.getElementById("filterLocation");
    const typeCheckboxes = document.querySelectorAll(".job-type");

    function applyFilters() {
        const keyword =
            (mainSearch?.value.toLowerCase() || "") ||
            (filterLocation?.value.toLowerCase() || "");

        const selectedTypes = [...typeCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const filtered = allJobs.filter(job =>
            (job.title.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword)) &&
            (selectedTypes.length === 0 || selectedTypes.includes(job.type))
        );

        renderJobs(filtered);
    }

    mainSearch?.addEventListener("input", applyFilters);
    filterLocation?.addEventListener("input", applyFilters);
    typeCheckboxes.forEach(cb => cb.addEventListener("change", applyFilters));
});

// Form Lamar Pekerjaan
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-lamar")) {
        const jobId = e.target.dataset.jobId;
        localStorage.setItem("selectedJobId", jobId);
        document.getElementById("lamarModal").classList.remove("hidden");
    }
});

document.getElementById("closeModal")?.addEventListener("click", () => {
    document.getElementById("lamarModal").classList.add("hidden");
});

// Simpan Pesan Lamaran
document.getElementById("lamarForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let tel = document.getElementById("phone").value.trim();
    let file = document.getElementById("resume").value.trim();

    document.getElementById("errName").textContent = name ? "" : "Nama wajib diisi";
    document.getElementById("errEmail").textContent = email ? "" : "Email wajib diisi";
    document.getElementById("errPhone").textContent = tel ? "" : "Nomor HP wajib diisi";
    document.getElementById("errResume").textContent = file ? "" : "Resume wajib diisi";

    if (!(name && email && tel && file)) return;

    let jobId = parseInt(localStorage.getItem("selectedJobId"));
    let messages = JSON.parse(localStorage.getItem("messages") || "[]");

    messages.push({
        jobId,
        name,
        email,
        phone: tel,
        resume: file,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("messages", JSON.stringify(messages));

    // Notifikasi toast
    const toast = document.getElementById("toast");
    toast.classList.remove("hidden");
    toast.classList.add("opacity-100");

    setTimeout(() => {
        toast.classList.add("hidden");
        toast.classList.remove("opacity-100");
    }, 2500);

    this.reset();
    document.getElementById("lamarModal").classList.add("hidden");
});

// Tombol Pesan di Pekerjaan Saya
function viewMessages(jobId) {
    window.location.href = `pesan.html?id=${jobId}`;
}
