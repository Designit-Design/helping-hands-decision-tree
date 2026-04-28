/* California Helping Hands — Decision Tree Widget v2 */
(function(){
function init(){
if(!document.getElementById('hh-tree'))return;

// ============================================================
// CONFIG — set these in the Webflow embed
// ============================================================
const WEB3FORMS_KEY=(typeof window!=='undefined'&&window.HH_WEB3FORMS_KEY)||'';
const SHEETS_URL=(typeof window!=='undefined'&&window.HH_SHEETS_URL)||'';
const CONTACT_PHONE=(typeof window!=='undefined'&&window.HH_PHONE)||'818-963-7149';
const CONTACT_PHONE_HREF='tel:+1'+(CONTACT_PHONE.replace(/\D/g,''));

// ============================================================
// ZIP DATABASE (171 zips)
// ============================================================
const ZIPS={"90016":"LA County","90019":"LA County","90035":"LA County","90045":"LA County","90049":"LA County","90209":"LA County","90210":"LA County","90211":"LA County","90212":"LA County","90213":"LA County","90230":"LA County","90231":"LA County","90232":"LA County","90245":"LA County","90254":"LA County","90263":"LA County","90264":"LA County","90265":"LA County","90266":"LA County","90267":"LA County","90272":"LA County","90274":"LA County","90275":"LA County","90277":"LA County","90278":"LA County","90291":"LA County","90292":"LA County","90293":"LA County","90401":"LA County","90402":"LA County","90403":"LA County","90404":"LA County","90405":"LA County","90406":"LA County","90407":"LA County","90408":"LA County","90409":"LA County","90410":"LA County","90411":"LA County","90501":"LA County","90502":"LA County","90503":"LA County","90504":"LA County","90505":"LA County","90506":"LA County","90508":"LA County","90509":"LA County","90510":"LA County","90717":"LA County","90731":"LA County","90732":"LA County","90733":"LA County","90734":"LA County","90630":"OC County","90720":"OC County","90721":"OC County","90740":"OC County","90803":"OC County","91711":"OC County","91748":"OC County","91765":"OC County","91766":"OC County","91767":"OC County","91768":"OC County","91769":"OC County","91790":"OC County","91791":"OC County","91792":"OC County","91793":"OC County","92602":"OC County","92603":"OC County","92604":"OC County","92605":"OC County","92606":"OC County","92612":"OC County","92614":"OC County","92615":"OC County","92616":"OC County","92617":"OC County","92618":"OC County","92619":"OC County","92620":"OC County","92623":"OC County","92626":"OC County","92627":"OC County","92628":"OC County","92646":"OC County","92647":"OC County","92648":"OC County","92649":"OC County","92650":"OC County","92657":"OC County","92658":"OC County","92659":"OC County","92660":"OC County","92661":"OC County","92662":"OC County","92663":"OC County","92683":"OC County","92684":"OC County","92697":"OC County","92780":"OC County","92781":"OC County","92782":"OC County","92807":"OC County","92808":"OC County","92840":"OC County","92841":"OC County","92842":"OC County","92843":"OC County","92844":"OC County","92845":"OC County","92846":"OC County","92856":"OC County","92857":"OC County","92859":"OC County","92861":"OC County","92862":"OC County","92863":"OC County","92864":"OC County","92865":"OC County","92866":"OC County","92867":"OC County","92868":"OC County","92869":"OC County","92885":"OC County","92886":"OC County","92887":"OC County","91301":"Ventura County","91302":"Ventura County","91320":"Ventura County","91358":"Ventura County","91359":"Ventura County","91360":"Ventura County","91361":"Ventura County","91362":"Ventura County","91377":"Ventura County","93001":"Ventura County","93002":"Ventura County","93003":"Ventura County","93004":"Ventura County","93005":"Ventura County","93006":"Ventura County","93007":"Ventura County","93009":"Ventura County","93010":"Ventura County","93011":"Ventura County","93012":"Ventura County","93015":"Ventura County","93020":"Ventura County","93021":"Ventura County","93023":"Ventura County","93024":"Ventura County","93030":"Ventura County","93031":"Ventura County","93032":"Ventura County","93033":"Ventura County","93034":"Ventura County","93035":"Ventura County","93036":"Ventura County","93041":"Ventura County","93044":"Ventura County","93060":"Ventura County","93061":"Ventura County","93062":"Ventura County","93063":"Ventura County","93064":"Ventura County","93065":"Ventura County","93066":"Ventura County","93094":"Ventura County","93099":"Ventura County"};

// ============================================================
// TIER DEFINITIONS + IMAGES
// ============================================================
const TIERS={
  essential:{
    name:"Essential Care",color:"green",startingAt:"$32",
    image:"https://cdn.prod.website-files.com/69cc36e2bebac08fced90835/69e11167375e664aea56e8ba_Companionship%201.webp",
    description:"Daily living basics — companionship, meals, light housekeeping, and routine support to help your loved one stay comfortable at home.",
    features:["Companionship & conversation","Meal preparation & hydration reminders","Light housekeeping & laundry","Medication reminders","Errands and grocery shopping"]
  },
  personal:{
    name:"Personal Care",color:"blue",startingAt:"$37",
    image:"https://cdn.prod.website-files.com/69cc36e2bebac08fced90835/69e1122015878d13155a5209_Personal%20Care%20Hero.webp",
    description:"Hands-on ADL support — bathing, dressing, mobility assistance, plus everything in Essential Care.",
    features:["Everything in Essential Care","Bathing & personal hygiene","Dressing & grooming","Mobility & transfer support","Toileting assistance"]
  },
  advanced:{
    name:"Advanced Care",color:"purple",startingAt:"$43",
    image:"https://cdn.prod.website-files.com/69cc36e2bebac08fced90835/69e1125ee4bcf925ccaba7df_Mobiltiy%20Image%202.webp",
    description:"Specialized support for complex needs — dementia care, fall prevention, post-surgery recovery, and chronic condition support.",
    features:["Everything in Personal Care","Dementia & Alzheimer's support","Fall prevention & safety protocols","Post-surgery & hospital recovery","Close supervision & specialized care"]
  }
};

// ============================================================
// STATE
// ============================================================
const TOTAL_STEPS=10;
const STEP_LABELS=['Recipient','Timing','Your Info','Location','Frequency','Time of Day','Care Needs','Recommendation','Details','Complete'];
let currentStep=1;
let partialSent=false;
const answers={
  recipient:null, urgency:null, firstName:'', email:'',
  zip:'', county:'',
  frequency:null, timeofday:[],
  'needs-everyday':[],'needs-handson':[],'needs-advanced':[],
  tier:'',
  careFor:'', gender:'', age:'', phone:'', lastName:'', notes:'',
  birthday:'', address:'', city:'', state:'California'
};

const root=document.getElementById('hh-tree');
const $=sel=>root.querySelector(sel);
const $$=sel=>root.querySelectorAll(sel);

// ============================================================
// PROGRESS
// ============================================================
function renderProgress(){
  const wrap=$('#hh-prog');
  let h='';
  for(let i=1;i<=TOTAL_STEPS;i++){
    let c='hh-prog-dot';
    if(i<currentStep)c+=' done';else if(i===currentStep)c+=' active';
    h+=`<div class="${c}"></div>`;
  }
  wrap.innerHTML=h;
  $('#hh-prog-lbl').textContent=`Step ${currentStep} of ${TOTAL_STEPS} — ${STEP_LABELS[currentStep-1]}`;
}

function showStep(n){
  currentStep=n;
  $$('.hh-card').forEach(c=>c.classList.remove('active'));
  const card=$(`[data-step="${n}"]`);
  if(card)card.classList.add('active');
  renderProgress();
  try{root.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}
}

// ============================================================
// OPTION HANDLERS
// ============================================================
$$('.hh-opts').forEach(group=>{
  const type=group.dataset.type;
  const question=group.dataset.question;
  group.querySelectorAll('.hh-opt').forEach(opt=>{
    opt.addEventListener('click',()=>{
      const value=opt.dataset.value;
      if(type==='single'){
        group.querySelectorAll('.hh-opt').forEach(o=>o.classList.remove('sel'));
        opt.classList.add('sel');
        answers[question]=value;
      }else{
        opt.classList.toggle('sel');
        if(!Array.isArray(answers[question]))answers[question]=[];
        if(opt.classList.contains('sel')){
          if(!answers[question].includes(value))answers[question].push(value);
        }else{
          answers[question]=answers[question].filter(v=>v!==value);
        }
      }
      updateContinueButton(currentStep);
    });
  });
});

// TIER CHIPS
$$('.hh-tier-items').forEach(group=>{
  const question=group.dataset.question;
  group.querySelectorAll('.hh-tier-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const value=chip.dataset.value;
      chip.classList.toggle('sel');
      if(!Array.isArray(answers[question]))answers[question]=[];
      if(chip.classList.contains('sel')){
        if(!answers[question].includes(value))answers[question].push(value);
      }else{
        answers[question]=answers[question].filter(v=>v!==value);
      }
      updateContinueButton(7);
    });
  });
});

