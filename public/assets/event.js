// format money
function formatMoney(n, c){
  var currency = c || 'AUD';
  var num = Number(n||0);
  return currency + ' ' + num.toFixed(2);
}

// limit progress min ~ max
function clamp(val, min, max){
  return Math.max(min, Math.min(max, val));
}

// get event id from query
function getEventId(){
  var params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// set text helper
function setText(id, text){
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

// show error box
function showError(msg){
  var box = document.getElementById('errorBox');
  if (box){
    box.textContent = msg;
    box.style.display = 'block';
  }
}

// call first
var id = getEventId();
if (!id){
  showError('Missing event id');
} else {
  fetch('/api/events/' + id)
    .then(res => res.json())
    .then(e => {
      // display title and NGO
      setText('eventTitle', e.name || 'Event');
      setText('eventNGO', e.ngo_name);

      // display image and category
      var img = e.image_url;
      var imgEl = document.getElementById('eventImage');
      if (imgEl){
        imgEl.src = img;
        imgEl.alt = e.name ;
      }
      setText('eventCategory', e.category);

      // display meta
      var start = new Date(e.start_date).toLocaleString();
      var end = new Date(e.end_date).toLocaleString();
      setText('eventDates', start + ' – ' + end);
      setText('eventLocation', e.location);
      setText('eventStatus', e.status);
      setText('eventPrice', formatMoney(e.ticket_price, e.currency || 'AUD'));

      // display goal/progress
      var goal = Number(e.goal_amount || 0);
      var prog = Number(e.progress_amount || 0);
      var progress = clamp(Math.round((prog/goal)*100), 0, 100);
      var bar = document.getElementById('goalBar');
      if (bar) {
        bar.style.width = progress + '%'
      }
      setText('eventGoalText', formatMoney(prog, e.currency || 'AUD') + ' raised of ' + formatMoney(goal, e.currency || 'AUD') + ' (' + progress + '%)');

      // text blocks
      setText('eventPurpose', e.purpose || '');
      setText('eventDescription', e.full_description || '');

      // stats (safe defaults if missing)
      var st = e.stats || {};
      setText('statTotal', Number(st.total || st.total_regs || 0));
      setText('statPaid', Number(st.paid || st.paid_regs || 0));
      setText('statPending', Number(st.pending || st.pending_regs || 0));
      setText('statFree', Number(st.free || st.free_regs || 0));
      setText('statRevenue', formatMoney(st.revenue_estimate || 0, e.currency || 'AUD'));

      // register
      var btn = document.getElementById('registerBtn');
      if (btn){
        btn.addEventListener('click', () => {
          alert('This feature is currently under construction.');
        });
      }
    })
    .catch(err => {
      showError('Failed to load event');
      console.log(err);
    });
}
