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
      <label><input type="checkbox" class="hairColor"> เปลี่ยนสีผม (+100฿)</label><br>
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
  const basePrice = 350;

  let customTotal = 0;
  let customDetails = "";
  const blocks = document.querySelectorAll(".custom-person");

  blocks.forEach((block, i) => {
    const cname = block.querySelector("input[name='customName']").value || `คนที่ ${i + 1}`;
    const hairColor = block.querySelector(".hairColor").checked ? 100 : 0;
    const hairStyleCode = block.querySelector(".hairStyleSelect").value;
    const hairStyle = hairStyleCode ? 100 : 0;
    const subtotal = hairColor + hairStyle;
    customTotal += subtotal;

    const desc = [];
    if (hairColor) desc.push("เปลี่ยนสีผม");
    if (hairStyle) desc.push(`ทรงผมรหัส ${hairStyleCode}`);

    customDetails += `${cname}: ${desc.join(", ") || "ไม่มี"} (+${subtotal}฿)<br>`;
  });

  const baseTotal = basePrice * people;
  const total = baseTotal + customTotal;

  document.getElementById("result").innerHTML = `
    <b>ชื่อลูกค้า:</b> ${name}<br>
    <b>จำนวนคน:</b> ${people}<br>
    <b>ถ่ายภาพพื้นฐาน:</b> ${basePrice} × ${people} = ${baseTotal}฿<br><br>
    <b><u>Custom รายบุคคล:</u></b><br>
    ${customDetails || "- ไม่มี -"}<br>
    <hr>
    <b>รวมทั้งหมด: ${total} บาท</b>
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
