function addCustom() {
  customIndex++;
  const div = document.createElement('div');
  div.className = 'custom-person';
  div.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <label style="flex: 1;">ชื่อคนที่ Custom:
        <input type="text" name="customName" placeholder="ชื่อคนที่ ${customIndex}">
      </label>
      <button onclick="this.closest('.custom-person').remove()"
              style="margin-left: 10px; background-color: #e53935; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
        ❌ ลบ
      </button>
    </div>

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
