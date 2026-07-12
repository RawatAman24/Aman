const departments = [
    { key:'cardiology',  name:'Cardiology',        color:'#C1443C', level:'Level 3', room:'304', desc:'Heart & vascular care' },
    { key:'orthopedics', name:'Orthopedics',       color:'#2E6E8E', level:'Level 2', room:'214', desc:'Bones, joints & sports injury' },
    { key:'pediatrics',  name:'Pediatrics',        color:'#C98A2C', level:'Level 1', room:'108', desc:'Care for infants to teens' },
    { key:'neurology',   name:'Neurology',         color:'#6B4E9E', level:'Level 4', room:'412', desc:'Brain & nervous system' },
    { key:'dermatology', name:'Dermatology',       color:'#3F8C63', level:'Level 2', room:'226', desc:'Skin, hair & nails' },
    { key:'general',     name:'General Medicine',  color:'#1D5C63', level:'Level 1', room:'112', desc:'Primary & preventive care' },
  ];
  const doctors = [
    { id:'okafor',     name:'Dr. Amara Okafor',     dept:'cardiology',  credentials:'MD, FACC',        years:14, bio:'Interventional cardiology and heart failure management.' },
    { id:'menon',      name:'Dr. Rajiv Menon',      dept:'cardiology',  credentials:'MD',               years:9,  bio:'Preventive cardiology and cardiac imaging.' },
    { id:'petrova',    name:'Dr. Elena Petrova',    dept:'orthopedics', credentials:'MD',               years:11, bio:'Sports medicine and joint reconstruction.' },
    { id:'blackwood',  name:'Dr. Samuel Blackwood', dept:'orthopedics', credentials:'MD',               years:20, bio:'Spine care and orthopedic trauma surgery.' },
    { id:'nair',       name:'Dr. Priya Nair',       dept:'pediatrics',  credentials:'MD, FAAP',         years:8,  bio:'General pediatrics and newborn care.' },
    { id:'reyes',      name:'Dr. Tomas Reyes',      dept:'neurology',   credentials:'MD, PhD',          years:16, bio:'Movement disorders and neurodegenerative disease.' },
    { id:'lindqvist',  name:'Dr. Grace Lindqvist',  dept:'dermatology', credentials:'MD',               years:7,  bio:'Medical and cosmetic dermatology.' },
    { id:'osei',       name:'Dr. Daniel Osei',      dept:'general',     credentials:'MD',               years:12, bio:'Primary care and chronic disease management.' },
  ];
  const baseTimes = ['9:00 AM','9:45 AM','10:30 AM','11:15 AM','1:00 PM','1:45 PM','2:30 PM','3:15 PM','4:00 PM','4:45 PM'];
  function deptOf(key){ return departments.find(d=>d.key===key); }
  function initials(name){ return name.replace('Dr. ','').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase(); }
  function seeded(n){ const x = Math.sin(n)*10000; return x - Math.floor(x); }
  function to24(t){
    const [time, ap] = t.split(' ');
    let [h,m] = time.split(':').map(Number);
    if(ap==='PM' && h!==12) h += 12;
    if(ap==='AM' && h===12) h = 0;
    return {h,m};
  }
  function dayKey(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function dayLabel(d){ return { dow:d.toLocaleDateString(undefined,{weekday:'short'}), num:d.getDate(), mon:d.toLocaleDateString(undefined,{month:'short'}) }; }
  function slotDateTime(dateObj, timeStr){ const {h,m}=to24(timeStr); const d=new Date(dateObj); d.setHours(h,m,0,0); return d; }
  const upcomingDays = Array.from({length:7}).map((_,i)=>{
    const d = new Date(); d.setDate(d.getDate()+i); d.setHours(0,0,0,0); return d;
  });
  // generate deterministic per-doctor availability
  doctors.forEach((doc, di) => {
    doc.slots = {};
    upcomingDays.forEach((d, dayi) => {
      const key = dayKey(d);
      const closed = seeded(di*7.31 + dayi*3.7) < 0.12;
      let times = [];
      if(!closed){
        baseTimes.forEach((t, ti) => {
          if(seeded(di*13.7 + dayi*5.3 + ti*2.1) > 0.45) times.push(t);
        });
        if(dayi === 0){
          const now = new Date();
          times = times.filter(t => {
            const {h,m} = to24(t);
            const slotDate = new Date(); slotDate.setHours(h,m,0,0);
            return slotDate.getTime() > now.getTime() + 45*60000;
          });
        }
      }
      doc.slots[key] = times;
    });
    doc.earliest = null;
    for(const d of upcomingDays){
      const key = dayKey(d);
      if(doc.slots[key].length){ doc.earliest = { key, time: doc.slots[key][0], dateObj: d }; break; }
    }
  });
  function formatRelative(dateObj, timeStr){
    const key = dayKey(dateObj);
    if(key===dayKey(upcomingDays[0])) return `Today · ${timeStr}`;
    if(key===dayKey(upcomingDays[1])) return `Tomorrow · ${timeStr}`;
    const lbl = dayLabel(dateObj);
    return `${lbl.dow} ${lbl.mon} ${lbl.num} · ${timeStr}`;
  }
  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  const state = { filterDept:'all', modal:null, appointments:[] };
  function genCode(){
    const part = Math.random().toString(36).slice(2,6).toUpperCase();
    const now = new Date();
    return `MG-${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}-${part}`;
  }
  function barcodeHTML(code){
    let out = '';
    for(let i=0;i<code.length;i++){
      const c = code.charCodeAt(i);
      const w = 2 + (c % 6);
      const isBar = i % 2 === 0;
      out += `<span style="width:${w}px;background:${isBar ? 'var(--ink)' : 'transparent'}"></span>`;
    }
    return out;
  }
  // ---------------------------------------------------------------------
  // Board (rendered once)
  // ---------------------------------------------------------------------
  function renderBoard(){
    const rows = doctors
      .filter(d=>d.earliest)
      .map(d=>({ doc:d, dt: slotDateTime(d.earliest.dateObj, d.earliest.time) }))
      .sort((a,b)=>a.dt-b.dt)
      .slice(0,6);
    document.getElementById('boardRows').innerHTML = rows.map((r,i)=>{
      const dept = deptOf(r.doc.dept);
      return `<div class="board-row" style="--dc:${dept.color}; animation-delay:${i*80}ms">
        <span class="board-dot"></span>
        <span class="board-dept">${dept.name}</span>
        <span class="board-doc">${r.doc.name}</span>
        <span class="board-time">${formatRelative(r.doc.earliest.dateObj, r.doc.earliest.time)}</span>
      </div>`;
    }).join('');
    document.getElementById('boardClock').textContent = 'as of ' + new Date().toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
  }
  // ---------------------------------------------------------------------
  // Departments
  // ---------------------------------------------------------------------
  function renderDepartments(){
    const tiles = departments.map(dept=>{
      const count = doctors.filter(d=>d.dept===dept.key).length;
      const active = state.filterDept===dept.key;
      return `<button class="dept-tile ${active?'active':''}" style="--dc:${dept.color}" onclick="setFilter('${dept.key}')">
        <span class="dept-bar"></span>
        <span class="dept-loc">${dept.level} · Rm ${dept.room}</span>
        <h3>${dept.name}</h3>
        <p>${dept.desc}</p>
        <span class="dept-count">${count} physician${count>1?'s':''}</span>
      </button>`;
    }).join('');
    document.getElementById('deptGrid').innerHTML = tiles;
    document.getElementById('chipRow').innerHTML =
      `<button class="chip ${state.filterDept==='all'?'active':''}" onclick="setFilter('all')"><span class="dot" style="background:var(--brand)"></span>All departments</button>` +
      departments.map(dept=>`<button class="chip ${state.filterDept===dept.key?'active':''}" style="--dc:${dept.color}" onclick="setFilter('${dept.key}')"><span class="dot"></span>${dept.name}</button>`).join('');
  }
  function setFilter(key){
    state.filterDept = key;
    render();
    document.getElementById('doctors').scrollIntoView({behavior:'smooth', block:'start'});
  }
  // ---------------------------------------------------------------------
  // Doctors
  // ---------------------------------------------------------------------
  function renderDoctors(){
    const list = doctors.filter(d => state.filterDept==='all' || d.dept===state.filterDept);
    const html = list.map(doc=>{
      const dept = deptOf(doc.dept);
      const nextLabel = doc.earliest ? formatRelative(doc.earliest.dateObj, doc.earliest.time) : 'Fully booked this week';
      return `<article class="doctor-card" style="--dc:${dept.color}">
        <div class="doctor-top">
          <div class="doctor-avatar">${initials(doc.name)}</div>
          <div>
            <span class="dept-tag">${dept.name}</span>
            <h3>${doc.name}</h3>
            <p class="doctor-cred">${doc.credentials} · ${doc.years} yrs experience</p>
          </div>
        </div>
        <p class="doctor-bio">${doc.bio}</p>
        <div class="doctor-next"><span class="pulse-dot"></span>Next available: <strong>${nextLabel}</strong></div>
        <button class="btn-book" onclick="openBooking('${doc.id}')">Book appointment</button>
      </article>`;
    }).join('');
    document.getElementById('doctorGrid').innerHTML = html || `<div class="empty-state">No physicians in this department right now. Try another department.</div>`;
  }
  // Kiosk selects
  function populateKiosk(){
    const deptSel = document.getElementById('kioskDept');
    deptSel.innerHTML = `<option value="all">Any department</option>` + departments.map(d=>`<option value="${d.key}">${d.name}</option>`).join('');
    onKioskDeptChange();
  }
  function onKioskDeptChange(){
    const deptVal = document.getElementById('kioskDept').value;
    const docSel = document.getElementById('kioskDoctor');
    const list = doctors.filter(d => deptVal==='all' || d.dept===deptVal);
    docSel.innerHTML = `<option value="any">Any physician</option>` + list.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  }
  function kioskSearch(){
    const deptVal = document.getElementById('kioskDept').value;
    const docVal = document.getElementById('kioskDoctor').value;
    state.filterDept = deptVal;
    render();
    document.getElementById('doctors').scrollIntoView({behavior:'smooth', block:'start'});
    if(docVal && docVal !== 'any'){ openBooking(docVal); }
  }
  // ---------------------------------------------------------------------
  // Booking modal
  // ---------------------------------------------------------------------
  function openBooking(id){
    const doc = doctors.find(d=>d.id===id);
    if(!doc) return;
    const defaultKey = Object.keys(doc.slots).find(k => doc.slots[k].length > 0) || null;
    state.modal = { docId:id, step:1, dateKey:defaultKey, time:null, form:{ name:'', phone:'', age:'', reason:'', type:'new' } };
    render();
  }
  function closeModal(){ state.modal = null; render(); }
  function selectDate(key){ state.modal.dateKey = key; state.modal.time = null; render(); }
  function selectTime(t){ state.modal.time = t; render(); }
  function goStep2(){ if(!state.modal.time) return; state.modal.step = 2; render(); }
  function backStep1(){ state.modal.step = 1; render(); }
  function updateForm(field, value){ if(state.modal) state.modal.form[field] = value; }
  function confirmBooking(){
    const modal = state.modal;
    const doc = doctors.find(d=>d.id===modal.docId);
    if(!modal.form.name.trim() || !modal.form.phone.trim()){
      alert('Please add your name and phone number to confirm.');
      return;
    }
    const appt = {
      code: genCode(), docId: doc.id, doctorName: doc.name, dept: doc.dept,
      dateKey: modal.dateKey, time: modal.time,
      patientName: modal.form.name.trim(), phone: modal.form.phone.trim(),
      age: modal.form.age, reason: modal.form.reason.trim() || 'General consultation', type: modal.form.type,
    };
    doc.slots[modal.dateKey] = doc.slots[modal.dateKey].filter(t => t !== modal.time);
    state.appointments.push(appt);
    modal.step = 'success';
    modal.lastAppt = appt;
    render();
  }
  function cancelAppt(code){
    state.appointments = state.appointments.filter(a => a.code !== code);
    render();
  }
  function renderModal(){
    const root = document.getElementById('modalRoot');
    if(!state.modal){ root.innerHTML = ''; document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    const modal = state.modal;
    if(modal.step === 'success'){
      root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this) closeModal()">
        <div class="modal-panel" role="dialog" aria-modal="true">
          <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
          ${badgeHTML(modal.lastAppt)}
          <button class="btn-primary" style="width:100%; margin-top:16px;" onclick="closeModal()">Done</button>
        </div>
      </div>`;
      return;
    }
    const doc = doctors.find(d=>d.id===modal.docId);
    const dept = deptOf(doc.dept);
    if(modal.step === 1){
      const dateChips = upcomingDays.map(d=>{
        const key = dayKey(d);
        const has = doc.slots[key].length > 0;
        const lbl = dayLabel(d);
        const active = modal.dateKey === key;
        return `<button class="date-chip ${active?'active':''}" ${has?'':'disabled'} onclick="selectDate('${key}')">
          <span class="dow">${lbl.dow}</span><span class="num">${lbl.num}</span>
        </button>`;
      }).join('');
      const times = modal.dateKey ? doc.slots[modal.dateKey] : [];
      const timeChips = times.length
        ? times.map(t=>`<button class="time-chip ${modal.time===t?'active':''}" onclick="selectTime('${t}')">${t}</button>`).join('')
        : `<div class="time-empty">No open times this day — choose another date.</div>`;
      root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this) closeModal()">
        <div class="modal-panel" role="dialog" aria-modal="true">
          <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
          <div class="modal-doc">
            <div class="doctor-avatar" style="background:${dept.color}">${initials(doc.name)}</div>
            <div>
              <span class="dept-tag" style="color:${dept.color}">${dept.name}</span>
              <h3>${doc.name}</h3>
            </div>
          </div>
          <h4>Choose a date</h4>
          <div class="date-row">${dateChips}</div>
          <h4>Choose a time</h4>
          <div class="time-grid">${timeChips}</div>
          <div class="modal-actions">
            <button class="btn-primary" ${modal.time ? '' : 'disabled'} onclick="goStep2()" style="width:100%">Continue</button>
          </div>
        </div>
      </div>`;
      return;
    }
    if(modal.step === 2){
      const dateObj = upcomingDays.find(d => dayKey(d) === modal.dateKey);
      root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this) closeModal()">
        <div class="modal-panel" role="dialog" aria-modal="true">
          <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
          <div class="modal-doc">
            <div class="doctor-avatar" style="background:${dept.color}">${initials(doc.name)}</div>
            <div>
              <span class="dept-tag" style="color:${dept.color}">${dept.name}</span>
              <h3>${doc.name}</h3>
            </div>
          </div>
          <div class="summary-box">
            <div><span>Visit</span><span>${formatRelative(dateObj, modal.time)}</span></div>
            <div><span>Location</span><span>${dept.level} · Rm ${dept.room}</span></div>
          </div>
          <h4>Your details</h4>
          <div class="form-field">
            <label for="fName">Full name</label>
            <input id="fName" type="text" value="${modal.form.name}" oninput="updateForm('name', this.value)" placeholder="Jordan Lee">
          </div>
          <div class="form-field">
            <label for="fPhone">Phone number</label>
            <input id="fPhone" type="tel" value="${modal.form.phone}" oninput="updateForm('phone', this.value)" placeholder="(555) 010-0142">
          </div>
          <div class="form-field">
            <label for="fAge">Age</label>
            <input id="fAge" type="number" min="0" max="120" value="${modal.form.age}" oninput="updateForm('age', this.value)" placeholder="34">
          </div>
          <div class="form-field">
            <label for="fReason">Reason for visit</label>
            <textarea id="fReason" oninput="updateForm('reason', this.value)" placeholder="Briefly describe why you're coming in">${modal.form.reason}</textarea>
          </div>
          <div class="form-field">
            <label>Patient status</label>
            <div class="radio-row">
              <label><input type="radio" name="ptype" value="new" ${modal.form.type==='new'?'checked':''} onchange="updateForm('type','new')"> New patient</label>
              <label><input type="radio" name="ptype" value="returning" ${modal.form.type==='returning'?'checked':''} onchange="updateForm('type','returning')"> Returning</label>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-ghost" onclick="backStep1()">Back</button>
            <button class="btn-primary" onclick="confirmBooking()">Confirm booking</button>
          </div>
        </div>
      </div>`;
    }
  }
  function badgeHTML(appt){
    const dept = deptOf(appt.dept);
    const dateObj = upcomingDays.find(d => dayKey(d) === appt.dateKey) || new Date();
    return `<div class="badge" style="--dc:${dept.color}">
      <div class="badge-ribbon"></div>
      <div class="badge-top">
        <span class="badge-status">Appointment confirmed</span>
        <h3>${appt.doctorName}</h3>
        <p>${dept.name} · ${dept.level}, Room ${dept.room}</p>
        <div class="badge-grid">
          <div><span class="k">Patient</span><span class="v">${appt.patientName}</span></div>
          <div><span class="k">Visit</span><span class="v">${formatRelative(dateObj, appt.time)}</span></div>
          <div><span class="k">Type</span><span class="v">${appt.type==='new'?'New patient':'Returning'}</span></div>
          <div><span class="k">Reason</span><span class="v">${appt.reason}</span></div>
        </div>
      </div>
      <div class="badge-bottom">
        <div class="badge-code">${appt.code}</div>
        <div class="barcode">${barcodeHTML(appt.code)}</div>
        <div class="badge-actions">
          <button class="btn-ghost" onclick="downloadPass('${appt.code}')">Download pass (.ics)</button>
          <button class="btn-danger-outline" onclick="cancelAppt('${appt.code}')">Cancel</button>
        </div>
      </div>
    </div>`;
  }
  function downloadPass(code){
    const appt = state.appointments.find(a=>a.code===code) || (state.modal && state.modal.lastAppt && state.modal.lastAppt.code===code ? state.modal.lastAppt : null);
    if(!appt) return;
    const dateObj = upcomingDays.find(d => dayKey(d) === appt.dateKey) || new Date();
    const {h,m} = to24(appt.time);
    const start = new Date(dateObj); start.setHours(h,m,0,0);
    const end = new Date(start.getTime() + 30*60000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const dept = deptOf(appt.dept);
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Meridian General//Patient Portal//EN','BEGIN:VEVENT',
      `UID:${appt.code}@meridiangeneral.example`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:Appointment with ${appt.doctorName}`,
      `LOCATION:${dept.level}, Room ${dept.room} — Meridian General`,
      `DESCRIPTION:${dept.name} visit. Confirmation code ${appt.code}.`,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], {type:'text/calendar'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${appt.code}.ics`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  // ---------------------------------------------------------------------
  // Appointments list
  // ---------------------------------------------------------------------
  function renderAppointments(){
    const grid = document.getElementById('apptGrid');
    if(!state.appointments.length){
      grid.innerHTML = `<div class="empty-state">No appointments booked yet — confirmed visits will appear here as your patient pass.</div>`;
    } else {
      grid.innerHTML = state.appointments.map(a=>badgeHTML(a)).join('');
    }
    document.getElementById('navCount').textContent = state.appointments.length;
  }
  // ---------------------------------------------------------------------
  // Master render
  // ---------------------------------------------------------------------
  function render(){
    renderDepartments();
    renderDoctors();
    renderModal();
    renderAppointments();
  }
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && state.modal) closeModal(); });
  populateKiosk();
  renderBoard();
  render();
