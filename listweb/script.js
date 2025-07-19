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

  if (date) addToCalendar(name, contact, date);

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
      <label><input type="checkbox" class="customOption" data-label="เปลี่ยนสีผม"> เปลี่ยนสีผม (+100฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="รีทัชสิว / จุดด่างดำ"> รีทัชสิว / จุดด่างดำ (+100฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="ปรับผิวเนียน"> ปรับผิวเนียน (+100฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="ปรับหน้าเรียว / ลดแก้ม"> ปรับหน้าเรียว / ลดแก้ม (+100฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="รีทัชปาก / ฟันขาว"> รีทัชปาก / ฟันขาว (+100฿)</label><br>
      <label><input type="checkbox" class="customOption" data-label="ปรับคิ้ว / เติมคิ้ว"> ปรับคิ้ว / เติมคิ้ว (+100฿)</label><br><br>

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

// =====================
// GOOGLE CALENDAR
// =====================
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function initCalendarAPI() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: SCOPES,
  }).then(() => {
    return gapi.auth2.getAuthInstance().signIn();
  }).catch((err) => {
    alert("เชื่อมต่อ Google Calendar ไม่สำเร็จ: " + err.details);
  });
}

function addToCalendar(name, contact, date) {
  const event = {
    summary: `📸 นัดรับรูป: ${name}`,
    description: `ช่องทางติดต่อ: ${contact}`,
    start: { date: date },
    end: { date: date },
  };

  gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  }).then(response => {
    alert("✅ เพิ่มนัดรับรูปลง Google Calendar เรียบร้อย");
  }).catch(error => {
    alert("❌ เกิดข้อผิดพลาดในการบันทึก: " + error.message);
  });
}

gapi.load('client:auth2', initCalendarAPI);
