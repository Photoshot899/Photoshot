let itemIndex = 0;  // ตัวนับจำนวนรายการที่เพิ่มเข้ามา
const promptPayNumber = "0888888888";  // ✅ ใส่เบอร์พร้อมเพย์ของคุณ

// ฟังก์ชันเพิ่มแถวรายการสินค้า/บริการใหม่
function addItem() {
  const container = document.getElementById("items");

  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="ชื่อรายการ" id="name-${itemIndex}" />
    <input type="number" placeholder="จำนวน" id="qty-${itemIndex}" />
    <input type="number" placeholder="ราคาต่อหน่วย" id="price-${itemIndex}" />
    <hr />
  `;

  container.appendChild(div);
  itemIndex++;
}

// ฟังก์ชันสร้างใบสรุป และ QR พร้อมเพย์
function generateBill() {
  const customerName = document.getElementById("customerNameInput").value;
  const itemListEl = document.getElementById("itemList");
  itemListEl.innerHTML = ""; // ล้างรายการเก่า

  let total = 0;

  // วนลูปผ่านแต่ละรายการที่ผู้ใช้กรอก
  for (let i = 0; i < itemIndex; i++) {
    const name = document.getElementById(`name-${i}`)?.value;
    const qty = parseFloat(document.getElementById(`qty-${i}`)?.value) || 0;
    const price = parseFloat(document.getElementById(`price-${i}`)?.value) || 0;

    // ข้ามรายการที่ข้อมูลไม่ครบ
    if (!name || qty <= 0 || price <= 0) continue;

    const itemTotal = qty * price;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${qty}</td>
      <td>${price}</td>
      <td>${itemTotal}</td>
    `;
    itemListEl.appendChild(row);
  }

  // แสดงชื่อและราคารวม
  document.getElementById("customerName").textContent = customerName;
  document.getElementById("totalPrice").textContent = `${total} บาท`;

  // สร้าง QR จาก promptpay.io
  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = `https://promptpay.io/${promptPayNumber}/${total}.png`;
  img.alt = "QR สำหรับพร้อมเพย์";
  img.width = 200;
  qrcodeDiv.appendChild(img);

  // แสดงโซนใบสรุป
  document.getElementById("billArea").style.display = "block";
}
