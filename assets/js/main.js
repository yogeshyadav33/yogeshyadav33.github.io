/**
 * THE REFERRAL PARTNERS (TRP) - MAIN CONTROLLER v2.0
 * Architecture: Serverless | Database: Supabase (PostgreSQL)
 * Status: LIVE CONNECTION
 */

// 1. IMPORT THE SUPABASE CLIENT (Directly from the Cloud)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// =========================================================
// 🛑 CONFIGURATION ZONE (PASTE YOUR KEYS HERE)
// =========================================================
const SUPABASE_URL = 'https://lyzidxxonmaoomgtknhz.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5emlkeHhvbm1hb29tZ3Rrbmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzcwMzQsImV4cCI6MjA3OTMxMzAzNH0.FdRq20WezPeaY35xSkzAQjH_RaMNZlH-QANdDQQVXPU';
// =========================================================

// 2. INITIALIZE THE ENGINE
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    console.log("TRP: Initializing Secure Connection...");
    fetchPartners();
});

// 3. THE FETCH LOGIC (Getting data from the Trust Layer)
async function fetchPartners() {
    const grid = document.getElementById('app-root');
    
    // A. Ask Supabase for the data
    const { data: partners, error } = await supabase
        .from('partners')
        .select('*')
        .order('id', { ascending: true });

    // B. Handle Errors (If the internet breaks)
    if (error) {
        console.error("Critical Error:", error);
        grid.innerHTML = `<p style="color:red; text-align:center;">Connection Failed. Check Console.</p>`;
        return;
    }

    // C. Render the "Zero Gravity" Cards
    if (partners && partners.length > 0) {
        // Clear the "Loading..." text
        grid.innerHTML = '';
        
        // Loop through every partner in the database
        partners.forEach((partner, index) => {
            const card = document.createElement('article');
            card.className = 'partner-card';
            
            // Staggered Animation (Cards float in one by one)
            card.style.opacity = '0';
            card.style.animation = `floatIn 0.6s ease-out forwards ${index * 0.1}s`;

            // The HTML Template
            card.innerHTML = `
                <div style="background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.3s ease; height: 100%;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 1rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${partner.color || '#000'}; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
                            ${partner.name.charAt(0)}
                        </div>
                        ${partner.verified ? '<span style="font-size: 12px; background:#f5f5f7; padding:4px 8px; border-radius:100px;">✅ Verified</span>' : ''}
                    </div>
                    
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">${partner.name}</h3>
                    <p style="color: #86868b; font-size: 0.9rem; margin-bottom: 1.5rem;">${partner.category}</p>
                    
                    <div style="background: #fbfbfd; padding: 12px; border-radius: 8px; margin-bottom: 1.5rem;">
                        <span style="display: block; font-size: 0.75rem; text-transform: uppercase; color: #86868b; letter-spacing:1px;">Bonus</span>
                        <span style="font-weight: 600; color: #0071e3;">${partner.bonus}</span>
                    </div>

                    <a href="${partner.link}" target="_blank" style="display:block; width:100%; padding:12px 0; background:#1d1d1f; color:white; text-align:center; border-radius:100px; text-decoration:none; font-weight:600; transition: opacity 0.2s;">
                        Claim Offer
                    </a>
                </div>
            `;
            
            // Add Hover Effect via JS
            card.onmouseenter = () => card.firstElementChild.style.transform = "translateY(-5px)";
            card.onmouseleave = () => card.firstElementChild.style.transform = "translateY(0)";

            grid.appendChild(card);
        });
        
        // Add the animation keyframes dynamically
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `@keyframes floatIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
        document.head.appendChild(styleSheet);

    } else {
        grid.innerHTML = '<p style="text-align:center;">No partners found in the Trust Layer.</p>';
    }
}
