import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// === 1. CONFIGURATION ===
const SUPABASE_URL = 'https://lyzidxxonmaoomgtknhz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5emlkeHhvbm1hb29tZ3Rrbmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzcwMzQsImV4cCI6MjA3OTMxMzAzNH0.FdRq20WezPeaY35xSkzAQjH_RaMNZlH-QANdDQQVXPU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// === 2. INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    fetchPartners();
    checkSession();
    
    // SECRET KEY LISTENER (Ctrl + Shift + L)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            toggleAdmin();
        }
    });
});

// === 3. CORE FUNCTIONS ===
async function fetchPartners() {
    const grid = document.getElementById('app-root');
    const { data: partners, error } = await supabase.from('partners').select('*').order('id', { ascending: false }); // Newest first

    if (partners) {
        grid.innerHTML = '';
        partners.forEach((partner, index) => {
            const card = document.createElement('article');
            card.className = 'partner-card'; // Reuse your CSS class
            card.style = `background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 20px; animation: floatIn 0.5s ease forwards ${index * 0.1}s; opacity: 0;`;
            card.innerHTML = `
                <h3 style="font-weight:800;">${partner.name}</h3>
                <p style="color:#888; font-size:0.9rem;">${partner.category}</p>
                <p style="color:#0071e3; font-weight:600; margin: 10px 0;">${partner.bonus}</p>
                <a href="${partner.link}" target="_blank" style="display:block; background:#111; color:fff; padding:10px; text-align:center; border-radius:8px; text-decoration:none; color: white;">Claim</a>
            `;
            grid.appendChild(card);
        });
    }
}

// === 4. ADMIN LOGIC ===
window.toggleAdmin = () => {
    const modal = document.getElementById('admin-modal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) alert("Login Failed: " + error.message);
    else {
        alert("Welcome back, Commander.");
        checkSession();
    }
});

// Handle Upload
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('p-name').value;
    const cat = document.getElementById('p-cat').value;
    const bonus = document.getElementById('p-bonus').value;
    const link = document.getElementById('p-link').value;
    const color = document.getElementById('p-color').value;

    const { error } = await supabase.from('partners').insert([{ name, category: cat, bonus, link, color }]);
    
    if (error) alert("Upload Error: " + error.message);
    else {
        alert("Partner Added Successfully!");
        document.getElementById('upload-form').reset();
        fetchPartners(); // Refresh grid instantly
        toggleAdmin(); // Close modal
    }
});

async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('upload-form').style.display = 'block';
    }
}

window.logout = async () => {
    await supabase.auth.signOut();
    location.reload();
}
