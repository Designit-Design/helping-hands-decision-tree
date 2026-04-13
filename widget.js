/* California Helping Hands — Decision Tree Widget */
(function() {
  function init() {
    if (!document.getElementById('hh-tree')) return;
// ============================================================
    // CONFIG
    // ============================================================
    const WEB3FORMS_KEY = (typeof window !== "undefined" && window.HH_WEB3FORMS_KEY) || "REPLACE_WITH_YOUR_WEB3FORMS_KEY";

    // ============================================================
    // ZIP DATABASE (171 zips, LA + OC + Ventura)
    // ============================================================
    const ZIPS = {"90016":"LA County","90019":"LA County","90035":"LA County","90045":"LA County","90049":"LA County","90209":"LA County","90210":"LA County","90211":"LA County","90212":"LA County","90213":"LA County","90230":"LA County","90231":"LA County","90232":"LA County","90245":"LA County","90254":"LA County","90263":"LA County","90264":"LA County","90265":"LA County","90266":"LA County","90267":"LA County","90272":"LA County","90274":"LA County","90275":"LA County","90277":"LA County","90278":"LA County","90291":"LA County","90292":"LA County","90293":"LA County","90401":"LA County","90402":"LA County","90403":"LA County","90404":"LA County","90405":"LA County","90406":"LA County","90407":"LA County","90408":"LA County","90409":"LA County","90410":"LA County","90411":"LA County","90501":"LA County","90502":"LA County","90503":"LA County","90504":"LA County","90505":"LA County","90506":"LA County","90508":"LA County","90509":"LA County","90510":"LA County","90717":"LA County","90731":"LA County","90732":"LA County","90733":"LA County","90734":"LA County","90630":"OC County","90720":"OC County","90721":"OC County","90740":"OC County","90803":"OC County","91711":"OC County","91748":"OC County","91765":"OC County","91766":"OC County","91767":"OC County","91768":"OC County","91769":"OC County","91790":"OC County","91791":"OC County","91792":"OC County","91793":"OC County","92602":"OC County","92603":"OC County","92604":"OC County","92605":"OC County","92606":"OC County","92612":"OC County","92614":"OC County","92615":"OC County","92616":"OC County","92617":"OC County","92618":"OC County","92619":"OC County","92620":"OC County","92623":"OC County","92626":"OC County","92627":"OC County","92628":"OC County","92646":"OC County","92647":"OC County","92648":"OC County","92649":"OC County","92650":"OC County","92657":"OC County","92658":"OC County","92659":"OC County","92660":"OC County","92661":"OC County","92662":"OC County","92663":"OC County","92683":"OC County","92684":"OC County","92697":"OC County","92780":"OC County","92781":"OC County","92782":"OC County","92807":"OC County","92808":"OC County","92840":"OC County","92841":"OC County","92842":"OC County","92843":"OC County","92844":"OC County","92845":"OC County","92846":"OC County","92856":"OC County","92857":"OC County","92859":"OC County","92861":"OC County","92862":"OC County","92863":"OC County","92864":"OC County","92865":"OC County","92866":"OC County","92867":"OC County","92868":"OC County","92869":"OC County","92885":"OC County","92886":"OC County","92887":"OC County","91301":"Ventura County","91302":"Ventura County","91320":"Ventura County","91358":"Ventura County","91359":"Ventura County","91360":"Ventura County","91361":"Ventura County","91362":"Ventura County","91377":"Ventura County","93001":"Ventura County","93002":"Ventura County","93003":"Ventura County","93004":"Ventura County","93005":"Ventura County","93006":"Ventura County","93007":"Ventura County","93009":"Ventura County","93010":"Ventura County","93011":"Ventura County","93012":"Ventura County","93015":"Ventura County","93020":"Ventura County","93021":"Ventura County","93023":"Ventura County","93024":"Ventura County","93030":"Ventura County","93031":"Ventura County","93032":"Ventura County","93033":"Ventura County","93034":"Ventura County","93035":"Ventura County","93036":"Ventura County","93041":"Ventura County","93044":"Ventura County","93060":"Ventura County","93061":"Ventura County","93062":"Ventura County","93063":"Ventura County","93064":"Ventura County","93065":"Ventura County","93066":"Ventura County","93094":"Ventura County","93099":"Ventura County"};

    // ============================================================
    // TIER DEFINITIONS
    // ============================================================
    const TIERS = {
      essential: {
        name: "Essential Care",
        color: "green",
        description: "Daily living basics — companionship, meals, light housekeeping, and routine support to help your loved one stay comfortable at home.",
        features: [
          "Companionship & conversation",
          "Meal preparation & hydration reminders",
          "Light housekeeping & laundry",
          "Medication reminders",
          "Errands and grocery shopping"
        ]
      },
      personal: {
        name: "Personal Care",
        color: "blue",
        description: "Hands-on ADL support — bathing, dressing, mobility assistance, plus everything in Essential Care.",
        features: [
          "Everything in Essential Care",
          "Bathing & personal hygiene",
          "Dressing & grooming",
          "Mobility & transfer support",
          "Toileting assistance"
        ]
      },
      advanced: {
        name: "Advanced Care",
        color: "purple",
        description: "Specialized support for complex needs — dementia care, fall prevention, post-surgery recovery, and chronic condition support.",
        features: [
          "Everything in Personal Care",
          "Dementia & Alzheimer's support",
          "Fall prevention & safety protocols",
          "Post-surgery & hospital recovery",
          "Close supervision & specialized care"
        ]
      }
    };

    // ============================================================
    // STATE
    // ============================================================
    const TOTAL_STEPS = 9;
    const STEP_LABELS = ['Recipient','Timing','Frequency','Time of Day','Care Needs','Location','Recommendation','Contact','Next Steps'];
    let currentStep = 1;
    const answers = {
      recipient: null,
      urgency: null,
      frequency: null,
      timeofday: [],
      'needs-everyday': [],
      'needs-handson': [],
      'needs-advanced': [],
      zip: '',
      county: '',
      tier: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };

    const root = document.getElementById('hh-tree');
    const $ = (sel) => root.querySelector(sel);
    const $$ = (sel) => root.querySelectorAll(sel);

    // ============================================================
    // PROGRESS BAR
    // ============================================================
    function renderProgress() {
      const wrap = $('#hh-prog');
      let html = '';
      for (let i = 1; i <= TOTAL_STEPS; i++) {
        let cls = 'hh-prog-dot';
        if (i < currentStep) cls += ' done';
        else if (i === currentStep) cls += ' active';
        html += `<div class="${cls}"></div>`;
      }
      wrap.innerHTML = html;
      $('#hh-prog-lbl').textContent = `Step ${currentStep} of ${TOTAL_STEPS} — ${STEP_LABELS[currentStep-1]}`;
    }

    function showStep(n) {
      currentStep = n;
      $$('.hh-card').forEach(c => c.classList.remove('active'));
      $(`[data-step="${n}"]`).classList.add('active');
      renderProgress();
      try {
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch(e) {}
    }

    // ============================================================
    // SINGLE / MULTI OPTION HANDLERS
    // ============================================================
    $$('.hh-opts').forEach(group => {
      const type = group.dataset.type;
      const question = group.dataset.question;
      group.querySelectorAll('.hh-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          const value = opt.dataset.value;
          if (type === 'single') {
            group.querySelectorAll('.hh-opt').forEach(o => o.classList.remove('sel'));
            opt.classList.add('sel');
            answers[question] = value;
          } else {
            opt.classList.toggle('sel');
            const isSelected = opt.classList.contains('sel');
            if (!Array.isArray(answers[question])) answers[question] = [];
            if (isSelected) {
              if (!answers[question].includes(value)) answers[question].push(value);
            } else {
              answers[question] = answers[question].filter(v => v !== value);
            }
          }
          updateContinueButton(currentStep);
        });
      });
    });

    // ============================================================
    // TIERED CHIP HANDLERS (Step 5)
    // ============================================================
    $$('.hh-tier-items').forEach(group => {
      const question = group.dataset.question;
      group.querySelectorAll('.hh-tier-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const value = chip.dataset.value;
          chip.classList.toggle('sel');
          const isSelected = chip.classList.contains('sel');
          if (!Array.isArray(answers[question])) answers[question] = [];
          if (isSelected) {
            if (!answers[question].includes(value)) answers[question].push(value);
          } else {
            answers[question] = answers[question].filter(v => v !== value);
          }
          updateContinueButton(5);
        });
      });
    });

    // ============================================================
    // VALIDATION
    // ============================================================
    function isStepValid(step) {
      switch (step) {
        case 1: return !!answers.recipient;
        case 2: return !!answers.urgency;
        case 3: return !!answers.frequency;
        case 4: return answers.timeofday.length > 0;
        case 5:
          return (answers['needs-everyday'].length +
                  answers['needs-handson'].length +
                  answers['needs-advanced'].length) > 0;
        case 6: return /^\d{5}$/.test(answers.zip);
        case 7: return true;
        case 8:
          return answers.firstName.trim() &&
                 answers.lastName.trim() &&
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email) &&
                 answers.phone.replace(/\D/g,'').length >= 10;
        default: return true;
      }
    }

    function updateContinueButton(step) {
      const stepEl = $(`[data-step="${step}"]`);
      if (!stepEl) return;
      const btn = stepEl.querySelector('[data-action="next"], [data-action="submit"]');
      if (!btn) return;
      btn.disabled = !isStepValid(step);
    }

    // ============================================================
    // ZIP CODE HANDLER
    // ============================================================
    const zipInput = $('#hh-zip');
    const zipStatus = $('#hh-zip-status');
    const zipStatusText = $('#hh-zip-status-text');
    const zipNote = $('#hh-zip-note');

    zipInput.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 5);
      e.target.value = val;
      answers.zip = val;
      if (val.length === 5) {
        if (ZIPS[val]) {
          answers.county = ZIPS[val];
          zipStatus.className = 'hh-zip-status show ok';
          zipStatusText.textContent = `✓ We serve ${ZIPS[val]}!`;
          zipNote.style.display = 'none';
        } else {
          answers.county = 'Outside service area';
          zipStatus.className = 'hh-zip-status show no';
          zipStatusText.textContent = '⚠ Outside our current service area';
          zipNote.style.display = 'flex';
        }
      } else {
        answers.county = '';
        zipStatus.className = 'hh-zip-status';
        zipNote.style.display = 'none';
      }
      updateContinueButton(6);
    });

    // ============================================================
    // CONTACT FIELDS
    // ============================================================
    $('#hh-firstname').addEventListener('input', (e) => { answers.firstName = e.target.value; updateContinueButton(8); });
    $('#hh-lastname').addEventListener('input', (e) => { answers.lastName = e.target.value; updateContinueButton(8); });
    $('#hh-email').addEventListener('input', (e) => { answers.email = e.target.value; updateContinueButton(8); });
    $('#hh-phone').addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (v.length >= 7) v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
      else if (v.length >= 4) v = `(${v.slice(0,3)}) ${v.slice(3)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
      answers.phone = v;
      updateContinueButton(8);
    });

    // ============================================================
    // TIER LOGIC (rounds up to highest selected category)
    // ============================================================
    function calculateTier() {
      if (answers['needs-advanced'].length > 0) return 'advanced';
      if (answers['needs-handson'].length > 0) return 'personal';
      if (answers['needs-everyday'].length > 0) return 'essential';
      return 'essential';
    }

    function renderRecommendation() {
      const tierKey = calculateTier();
      answers.tier = tierKey;
      const tier = TIERS[tierKey];
      const card = $('#hh-rec-card');
      card.className = `hh-rec-card ${tier.color}`;
      const featuresHTML = tier.features.map(f => `<li>${f}</li>`).join('');
      card.innerHTML = `
        <div class="hh-rec-tier-label">
          <span class="hh-tier-dot ${tier.color}"></span>
          Your Recommended Tier
        </div>
        <div class="hh-rec-tier-name">${tier.name}</div>
        <div class="hh-rec-tier-desc">${tier.description}</div>
        <ul class="hh-rec-features">${featuresHTML}</ul>
      `;
    }

    // ============================================================
    // FORM SUBMISSION (Web3Forms)
    // ============================================================
    async function submitForm() {
      const submitBtn = $('[data-action="submit"]');
      const loadingEl = $('#hh-loading');
      const errorEl = $('#hh-submit-error');

      submitBtn.style.display = 'none';
      errorEl.classList.remove('show');
      loadingEl.classList.add('show');

      const allNeeds = [
        ...answers['needs-everyday'],
        ...answers['needs-handson'],
        ...answers['needs-advanced']
      ];

      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `New Care Plan Inquiry — ${answers.firstName} ${answers.lastName}`,
        from_name: "Helping Hands Decision Tree",
        "Recommended Tier": TIERS[answers.tier].name,
        "First Name": answers.firstName,
        "Last Name": answers.lastName,
        "Email": answers.email,
        "Phone": answers.phone,
        "ZIP Code": answers.zip,
        "Service Area": answers.county,
        "Care Recipient": answers.recipient,
        "Urgency": answers.urgency,
        "Frequency": answers.frequency,
        "Time of Day": answers.timeofday.join(', '),
        "Care Needs": allNeeds.join(', ')
      };

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        loadingEl.classList.remove('show');
        if (data.success) {
          $('#hh-final-name').textContent = answers.firstName;
          showStep(9);
        } else {
          submitBtn.style.display = 'inline-flex';
          errorEl.classList.add('show');
          console.error('Web3Forms error:', data);
        }
      } catch (err) {
        loadingEl.classList.remove('show');
        submitBtn.style.display = 'inline-flex';
        errorEl.classList.add('show');
        console.error('Submit error:', err);
      }
    }

    // ============================================================
    // BUTTON CLICKS
    // ============================================================
    root.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      if (action === 'next') {
        if (!isStepValid(currentStep)) return;
        if (currentStep === 6) renderRecommendation();
        if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
      } else if (action === 'back') {
        if (currentStep > 1) showStep(currentStep - 1);
      } else if (action === 'submit') {
        if (isStepValid(8)) submitForm();
      }
    });

    // Init
    renderProgress();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
