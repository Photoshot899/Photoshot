let itemIndex = 0;  // ใช้นับจำนวนแถวรายการที่ผู้ใช้เพิ่ม
const promptPayNumber = "0936505412";  // 👉 เปลี่ยนเป็นเบอร์พร้อมเพย์ของคุณ

// 🔧 ฟังก์ชันเพิ่มรายการใหม่ให้กรอก
function addItem() {
  const container = document.getElementById("items");

  // สร้าง input สำหรับชื่อ / จำนวน / ราคา
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="ชื่อรายการ" id="name-${itemIndex}" />
    <input type="number" placeholder="จำนวน" id="qty-${itemIndex}" value="1" />
    <input type="number" placeholder="ราคาต่อหน่วย" id="price-${itemIndex}" value="0" />
    <hr />
  `;
  container.appendChild(div);
  itemIndex++;
}

// 🔄 ฟังก์ชันสร้างใบสรุป พร้อมคำนวณยอดรวม และ QR พร้อมเพย์
function generateBill() {
  const customerName = document.getElementById("customerNameInput").value;
  const itemListEl = document.getElementById("itemList");
  itemListEl.innerHTML = ""; // เคลียร์ตารางเดิมก่อน
  let total = 0;

  for (let i = 0; i < itemIndex; i++) {
    const name = document.getElementById(`name-${i}`)?.value;
    const qty = parseFloat(document.getElementById(`qty-${i}`)?.value) || 0;
    const price = parseFloat(document.getElementById(`price-${i}`)?.value) || 0;

    if (!name || qty <= 0 || price <= 0) continue;

    const itemTotal = qty * price;
    total += itemTotal;

    // สร้างแถวข้อมูลในตาราง พร้อม input ที่สามารถแก้ได้ภายหลัง
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td><input type="number" value="${qty}" data-idx="${i}" class="qty-input" /></td>
      <td><input type="number" value="${price}" data-idx="${i}" class="price-input" /></td>
      <td class="item-total" id="total-${i}">${itemTotal}</td>
    `;
    itemListEl.appendChild(row);
  }

  // แสดงชื่อและราคารวมทั้งหมด
  document.getElementById("customerName").textContent = customerName;
  document.getElementById("totalPrice").textContent = `${total} บาท`;

// สร้าง QR จาก promptpay.io
const qrcodeDiv = document.getElementById("qrcode");  // ✅ << เพิ่มบรรทัดนี้
qrcodeDiv.innerHTML = ""; // เคลียร์ของเก่า
const img = document.createElement("img");
img.src = `https://promptpay.io/${promptPayNumber}/${total}.png`;
img.alt = "QR สำหรับพร้อมเพย์";
img.width = 200;
qrcodeDiv.appendChild(img);


  // แสดงใบสรุป
  document.getElementById("billArea").style.display = "block";

  // 🎯 เพิ่ม event ฟังเมื่อมีการเปลี่ยนค่า input เพื่อคำนวณใหม่
  addLiveRecalculate();
}

// 🔁 ฟังก์ชันเมื่อมีการแก้ไขตัวเลขแล้วคำนวณใหม่
function addLiveRecalculate() {
  const qtyInputs = document.querySelectorAll(".qty-input");
  const priceInputs = document.querySelectorAll(".price-input");

  // loop ผ่าน input ปริมาณ
  qtyInputs.forEach(input => {
    input.addEventListener("input", recalculateTotals);
  });

  // loop ผ่าน input ราคา
  priceInputs.forEach(input => {
    input.addEventListener("input", recalculateTotals);
  });
}

// ♻️ คำนวณยอดรวมใหม่ทั้งหมดแบบ real-time
function recalculateTotals() {
  let newTotal = 0;

  for (let i = 0; i < itemIndex; i++) {
    const qtyInput = document.querySelector(`input[data-idx="${i}"].qty-input`);
    const priceInput = document.querySelector(`input[data-idx="${i}"].price-input`);
    const totalCell = document.getElementById(`total-${i}`);

    if (!qtyInput || !priceInput || !totalCell) continue;

    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const itemTotal = qty * price;

    totalCell.textContent = itemTotal;
    newTotal += itemTotal;
  }

  // อัปเดตราคารวมและ QR Code
  document.getElementById("totalPrice").textContent = `${newTotal} บาท`;
  document.getElementById("qrcode").innerHTML = `<img src="https://promptpay.io/${promptPayNumber}/${newTotal}.png" width="200" alt="QR พร้อมเพย์">`;
}