// ============================================================
// VALIDATION
// ============================================================
function isStepValid(step){
  switch(step){
    case 1:return !!answers.recipient;
    case 2:return !!answers.urgency;
    case 3:return answers.firstName.trim().length>0&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email);
    case 4:return /^\d{5}$/.test(answers.zip);
    case 5:return !!answers.frequency;
    case 6:return answers.timeofday.length>0;
    case 7:return(answers['needs-everyday'].length+answers['needs-handson'].length+answers['needs-advanced'].length)>0;
    case 8:return true;
    case 9:return answers.phone.replace(/\D/g,'').length>=10;
    default:return true;
  }
}

function updateContinueButton(step){
  const el=$(`[data-step="${step}"]`);
  if(!el)return;
  const btn=el.querySelector('[data-action="next"],[data-action="submit"]');
  if(!btn)return;
  btn.disabled=!isStepValid(step);
}

// ============================================================
// STEP 3 FIELDS (first name + email)
// ============================================================
$('#hh-firstname').addEventListener('input',e=>{answers.firstName=e.target.value;updateContinueButton(3)});
$('#hh-email').addEventListener('input',e=>{answers.email=e.target.value;updateContinueButton(3)});

// ============================================================
// STEP 4: ZIP
// ============================================================
const zipInput=$('#hh-zip');
const zipStatus=$('#hh-zip-status');
const zipStatusText=$('#hh-zip-status-text');
const zipNote=$('#hh-zip-note');

