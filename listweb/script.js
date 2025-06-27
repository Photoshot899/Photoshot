function calculate() {
  const name = document.getElementById("customerName").value || "ไม่ระบุ";
  const people = parseInt(document.getElementById("peopleCount").value) || 1;
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

  const promptPayNumber = "0812345678"; // ← เปลี่ยนเป็นเบอร์ของคุณ
  const qrUrl = `https://promptpay.io/${promptPayNumber}/${total}`;

  document.getElementById("result").innerHTML = `
    <b>ชื่อลูกค้า:</b> ${name}<br>
    <b>จำนวนคน:</b> ${people}<br>
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
