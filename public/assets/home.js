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

function card(e){
  // get event fields
  var start = new Date(e.start_date).toLocaleString();
  var end = new Date(e.end_date).toLocaleString();
  var goal = e.goal_amount;
  var prog = e.progress_amount;
  var img = e.image_url;
  var href = 'event.html?id=' + e.event_id;

  // calculate progress
  var progress = clamp(Math.round((prog/goal)*100), 0, 100);

  // return card html string
  return (
    '<article class="card">'+
    '<div style="position:relative">'+
    '<img alt="'+ e.name +'" src="'+ img +'" />'+
    '<span class="badge">'+ e.category +'</span>'+
    '</div>'+
    '<div class="card-body">'+
    '<div class="card-title">'+ e.name +'</div>'+
    '<div class="card-meta">'+ e.ngo_name +'</div>'+
    '<div class="card-meta">'+ start +' – '+ end +' · '+ e.location +'</div>'+
    '<div class="progress"><span style="width:'+ progress +'%"></span></div>'+
    '</div>'+
    '<div class="card-footer">'+
    '<span class="price">'+ formatMoney(e.ticket_price, e.currency) +'</span>'+
    '<a class="link" href="'+ href +'">Details</a>'+
    '</div>'+
    '</article>'
  );
}


function renderStats(events){
  var el = document.getElementById('summaryStats');

  if(!events.length){
    el.innerHTML = '<span class="pill">No events yet</span>';
    return;
  }

  // calculate active count, raised amount, goal amount and current progress
  var active = events.filter(e => e.status==='active').length;
  var raised = events.reduce((total,item) => total + Number(item.progress_amount||0), 0);
  var goal = events.reduce((total,item) => total +Number(item.goal_amount||0), 0);
  var progress = Math.round((raised/goal)*100);

  // set summary stats html
  el.innerHTML = '<span class="pill">'+active+' active</span>'+
    '<span class="pill">Raised: '+formatMoney(raised)+'</span>'+
    '<span class="pill">'+progress+'% of goals</span>';
}

// get events
fetch('/api/events')
  .then(res=> res.json())
  .then(data => {
    // get upcoming events and past events
    var up = data.upcoming || [];
    var past = data.past || [];

    // get document
    var ug = document.getElementById('upcomingGrid');
    var pg = document.getElementById('pastGrid');

    // display upcoming
    if (up.length > 0) {
      ug.innerHTML = up.map(card).join('');
    } else {
      ug.innerHTML = '<div class="empty">No upcoming events.</div>';
    }

    // display past
    if (past.length > 0) {
      pg.innerHTML = past.map(card).join('');
    } else {
      pg.innerHTML = '<div class="empty">No past events.</div>';
    }

    // display summary stats
    renderStats(up.concat(past));
  })
  .catch(err => {
    document.getElementById('upcomingGrid').innerHTML = '<div class="empty">'+ err.message +'</div>';
  });