zipInput.addEventListener('input',e=>{
  const val=e.target.value.replace(/\D/g,'').slice(0,5);
  e.target.value=val;
  answers.zip=val;
  if(val.length===5){
    if(ZIPS[val]){
      answers.county=ZIPS[val];
      zipStatus.className='hh-zip-status show ok';
      zipStatusText.textContent='✓ We serve '+ZIPS[val]+'!';
      zipNote.style.display='none';
    }else{
      answers.county='Outside service area';
      zipStatus.className='hh-zip-status show no';
      zipStatusText.textContent='⚠ Outside our current service area';
      zipNote.style.display='flex';
    }
  }else{
    answers.county='';
    zipStatus.className='hh-zip-status';
    zipNote.style.display='none';
  }
  updateContinueButton(4);
});

// ============================================================
// STEP 9 FIELDS
// ============================================================
function bindStep9(){
  // Chips for care-for
  $$('#hh-step9 .hh-chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      $$('#hh-step9 .hh-chip').forEach(c=>c.classList.remove('sel'));
      chip.classList.add('sel');
      answers.careFor=chip.dataset.value;
    });
  });
  const fields={
    'hh-lastname':'lastName','hh-phone2':'phone',
    'hh-gender':'gender','hh-age':'age','hh-notes':'notes',
    'hh-birthday':'birthday','hh-addr':'address','hh-city':'city','hh-state':'state'
  };
  Object.keys(fields).forEach(id=>{
    const el=$('#'+id);
    if(!el)return;
    el.addEventListener('input',e=>{
      let v=e.target.value;
      if(id==='hh-phone2'){
        let raw=v.replace(/\D/g,'').slice(0,10);
        if(raw.length>=7)v=`(${raw.slice(0,3)}) ${raw.slice(3,6)}-${raw.slice(6)}`;
        else if(raw.length>=4)v=`(${raw.slice(0,3)}) ${raw.slice(3)}`;
        else if(raw.length>0)v=`(${raw}`;else v='';
        e.target.value=v;
      }
      answers[fields[id]]=v;
      updateContinueButton(9);
    });
    if(el.tagName==='SELECT'){
      el.addEventListener('change',e=>{answers[fields[id]]=e.target.value;updateContinueButton(9)});
    }
  });
}

