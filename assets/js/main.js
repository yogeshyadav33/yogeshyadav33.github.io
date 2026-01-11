/**
 * TRP SYSTEM CORE v1.0
 * Status: Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🟢 TRP System: Online and Ready.");
    
    // Simple visual check to prove JS is connected
    const root = document.getElementById('app-root');
    
    // In 2 seconds, we will simulate a "Ready" state
    setTimeout(() => {
        const statusMsg = root.querySelector('p');
        if(statusMsg) {
            statusMsg.innerHTML = "System Secure. Waiting for Database Connection...";
            statusMsg.style.color = "#0071e3"; // Turn it blue
        }
    }, 1500);
});
