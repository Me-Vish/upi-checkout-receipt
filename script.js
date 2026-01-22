// ====== DOM Elements ======
const payForm = document.getElementById("payForm");

const payerName = document.getElementById("payerName");
const upiId = document.getElementById("upiId");
const merchant = document.getElementById("merchant");
const amount = document.getElementById("amount");
const note = document.getElementById("note");
const mode = document.getElementById("mode");

const demoBtn = document.getElementById("demoBtn");

// Result card
const resultCard = document.getElementById("resultCard");
const statusBadge = document.getElementById("statusBadge");

const txnIdText = document.getElementById("txnIdText");
const dateText = document.getElementById("dateText");
const merchantText = document.getElementById("merchantText");
const payerText = document.getElementById("payerText");
const upiText = document.getElementById("upiText");
const modeText = document.getElementById("modeText");
const amountText = document.getElementById("amountText");
const noteText = document.getElementById("noteText");

const tryAgainBtn = document.getElementById("tryAgainBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Loader (optional section)
const loadingCard = document.getElementById("loadingCard");


// ====== Helpers ======
function generateTxnId() {
  return "TXN" + Math.random().toString(16).slice(2, 10).toUpperCase();
}

function formatMoney(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function nowPretty() {
  const d = new Date();
  return d.toLocaleString("en-IN");
}

//  Basic UPI validation: name@bank
function isValidUpiId(value) {
  const v = value.trim();
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
  return upiRegex.test(v);
}

// Random success/fail simulation
function simulatePayment() {
  // 85% success rate
  return Math.random() < 0.85 ? "SUCCESS" : "FAILED";
}

function showResultPop() {
  resultCard.classList.add("pop");
  setTimeout(() => resultCard.classList.remove("pop"), 400);
}


// ====== Demo Fill ======
demoBtn.addEventListener("click", () => {
  payerName.value = "Vishali";
  upiId.value = "vishali@okaxis";
  merchant.value = "Smart Store";
  amount.value = 499;
  note.value = "Recharge";
  mode.value = "UPI";
});


// ====== Payment Submit ======
payForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Hide old result if already open
  resultCard.style.display = "none";

  // Validation
  if (!payerName.value.trim()) {
    alert("Enter payer name.");
    payerName.focus();
    return;
  }

  if (!isValidUpiId(upiId.value)) {
    alert("Invalid UPI ID! Example: name@bank");
    upiId.focus();
    return;
  }

  if (!merchant.value.trim()) {
    alert("Enter merchant name.");
    merchant.focus();
    return;
  }

  const amt = Number(amount.value);
  if (amt <= 0) {
    alert("Enter valid amount.");
    amount.focus();
    return;
  }

  // Show Loader (if section exists)
  if (loadingCard) {
    loadingCard.style.display = "block";
    loadingCard.scrollIntoView({ behavior: "smooth" });
  }

  // Fake 1 second processing time
  setTimeout(() => {
    const status = simulatePayment();
    const txnId = generateTxnId();

    // Hide loader
    if (loadingCard) loadingCard.style.display = "none";

    // Update Badge UI
    statusBadge.textContent = status;
    statusBadge.className = "badge " + (status === "SUCCESS" ? "ok" : "fail");

    // Update Receipt Text
    txnIdText.textContent = txnId;
    dateText.textContent = nowPretty();
    merchantText.textContent = merchant.value.trim();
    payerText.textContent = payerName.value.trim();
    upiText.textContent = upiId.value.trim();
    modeText.textContent = mode.value;
    amountText.textContent = formatMoney(amt);
    noteText.textContent = note.value.trim() ? note.value.trim() : "-";

    // Show Result Card
    resultCard.style.display = "block";
    resultCard.scrollIntoView({ behavior: "smooth" });
    showResultPop();

    // Store last payment in localStorage
    const lastPayment = {
      txnId,
      status,
      date: new Date().toISOString(),
      merchant: merchant.value.trim(),
      payer: payerName.value.trim(),
      upiId: upiId.value.trim(),
      mode: mode.value,
      amount: amt,
      note: note.value.trim()
    };

    localStorage.setItem("upi_last_payment", JSON.stringify(lastPayment));
  }, 1000);
});


// ====== Buttons ======
tryAgainBtn.addEventListener("click", () => {
  resultCard.style.display = "none";
  if (loadingCard) loadingCard.style.display = "none";
  payForm.reset();
  payerName.focus();
});

downloadBtn.addEventListener("click", () => {
  // Browser print-to-PDF
  window.print();
});


// ====== Auto Load Last Payment (optional) ======
window.addEventListener("load", () => {
  const last = localStorage.getItem("upi_last_payment");
  if (!last) return;

  // You can remove this block if you don’t want auto-show
  // (keeping it OFF by default – only stored)

  // const data = JSON.parse(last);
  // console.log("Last Payment:", data);
});
