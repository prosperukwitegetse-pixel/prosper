
// =========================================================
// 1. SECURITY GUARD (Ihita irinda dashboard igihe page ifungutse)
// =========================================================
if (window.location.pathname.includes("dashboard.html")) {
  const currentUser = JSON.parse(localStorage.getItem('current_user'));
  
  // Niba nta muser winjiye mubize ukamuhitamo kuri index.html
  if (!currentUser) {
    alert("❌ Ntubyemerewe! Banza winjire ufite konti y'ukuri.");
    window.location.href = "index.html";
  }
}

// =========================================================
// 2. AUTHENTICATION LOGIC (Kuri index.html)
// =========================================================

// Visual Sliders
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

if (signUpButton && signInButton) {
  signUpButton.addEventListener('click', () => container.classList.add("right-panel-active"));
  signInButton.addEventListener('click', () => container.classList.remove("right-panel-active"));
}

// Function yo kwiyandikisha (Sign Up)
function handleSignUp(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  let storedUsers = JSON.parse(localStorage.getItem('registered_users')) || [];

  // Reba niba imeri yarakoreshejwe
  if (storedUsers.some(u => u.email === email)) {
    alert("❌ Iyi meri yamaze kwiyandikisha! Koresha indi cyangwa winjire.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    role: "User",
    status: "Pending" // User mushya aba afite status ya Pending
  };

  storedUsers.push(newUser);
  localStorage.setItem('registered_users', JSON.stringify(storedUsers));

  alert("✅ Konti yaremwe neza! Ubu iracyategereje ko Admin ayemeza (Pending).");
  event.target.reset();
  container.classList.remove("right-panel-active");
}

// Function yo Kwinjira (Sign In)
function handleSignIn(event) {
  event.preventDefault();
  
  const email = document.getElementById('signinEmail').value.trim().toLowerCase();
  const password = document.getElementById('signinPassword').value;

  // 1. Reba niba ari Admin mukuru
  if (email === "admin@gmail.com" && password === "123") {
    const adminUser = { name: "Admin Mukuru", email: email, role: "Admin", status: "Active" };
    localStorage.setItem('current_user', JSON.stringify(adminUser));
    window.location.href = "dashboard.html";
    return;
  }

  // 2. Gusoma abiyandikishije
  let storedUsers = JSON.parse(localStorage.getItem('registered_users')) || [];
  let foundUser = storedUsers.find(u => u.email === email && u.password === password);

  // Niba uyu muntu adafite konti na mba
  if (!foundUser) {
    alert("❌ Ntuta konti ufite cyangwa imeri n'ijambo ry'ibanga si byo! Banza wiyandikishe.");
    return;
  }

  // Niba akiri Pending
  if (foundUser.status === 'Pending') {
    alert("⚠️ Konti yawe iracyari PENDING! Admin ntarayemeza. Ntukunda kwinjira.");
    return;
  }

  // Niba ari Active
  localStorage.setItem('current_user', JSON.stringify(foundUser));
  window.location.href = "dashboard.html";
}

// =========================================================
// 3. DASHBOARD LOGIC (Kuri dashboard.html)
// =========================================================

function switchTab(tabId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.sidebar-menu button').forEach(btn => btn.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  document.getElementById('btn-' + tabId).classList.add('active');
}

function logout() {
  localStorage.removeItem('current_user');
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("dashboard.html")) return;

  const currentUser = JSON.parse(localStorage.getItem('current_user'));
  let allUsers = JSON.parse(localStorage.getItem('registered_users')) || [];

  // Update Stats Cards
  document.getElementById("totalUsersCount").innerText = allUsers.length;
  document.getElementById("pendingUsersCount").innerText = allUsers.filter(u => u.status === 'Pending').length;
  document.getElementById("adminCount").innerText = 1;

  const welcomeTitle = document.getElementById("welcomeTitle");

  if (currentUser.role !== 'Admin') {
    // Muhishe tab ya Users kuko atari Admin
    document.getElementById('btn-users').style.display = 'none';
    welcomeTitle.innerText = `🏠 Urakaza neza, ${currentUser.name}!`;
  } else {
    welcomeTitle.innerText = `🏠 Urakaza neza, Mutegetsi (Admin)!`;
    renderAdminTable();
  }
});

function renderAdminTable() {
  let users = JSON.parse(localStorage.getItem('registered_users')) || [];
  const tbody = document.getElementById("userTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    let badge = user.status === 'Active' ? 'badge-active' : 'badge-pending';
    let actionBtn = user.status === 'Pending' 
      ? `<button onclick="approveUser(${user.id})" style="background:#16a34a; color:white; border:none; padding:5px 12px; border-radius:4px; cursor:pointer;">Approve</button>`
      : `<span style="color: green; font-weight:bold;">Yemejwe ✅</span>`;

    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td><b>${user.name}</b></td>
        <td>${user.email}</td>
        <td><span class="${badge}">${user.status}</span></td>
        <td>${actionBtn}</td>
      </tr>
    `;
  });
}

function approveUser(userId) {
  let users = JSON.parse(localStorage.getItem('registered_users')) || [];
  users = users.map(u => {
    if (u.id === userId) u.status = 'Active';
    return u;
  });
  localStorage.setItem('registered_users', JSON.stringify(users));
  location.reload();
}