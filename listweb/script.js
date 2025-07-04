let customIndex = 0;

function addCustom() {
  customIndex++;
  const div = document.createElement('div');
  div.className = 'custom-person';
  div.innerHTML = `
    <label>ชื่อคนที่ Custom:
      <input type="text" name="customName" placeholder="ชื่อคนที่ ${customIndex}">
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
  `;
  document.getElementById('customList').appendChild(div);
}

function calculate() {
  const name = document.getElementById("customerName").value || "ไม่ระบุ";
  const people = parseInt(document.getElementById("peopleCount").value) || 1;
  const pickupDate = document.getElementById("pickupDate")?.value || "ไม่ระบุ";
  const contactInfo = document.getElementById("contactInfo")?.value || "ไม่ระบุ";
  const basePrice = 350;

  let customTotal = 0;
  let customDetails = "";
  const blocks = document.querySelectorAll(".custom-person");

  blocks.forEach((block, i) => {
    const cname = block.querySelector("input[name='customName']").value || `คนที่ ${i + 1}`;
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
    customDetails += `${cname}: ${desc.join(", ") || "ไม่มี"} (+${subtotal}฿)<br>`;
  });

  const baseTotal = basePrice * people;
  const total = baseTotal + customTotal;
  const promptPayNumber = "0812345678"; // ✅ เปลี่ยนเป็นเบอร์ PromptPay จริงของคุณ
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
