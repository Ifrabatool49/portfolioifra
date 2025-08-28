/* App JS — Ifra Batool Portfolio
   - Smooth nav
   - Back to top
   - Load Projects & Testimonials from JSON via AJAX (fetch + jQuery)
   - Contact form (AJAX demo)
*/

(function(){
  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Smoothly highlight active nav (Bootstrap scrollspy already set)
  const navLinks = document.querySelectorAll('#mainNav .nav-link, a[href^="#"]');
  navLinks.forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Back to top
  const back = document.getElementById('backTop');
  window.addEventListener('scroll', ()=> back.style.display = window.scrollY>400 ? 'inline-flex':'none');
  back.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  // ====== PROJECTS via AJAX (fetch) ======
  const grid = document.getElementById('projectGrid');
  const filters = document.getElementById('projectFilters');
  let PROJECTS = [];

  async function loadProjects(filter='all'){
    try{
      const res = await fetch('data/projects.json', {cache:'no-store'});
      if(!res.ok) throw new Error('HTTP '+res.status);
      PROJECTS = await res.json();
    }catch(err){
      // Fallback minimal data
      PROJECTS = [
        {"title":"Restaurant UI","type":"frontend","tech":["HTML","CSS","Bootstrap","JS"],"img":"https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop","link":"#","desc":"Responsive restaurant landing page."},
        {"title":"Task API","type":"fullstack","tech":["Node","Express","MongoDB"],"img":"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop","link":"#","desc":"REST API with JWT auth."},
        {"title":"SaaS Dashboard","type":"uiux","tech":["Figma","Design System"],"img":"https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop","link":"#","desc":"Clean analytics UI/UX."}
      ];
      console.warn('Projects fallback used:', err.message);
    }
    renderProjects(filter);
  }

  function renderProjects(filter='all'){
    const items = filter==='all' ? PROJECTS : PROJECTS.filter(p=>p.type===filter);
    grid.innerHTML = items.map(p=>`
      <div class="col-sm-6 col-lg-4">
        <div class="card project h-100">
          <img src="${p.img}" alt="${p.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="text-secondary small mb-2">${p.desc}</p>
            <div class="small text-muted mb-3"><i class="bi bi-tools"></i> ${p.tech.join(' • ')}</div>
            <div class="mt-auto">
              <a href="${p.link}" class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener">Preview</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  filters.addEventListener('click', (e)=>{
    if(e.target.matches('button[data-filter]')){
      document.querySelectorAll('#projectFilters .btn').forEach(b=>b.classList.remove('active'));
      e.target.classList.add('active');
      loadProjects(e.target.dataset.filter);
    }
  });

  loadProjects();

  // ====== TESTIMONIALS via jQuery AJAX ======
  // Example using $.getJSON to satisfy the jQuery+AJAX requirement.
  $.getJSON('data/testimonials.json')
    .done(function(items){
      const grid = $('#testiGrid');
      grid.html(items.map(t => `
        <div class="col-md-6 col-lg-4">
          <div class="card testimonial h-100">
            <div class="card-body">
              <div class="d-flex gap-3 align-items-center mb-2">
                <img src="${t.avatar}" alt="${t.name}" class="rounded-circle" width="46" height="46">
                <div>
                  <strong>${t.name}</strong><div class="small text-muted">${t.role}</div>
                </div>
              </div>
              <p class="mb-0 text-secondary">“${t.quote}”</p>
            </div>
          </div>
        </div>
      `).join(''));
    })
    .fail(function(){ console.warn('Testimonials failed to load.'); });

  // ====== CONTACT FORM (AJAX demo) ======
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.textContent = 'Sending...';

    // Basic client validation
    const data = Object.fromEntries(new FormData(form).entries());
    if(!data.name || !data.email || !data.message){
      msg.textContent = 'Please fill all fields.';
      return;
    }

    try{
      // Demo endpoint — replace with your backend later
      const res = await fetch('https://httpbin.org/post', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          to: 'ifrabatool.djskill@gmail.com',
          from: data.email,
          subject: Portfolio contact from ${data.name},
          message: data.message
        })
      });
      if(!res.ok) throw new Error('Network');
      msg.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    }catch(err){
      msg.textContent = 'Oops! Please try again later.';
    }
  });
})();