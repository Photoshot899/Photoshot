let customIndex = 0;

function goToPage1() {
  showPage("page1");
}

function goToPage2() {
  showPage("page2");
}

function goToPage3() {
  calculate();

  const name = document.getElementById("customerName").value || "ไม่ระบุ";
  const contact = document.getElementById("contactInfo").value || "ไม่ระบุ";
  const date = document.getElementById("pickupDate").value;

  if (date) {
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxVGnVcXKpR3JKtQFw1lQTR_3oqm5R_Z8qF64Im6D5h0LwstWSXgJOXffwnEbHgsn_zfQ/exec";
    fetch(WEBHOOK_URL, {
      method: "POST",
      body: new URLSearchParams({
        name: name,
        contact: contact,
        date: date
      })
    })
    .then(res => res.text())
    .then(msg => console.log("📅 Google Calendar:", msg))
    .catch(err => console.error("❌ Calendar Error:", err));
  }

  showPage("page3");
}

function showPage(id) {
  ["page1", "page2", "page3"].forEach(p => {
    document.getElementById(p).style.display = (p === id) ? "block" : "none";
  });
}

function addCustom() {
  customIndex++;
  const div = document.createElement('div');
  div.className = 'custom-person';
  div.innerHTML = `
    <label>ชื่อคนที่ Custom:
      <input type="text" name="customName" placeholder="ชื่อคนที่ ${customIndex}">
    </label>
    <label>รหัสไฟล์ภาพ:
      <input type="text" name="imageCode" placeholder="เช่น IMG_1234">
    </label>
    <div class="custom-options">
      <label><input type="checkbox" class="customOption" data-label="ลดเฉดสีผม"> ลดเฉดสีผม (+100฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="บีบหน้า - ลดแก้ม 25%"> บีบหน้า - ลดแก้ม 25% (0฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="บีบหน้า - ลดแก้ม 50%"> บีบหน้า - ลดแก้ม 50% (50฿)</label><br>
      <label>เลือกทรงผม:
        <select class="hairStyleSelect">
          <option value="">- ไม่เลือก -</option>
          <option value="HS01">HS01</option>
          <option value="HS02">HS02</option>
          <option value="HS03">HS03</option>
          <option value="HS04">HS04</option>
          <option value="HS05">HS05</option>
          <option value="HS06">HS06</option>
          <option value="HS07">HS07</option>
          <option value="HS08">HS08</option>
          <option value="HS09">HS09</option>
          <option value="HS10">HS10</option>
        </select> (+100฿)
      </label>
    </div>
    <button class="remove-button" onclick="removeCustom(this)">❌ ลบรายการนี้</button>
  `;
  document.getElementById('customList').appendChild(div);
}

function removeCustom(button) {
  const block = button.closest(".custom-person");
  if (block) block.remove();
}

function calculate() {
  const name = document.getElementById("customerName").value || "ไม่ระบุ";
  const people = Math.max(1, parseInt(document.getElementById("peopleCount").value) || 1);
  const pickupDate = document.getElementById("pickupDate")?.value || "ไม่ระบุ";
  const contactInfo = document.getElementById("contactInfo")?.value || "ไม่ระบุ";
  const basePrice = 350;

  let customTotal = 0;
  let customDetails = "";
  const blocks = document.querySelectorAll(".custom-person");

  blocks.forEach((block, i) => {
    const cname = block.querySelector("input[name='customName']").value || `คนที่ ${i + 1}`;
    const imageCode = block.querySelector("input[name='imageCode']").value || "-";
    const options = block.querySelectorAll(".customOption");
    const hairStyleCode = block.querySelector(".hairStyleSelect").value;

    let subtotal = 0;
    const desc = [];

    options.forEach(opt => {
      if (opt.checked) {
        subtotal += 100;
        desc.push(opt.dataset.label);
      }
    });

    if (hairStyleCode) {
      subtotal += 100;
      desc.push(`ทรงผมรหัส ${hairStyleCode}`);
    }

    customTotal += subtotal;
    customDetails += `${cname} (ไฟล์: ${imageCode}): ${desc.join(", ") || "ไม่มี"} (+${subtotal}฿)<br>`;
  });

  const baseTotal = basePrice * people;
  const total = baseTotal + customTotal;
  const promptPayNumber = "0812345678";
  const qrUrl = `https://promptpay.io/${promptPayNumber}/${total}`;

  document.getElementById("result").innerHTML = `
    <b>ชื่อลูกค้า:</b> ${name}<br>
    <b>จำนวนคน:</b> ${people}<br>
    <b>วันที่ต้องการรับรูป:</b> ${pickupDate}<br>
    <b>ช่องทางติดต่อ:</b> ${contactInfo}<br><br>
    <b>ถ่ายภาพพื้นฐาน:</b> ${basePrice} × ${people} = ${baseTotal}฿<br><br>
    <b><u>Custom รายบุคคล:</u></b><br>
    ${customDetails || "- ไม่มี -"}<br>
    <hr>
    <b>รวมทั้งหมด: ${total} บาท</b>
    <div style="margin-top:20px; text-align:center;">
      <b>สแกนจ่ายผ่าน PromptPay</b><br>
      <img src="${qrUrl}" alt="QR PromptPay" style="margin-top:8px; width:200px; height:auto;">
    </div>
  `;
}

function downloadImage() {
  html2canvas(document.querySelector("#result")).then(canvas => {
    const link = document.createElement("a");
    link.download = "ใบสรุปยอด.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
