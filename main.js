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
  return parseFloat(value.toString().replace(/[^0-9.]/g, '')) || 0;
}

function calcQuantity() {
  const amt   = stripNumber(document.getElementById('investedAmount').value);
  const price = stripNumber(document.getElementById('stockPrice').value);

  if (amt > 0 && price > 0) {
    qty = amt / price;
    document.getElementById('quantity').value = qty.toFixed(4);
  } else {
    qty = 0;
    document.getElementById('quantity').value = '';
  }
}

function attachCurrencyField(id) {
  const el = document.getElementById(id);

  el.addEventListener('focus', function () {
    const raw = stripNumber(this.value);
    this.value = raw || '';
  });

  el.addEventListener('blur', function () {
    const val = stripNumber(this.value);
    if (val) {
      this.value = formatCurrency(val);
    }
    calcQuantity();
  });
}

attachCurrencyField('investedAmount');
attachCurrencyField('stockPrice');
attachCurrencyField('runningPrice');

document.getElementById('calculateBtn').addEventListener('click', function () {
  const investedAmount  = stripNumber(document.getElementById('investedAmount').value);
  const runningPrice    = stripNumber(document.getElementById('runningPrice').value);
  const overallInput    = document.getElementById('overall');
  const plInput         = document.getElementById('plAmount');

  if (!qty || !runningPrice) {
    alert('Please fill in all fields first.');
    return;
  }

  // Overall = Quantity × Running Price
  const overall = qty * runningPrice;
  overallInput.value = formatCurrency(overall);

  // P&L = Invested - Overall
  const pl = overall - investedAmount;

  if (pl < 0) {
    plInput.value = `- ${formatCurrency(Math.abs(pl))}`;
    plInput.style.color = '#e53935';
    plInput.style.fontWeight = '600';
  } else {
    plInput.value = `+ ${formatCurrency(pl)}`;
    plInput.style.color = '#2e7d32';
    plInput.style.fontWeight = '600';
  }
});

