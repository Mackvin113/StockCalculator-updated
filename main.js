let qty = 0;

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function stripNumber(value) {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/[₹,\s]/g, '')) || 0;
}

function calcQuantity() {
  const amt   = stripNumber(document.getElementById('investedAmount').value);
  const price = stripNumber(document.getElementById('stockPrice').value);

  if (amt > 0 && price > 0) {
    qty = amt / price;
    document.getElementById('quantity').value = qty.toFixed(4);
  } else {
    const manualQty = stripNumber(document.getElementById('quantity').value);
    if (manualQty > 0) qty = manualQty;
  }
}

function attachCurrencyField(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('focus', function () {
    const raw = stripNumber(this.value);
    this.value = raw ? raw : '';
  });

  el.addEventListener('blur', function () {
    const val = stripNumber(this.value);
    if (val) this.value = formatCurrency(val);
    calcQuantity();
  });
}

attachCurrencyField('investedAmount');
attachCurrencyField('stockPrice');
attachCurrencyField('runningPrice');

document.getElementById('quantity').addEventListener('input', function () {
  const manualQty = stripNumber(this.value);
  if (manualQty > 0) qty = manualQty;
});

document.getElementById('calculateBtn').addEventListener('click', function () {
  const investedAmount = stripNumber(document.getElementById('investedAmount').value);
  const stockPrice     = stripNumber(document.getElementById('stockPrice').value);
  const runningPrice   = stripNumber(document.getElementById('runningPrice').value);
  const overallInput   = document.getElementById('overall');
  const plInput        = document.getElementById('plAmount');
  const diffInput      = document.getElementById('diff');

  const manualQty = stripNumber(document.getElementById('quantity').value);
  if (manualQty > 0) qty = manualQty;

  if (!qty || !runningPrice) {
    alert('Please fill in Quantity and Running Price first.');
    return;
  }

  // Overall = Quantity × Running Price
  const overall = qty * runningPrice;
  overallInput.value = formatCurrency(overall);

  // P&L = Overall - Invested
  const pl = overall - investedAmount;
  plInput.value = pl < 0
    ? `- ${formatCurrency(Math.abs(pl))}`
    : `+ ${formatCurrency(pl)}`;
  plInput.style.color      = pl < 0 ? '#e53935' : '#2e7d32';
  plInput.style.fontWeight = '600';

  // Diff = Stock Price on Investment - Running Price
  const diff = runningPrice - stockPrice;
  diffInput.value = diff < 0
    ? `- ${formatCurrency(Math.abs(diff))}`
    : `+ ${formatCurrency(diff)}`;
  diffInput.style.color      = diff < 0 ? '#e53935' : '#2e7d32';
  diffInput.style.fontWeight = '600';
});
