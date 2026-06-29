
let step = 0;
let category = "";
const chatDiv = document.getElementById('chat');

const kb = {
  pc_boot: [
    "Is the power cable plugged in and the wall switch turned ON?",
    "Do you hear any beep sounds when you press the power button?",
    "Try holding the power button down for 10 seconds to force a complete shutdown, then turn it back on. Did this work?"
  ],
  printer_offline: [
    "Is the printer's power indicator light turned ON?",
    "Is the USB or Network interface cable securely connected at both ends?",
    "Are there any visible paper jams or blinking warning/error lights?"
  ],
  network_problems: [
    "Is the Wi-Fi or Ethernet connection icon visible on your taskbar?",
    "Try disconnecting and reconnecting to the network. Has the internet connection returned?",
    "Please restart both your router and PC. Is the network operational now?"
  ],
  ethernet_problems: [
    "Is the Ethernet cable firmly clicked into place on both your PC and the wall socket?",
    "Is there a flashing orange or green status light on your computer's network port?",
    "Try using an alternative network cable or port. Does the PC detect the network interface now?"
  ],
  outlook_problem: [
    "Terminate Outlook using Task Manager, then try reopening it. Does it start up cleanly?",
    "Are you able to browse web pages normally using Google Chrome?",
    "Attempt an Office application repair: Control Panel > Programs > Office > Change > Quick Repair."
  ],
};

// Initial structural mappings for button display text
const displayNames = {
    pc_boot: "Mini PC Won't Boot / Running Slow",
    printer_offline: "Printer Not Printing / Shows Offline",
    network_problems: "PC Cannot Connect to the Internet",
    ethernet_problems: "PC Fails to Identify Ethernet Connection",
    outlook_problem: "Microsoft Outlook Will Not Open"
};

function initMenu() {
    let optionsHtml = '';
    for (const key in kb) {
        optionsHtml += `<button class="btn btn-outline" onclick="start('${key}')">${displayNames[key]}</button>`;
    }
    document.getElementById('options').innerHTML = optionsHtml;
}

function start(cat) {
  category = cat;
  step = 0;
  
  // Clean hide escalation form on new issue start
  document.getElementById('escalateForm').classList.add('hidden');
  
  addUserMessage(displayNames[cat]);
  showQuestion();
}

function showQuestion() {
  let q = kb[category][step];
  addBotMessage(q);
  document.getElementById('options').innerHTML = `
    <button class="btn btn-primary" onclick="answer('yes')">Yes - Issue Resolved ✅</button>
    <button class="btn btn-outline" onclick="answer('no')">No - Issue Persists</button>
  `;
}

function answer(res) {
  addUserMessage(res === 'yes' ? "Yes, it is fixed." : "No, still not working.");
  
  if(res === 'yes') {
    addBotMessage("Excellent! We are glad the issue has been resolved. Thank you for utilizing the ECG IT Helpdesk.");
    resetOptions();
  } else {
    if(step < kb[category].length - 1) {
      step++;
      showQuestion();
    } else {
      addBotMessage("We have exhausted our automated self-service troubleshooting. Let's escalate your request to the IT staff for direct intervention.");
      setupEscalationForm();
      resetOptions();
    }
  }
}

function addBotMessage(msg) {
  chatDiv.innerHTML += `<div class="message bot-msg"><b>Support Bot:</b> ${msg}</div>`;
  scrollToBottom();
}

function addUserMessage(msg) {
  chatDiv.innerHTML += `<div class="message user-msg"><b>You:</b> ${msg}</div>`;
  scrollToBottom();
}

function resetOptions() {
  document.getElementById('options').innerHTML = `<button class="btn btn-primary" onclick="location.reload()">Report a New Issue</button>`;
}

function scrollToBottom() {
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Tailors the escalation form depending on the type of issue selected
function setupEscalationForm() {
    const form = document.getElementById('escalateForm');
    const pcField = document.querySelector('.field-pc');
    const printerField = document.querySelector('.field-printer');
    
    // Hide context elements implicitly initially
    pcField.classList.add('hidden');
    printerField.classList.add('hidden');
    
    // Condition check to dynamically render assets required
    if (category === 'printer_offline') {
        printerField.classList.remove('hidden');
    } else {
        pcField.classList.remove('hidden');
    }
    
    form.classList.remove('hidden');
}

function sendTicket() {
  let data = {
    name: document.getElementById('name').value.trim(),
    dept: document.getElementById('dept').value.trim(),
    pc: document.getElementById('pcName').value,
    printer: document.getElementById('printer').value,
    issue: document.getElementById('issue').value.trim(),
    category: displayNames[category]
  };

  // Optional Context sanitization 
  let hardwareInfo = (category === 'printer_offline') ? `Printer: ${data.printer}` : `PC Name: ${data.pc}`;

  let msg = `ECG IT TICKET%0A----------------------%0AName: ${data.name}%0ADept: ${data.dept}%0A${hardwareInfo}%0AIssue Type: ${data.category}%0ADetails: ${data.issue}`;
  
  window.open(`https://wa.me/233541514311?text=${msg}`, '_blank');
  
  document.getElementById('status').innerHTML = '<span class="success">Ticket generated and sent to IT staff via WhatsApp ✅</span>';
}

// Initial kickoff invocation
initMenu();