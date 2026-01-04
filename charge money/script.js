let customIndex = 0;
let bookingData = [];
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby56N6IkusCupHjqzsYI94G0_4o8pAfb_DlgRTClgqEaCBsQD7T5jerheK24ul4E97MGQ/exec";

// โหลดข้อมูลผู้จองจาก Google Sheets
async function loadBookingData() {
  try {
    // ใช้วันที่ปัจจุบันตาม timezone ท้องถิ่น (ไทย)
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');
    
    console.log('กำลังค้นหาข้อมูลสำหรับวันที่:', todayStr);
    
    // ใช้ GET request แทน POST สำหรับการดึงข้อมูล
    const response = await fetch(`${GOOGLE_SHEET_URL}?action=getBookings&date=${todayStr}`, {
      method: "GET"
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('ข้อมูลที่ได้รับจาก Google Sheets:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    bookingData = data;
    populateCustomerDropdown(data);
    document.getElementById('loadingMessage').style.display = 'none';
    
    console.log('โหลดข้อมูลสำเร็จ:', data.length, 'รายการ');
    
  } catch (error) {
    console.error('Error loading booking data:', error);
    handleLoadingError();
  }
}

// จัดการข้อผิดพลาดในการโหลดข้อมูล
function handleLoadingError() {
  document.getElementById('loadingMessage').innerHTML = 'ไม่สามารถโหลดข้อมูลได้ กรุณากรอกข้อมูลด้วยตนเอง';
  
  // รอ 2 วินาที แล้วเปลี่ยน dropdown เป็น input text
  setTimeout(() => {
    const customerSelect = document.getElementById('customerName');
    const parent = customerSelect.parentNode;
    
    // สร้าง input ใหม่
    const customerInput = document.createElement('input');
    customerInput.type = 'text';
    customerInput.id = 'customerName';
    customerInput.placeholder = 'กรอกชื่อผู้จอง';
    customerInput.className = customerSelect.className;
    
    // แทนที่ select ด้วย input
    parent.replaceChild(customerInput, customerSelect);
    
    // ซ่อนข้อความโหลด
    document.getElementById('loadingMessage').style.display = 'none';
  }, 2000);
}

// เติมข้อมูลใน dropdown
function populateCustomerDropdown(data) {
  const select = document.getElementById('customerName');
  select.innerHTML = '<option value="">-- เลือกชื่อผู้จอง --</option>';
  
  if (data && data.length > 0) {
    data.forEach((booking, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${booking.name || 'ไม่ระบุชื่อ'} (${booking.people || 1} คน)`;
      select.appendChild(option);
    });
    console.log('เติมข้อมูล dropdown สำเร็จ:', data.length, 'รายการ');
  } else {
    // ถ้าไม่มีข้อมูลการจองวันนี้
    console.log('ไม่มีข้อมูลการจองวันนี้');
    handleLoadingError(); // เปลี่ยนเป็น input text
  }
}

// เติมข้อมูลลูกค้าเมื่อเลือกชื่อ
function fillCustomerData() {
  const customerElement = document.getElementById('customerName');
  
  // ตรวจสอบว่าเป็น select หรือ input
  if (customerElement.tagName === 'SELECT') {
    const selectedIndex = customerElement.value;
    
    if (selectedIndex !== "" && bookingData[selectedIndex]) {
      const booking = bookingData[selectedIndex];
      
      // เติมข้อมูลตามที่มีใน Google Sheets
      document.getElementById('peopleCount').value = booking.people || '';
      document.getElementById('depositAmount').value = booking.deposit || '';
      document.getElementById('contactInfo').value = booking.phone || '';
      
      console.log('เติมข้อมูลลูกค้า:', booking.name);
    } else {
      // ล้างข้อมูลหากไม่ได้เลือกใคร
      clearCustomerData();
    }
  }
  // ถ้าเป็น input text ไม่ต้องทำอะไร ให้ user กรอกเอง
}

// ล้างข้อมูลลูกค้า
function clearCustomerData() {
  document.getElementById('peopleCount').value = '';
  document.getElementById('depositAmount').value = '';
  document.getElementById('contactInfo').value = '';
}

function goToPage1() {
  showPage("page1");
}

function goToPage2() {
  const customerNameElement = document.getElementById("customerName");
  let customerValue = "";
  
  // ตรวจสอบทั้ง select และ input
  if (customerNameElement.tagName === 'SELECT') {
    const selectedIndex = customerNameElement.value;
    customerValue = selectedIndex !== "" && bookingData[selectedIndex] ? 
                   bookingData[selectedIndex].name : "";
  } else {
    customerValue = customerNameElement.value.trim();
  }
    
  if (!customerValue) {
    alert("กรุณาเลือกหรือกรอกชื่อผู้จอง");
    return;
  }
  
  // ตรวจสอบจำนวนคน
  const peopleCount = document.getElementById("peopleCount").value;
  if (!peopleCount || peopleCount < 1) {
    alert("กรุณากรอกจำนวนคน (อย่างน้อย 1 คน)");
    return;
  }
  
  showPage("page2");
}

function goToPage3() {
  // คำนวณราคาก่อน
  calculate();
  
  // ไม่ส่งข้อมูลไปยัง Google Sheets เพราะเป็นแค่การดึงข้อมูลมาเปรียบเทียบ
  // ลบส่วนที่ส่งข้อมูลไปยัง Calendar ออก
  
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

    <div class="custom-option">
      <input type="checkbox" class="customOption" data-label="ลดเฉดสีผม" id="c1-${customIndex}">
      <label for="c1-${customIndex}">ลดเฉดสีผม (+100฿)</label>
    </div>

    <div class="custom-option">
      <input type="checkbox" class="customOption" data-label="บีบหน้า - ลดแก้ม 25%" id="c2-${customIndex}">
      <label for="c2-${customIndex}">บีบหน้า - ลดแก้ม 25% (0฿)</label>
    </div>

    <div class="custom-option">
      <input type="checkbox" class="customOption" data-label="บีบหน้า - ลดแก้ม 50%" id="c3-${customIndex}">
      <label for="c3-${customIndex}">บีบหน้า - ลดแก้ม 50% (50฿)</label>
    </div>

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
  const customerNameElement = document.getElementById("customerName");
  let customerName;
  
  // ตรวจสอบว่าเป็น select หรือ input
  if (customerNameElement.tagName === 'SELECT') {
    const selectedIndex = customerNameElement.value;
    customerName = selectedIndex !== "" && bookingData[selectedIndex] ? 
                  bookingData[selectedIndex].name : "ไม่ระบุ";
  } else {
    customerName = customerNameElement.value || "ไม่ระบุ";
  }
  
  const people = Math.max(1, parseInt(document.getElementById("peopleCount").value) || 1);
  const pickupDate = document.getElementById("pickupDate")?.value || "ไม่ระบุ";
  const contactInfo = document.getElementById("contactInfo")?.value || "ไม่ระบุ";
  const depositAmount = parseInt(document.getElementById("depositAmount")?.value) || 0;
  const basePrice = parseInt(document.getElementById("Totalprice")?.value) || 0;

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
        const price = opt.dataset.label.includes('25%') ? 0 : 
                     opt.dataset.label.includes('50%') ? 50 : 100;
        subtotal += price;
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

  //const baseTotal = basePrice * people;
  const grandTotal = basePrice + customTotal;
  const remainingAmount = grandTotal - depositAmount;
  const promptPayNumber = "0835050998";
  const qrUrl = `https://promptpay.io/${promptPayNumber}/${remainingAmount}`;

  document.getElementById("result").innerHTML = `
    <b>ชื่อลูกค้า:</b> ${customerName}<br>
    <b>จำนวนคน:</b> ${people}<br>
    <b>วันที่ต้องการรับรูป:</b> ${pickupDate}<br>
    <b>ช่องทางติดต่อ:</b> ${contactInfo}<br><br>
    <b><u>Custom รายบุคคล:</u></b><br>
    ${customDetails || "- ไม่มี -"}<br>
    <hr>
    <b>รวมทั้งหมด: ${grandTotal} บาท</b><br>
    <b>เงินมัดจำ:</b> ${depositAmount}฿<br>
    <b>คงเหลือที่ต้องจ่าย: ${remainingAmount} บาท</b>
    <div style="margin-top:20px; text-align:center;">
      <b>สแกนจ่ายผ่าน PromptPay (จำนวนที่คงเหลือ)</b><br>
      <img src="${qrUrl}" alt="QR PromptPay" style="margin-top:8px; width:200px; height:auto;">
    </div>
  `;
}

function downloadImage() {
  html2canvas(document.querySelector("#result")).then(canvas => {
    const link = document.createElement("a");
    const customerName = document.getElementById("customerName").tagName === 'SELECT' ? 
                        (bookingData[document.getElementById("customerName").value]?.name || "ไม่ระบุ") :
                        document.getElementById("customerName").value || "ไม่ระบุ";
    link.download = `ใบสรุปยอด_${customerName}_${new Date().toLocaleDateString('th-TH')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

// โหลดข้อมูลเมื่อหน้าเว็บเริ่มต้น
window.onload = function() {
  loadBookingData();
};
