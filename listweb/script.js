let itemIndex = 0;  // ใช้นับจำนวนแถวรายการที่ผู้ใช้เพิ่ม
const promptPayNumber = "0936505412";  // 👉 เบอร์พร้อมเพย์ของคุณ

// 🔧 ฟังก์ชันเพิ่มรายการใหม่ให้กรอก
function addItem() {
  const container = document.getElementById("items");

  // สร้าง div สำหรับ 1 รายการ
  const div = document.createElement("div");
  div.className = "item-row"; // ใช้อ้างอิงตอนลบ
  div.setAttribute("data-index", itemIndex);

  // ใส่ input และปุ่มลบ
  div.innerHTML = `
    <input type="text" placeholder="ชื่อรายการ" id="name-${itemIndex}" />
    <input type="number" placeholder="จำนวน" id="qty-${itemIndex}" value="1" />
    <input type="number" placeholder="ราคาต่อหน่วย" id="price-${itemIndex}" value="0" />
    <button onclick="removeItem(this)">❌ ลบ</button>
    <hr />
  `;

  container.appendChild(div);
  itemIndex++;
}

// ❌ ฟังก์ชันลบรายการ
function removeItem(button) {
  const itemDiv = button.parentElement;
  itemDiv.remove();
}

// 🔄 ฟังก์ชันสร้างใบสรุป + คำนวณยอดรวม + QR
function generateBill() {
  const customerName = document.getElementById("customerNameInput").value;
  const itemListEl = document.getElementById("itemList");
  itemListEl.innerHTML = "";
  let total = 0;

  const itemRows = document.querySelectorAll(".item-row");

  itemRows.forEach(row => {
    const idx = row.getAttribute("data-index");
    const name = document.getElementById(`name-${idx}`)?.value;
    const qty = parseFloat(document.getElementById(`qty-${idx}`)?.value) || 0;
    const price = parseFloat(document.getElementById(`price-${idx}`)?.value) || 0;

    if (!name || qty <= 0 || price <= 0) return;

    const itemTotal = qty * price;
    total += itemTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${name}</td>
      <td><input type="number" value="${qty}" data-idx="${idx}" class="qty-input" /></td>
      <td><input type="number" value="${price}" data-idx="${idx}" class="price-input" /></td>
      <td class="item-total" id="total-${idx}">${itemTotal}</td>
    `;
    itemListEl.appendChild(tr);
  });

  document.getElementById("customerName").textContent = customerName;
  document.getElementById("totalPrice").textContent = `${total} บาท`;

  // สร้าง QR พร้อมเพย์
  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = `<img src="https://promptpay.io/${promptPayNumber}/${total}.png" width="200" alt="QR พร้อมเพย์">`;

  document.getElementById("billArea").style.display = "block";
  addLiveRecalculate();
}

// ♻️ ฟังก์ชันคำนวณยอดใหม่เมื่อมีการแก้ input
function addLiveRecalculate() {
  const qtyInputs = document.querySelectorAll(".qty-input");
  const priceInputs = document.querySelectorAll(".price-input");

  qtyInputs.forEach(input => {
    input.addEventListener("input", recalculateTotals);
  });

  priceInputs.forEach(input => {
    input.addEventListener("input", recalculateTotals);
  });
}

function recalculateTotals() {
  let newTotal = 0;

  const rows = document.querySelectorAll(".item-total");
  rows.forEach(cell => {
    const idx = cell.id.replace("total-", "");
    const qty = parseFloat(document.querySelector(`input[data-idx="${idx}"].qty-input`)?.value) || 0;
    const price = parseFloat(document.querySelector(`input[data-idx="${idx}"].price-input`)?.value) || 0;

    const itemTotal = qty * price;
    cell.textContent = itemTotal;
    newTotal += itemTotal;
  });

  // อัปเดตยอดรวมและ QR ใหม่
  document.getElementById("totalPrice").textContent = `${newTotal} บาท`;
  document.getElementById("qrcode").innerHTML = `<img src="https://promptpay.io/${promptPayNumber}/${newTotal}.png" width="200" alt="QR พร้อมเพย์">`;
}