// ============================================================
// TIER LOGIC
// ============================================================
function calculateTier(){
  if(answers['needs-advanced'].length>0)return'advanced';
  if(answers['needs-handson'].length>0)return'personal';
  return'essential';
}

function renderRecommendation(){
  const tierKey=calculateTier();
  answers.tier=tierKey;
  const tier=TIERS[tierKey];
  const card=$('#hh-rec-card');
  card.className='hh-rec-card '+tier.color;
  const feats=tier.features.map(f=>`<li>${f}</li>`).join('');
  card.innerHTML=`
    <img class="hh-rec-img" src="${tier.image}" alt="${tier.name}">
    <div class="hh-rec-body">
      <div class="hh-rec-tier-label"><span class="hh-tier-dot ${tier.color}"></span>Your Recommended Tier</div>
      <div class="hh-rec-tier-name">${tier.name}</div>
      <div class="hh-rec-price">Starting at <strong>${tier.startingAt}</strong>/hr</div>
      <div class="hh-rec-price-note">Based on a 4–8 hour shift (minimum)</div>
      <div class="hh-rec-tier-desc">${tier.description}</div>
      <ul class="hh-rec-features">${feats}</ul>
      <div class="hh-rec-disclaimer">* Transportation mileage is not included in the hourly rate. Mileage is billed separately at the current standard rate.</div>
    </div>`;
}

// ============================================================
// GOOGLE SHEETS — partial capture (silent, no email)
// ============================================================
function sendPartialToSheets(){
  if(partialSent||!SHEETS_URL)return;
  partialSent=true;
  const allNeeds=[...answers['needs-everyday'],...answers['needs-handson'],...answers['needs-advanced']];
  const payload={
    firstName:answers.firstName,
    email:answers.email,
    zip:answers.zip,
    county:answers.county,
    recipient:answers.recipient||'',
    urgency:answers.urgency||'',
    frequency:answers.frequency||'',
    timeOfDay:(answers.timeofday||[]).join(', '),
    careNeeds:allNeeds.join(', '),
    tier:answers.tier?TIERS[answers.tier].name:'',
    status:'Partial',
    timestamp:new Date().toLocaleString()
  };
  try{
    fetch(SHEETS_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }catch(e){console.warn('Sheets partial send failed',e)}
}

// ============================================================
// WEB3FORMS — complete submission (email to Chase)
// ============================================================
async function submitForm(){
  const submitBtn=$('[data-action="submit"]');
  const loadingEl=$('#hh-loading');
  const errorEl=$('#hh-submit-error');
  submitBtn.style.display='none';
  errorEl.classList.remove('show');
  loadingEl.classList.add('show');

  const allNeeds=[...answers['needs-everyday'],...answers['needs-handson'],...answers['needs-advanced']];
  const tierName=answers.tier?TIERS[answers.tier].name:'Not determined';

  // Grouped payload with section separators
  const payload={
    access_key:WEB3FORMS_KEY,
    subject:`✅ Complete Care Inquiry — ${answers.firstName} ${answers.lastName||''} (${tierName})`,
    from_name:'Helping Hands Care Quiz',

    '── CONTACT INFO ──':'',
    'First Name':answers.firstName,
    'Last Name':answers.lastName,
    'Email':answers.email,
    'Phone':answers.phone,

    '── CARE RECIPIENT ──':'',
    'Care For':answers.careFor||'Not specified',
    'Gender':answers.gender||'Not specified',
    'Age':answers.age||'Not specified',
    'Birthday':answers.birthday||'Not provided',

    '── CARE LOCATION ──':'',
    'Street Address':answers.address||'Not provided',
    'City':answers.city||'Not provided',
    'State':answers.state||'Not provided',
    'ZIP Code':answers.zip,
    'Service Area':answers.county,

    '── QUIZ ANSWERS ──':'',
    'Urgency':answers.urgency,
    'Frequency':answers.frequency,
    'Time of Day':(answers.timeofday||[]).join(', '),
    'Care Needs Selected':allNeeds.join(', '),

    '── RECOMMENDATION ──':'',
    'Recommended Tier':tierName,

    '── NOTES ──':'',
    'Medications / Special Instructions':answers.notes||'None provided'
  };

  // Also update Sheets with complete status
  if(SHEETS_URL){
    try{
      fetch(SHEETS_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        firstName:answers.firstName,lastName:answers.lastName,email:answers.email,phone:answers.phone,
        zip:answers.zip,county:answers.county,
        recipient:answers.recipient,urgency:answers.urgency,frequency:answers.frequency,
        timeOfDay:(answers.timeofday||[]).join(', '),careNeeds:allNeeds.join(', '),
        tier:tierName,careFor:answers.careFor,gender:answers.gender,age:answers.age,
        birthday:answers.birthday,address:answers.address,city:answers.city,state:answers.state,
        notes:answers.notes,
        status:'Complete',timestamp:new Date().toLocaleString()
      })});
    }catch(e){}
  }

  try{
    const res=await fetch('https://api.web3forms.com/submit',{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload)
    });
    const data=await res.json();
    loadingEl.classList.remove('show');
    if(data.success){
      $('#hh-final-name').textContent=answers.firstName;
      showStep(10);
      launchConfetti();
    }else{
      submitBtn.style.display='inline-flex';
      errorEl.classList.add('show');
    }
  }catch(err){
    loadingEl.classList.remove('show');
    submitBtn.style.display='inline-flex';
    errorEl.classList.add('show');
  }
}

// ============================================================
// CONFETTI
// ============================================================
function launchConfetti(){
  const wrap=document.createElement('div');
  wrap.className='hh-confetti-wrap';
  document.body.appendChild(wrap);
  const colors=['#00AEFD','#7CD1FE','#264D84','#2EAD6B','#8B5CF6','#F2B8A0','#3B82F6','#F59E0B'];
  const shapes=['circle','square'];
  for(let i=0;i<80;i++){
    const p=document.createElement('div');
    p.className='hh-confetti-piece';
    const c=colors[Math.floor(Math.random()*colors.length)];
    const s=shapes[Math.floor(Math.random()*shapes.length)];
    const size=Math.random()*8+6;
    const left=Math.random()*100;
    const dur=Math.random()*2+2;
    const delay=Math.random()*1.5;
    p.style.cssText=`left:${left}%;width:${size}px;height:${size}px;background:${c};border-radius:${s==='circle'?'50%':'2px'};animation-duration:${dur}s;animation-delay:${delay}s;opacity:0.9`;
    wrap.appendChild(p);
  }
  setTimeout(()=>wrap.remove(),5000);
}

// ============================================================
// NAVIGATION
// ============================================================
root.addEventListener('click',e=>{
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(!action)return;
  if(action==='next'){
    if(!isStepValid(currentStep))return;
    // Fire partial capture after step 3 (email collected)
    if(currentStep===3&&!partialSent)sendPartialToSheets();
    // Render recommendation before showing step 8
    if(currentStep===7)renderRecommendation();
    // Bind step 9 fields when entering step 9
    if(currentStep===8)setTimeout(bindStep9,50);
    if(currentStep<TOTAL_STEPS)showStep(currentStep+1);
  }else if(action==='back'){
    if(currentStep>1)showStep(currentStep-1);
    // Re-bind step 9 if going back to it
    if(currentStep===9)setTimeout(bindStep9,50);
  }else if(action==='submit'){
    if(isStepValid(9))submitForm();
  }
});

// Init
renderProgress();
bindStep9();
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
})();
