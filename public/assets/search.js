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

function fillCategoryOptions(categories) {
  var sel = document.getElementById('categorySelect');
  categories.forEach(category => {
    var opt = document.createElement('option');
    opt.value = category.category;
    opt.textContent = category.category;
    sel.appendChild(opt);
  });
}

function fillNgoOptions(ngos) {
  var sel = document.getElementById('ngoSelect');
  ngos.forEach(ngo => {
    var opt = document.createElement('option');
    opt.value = ngo.ngo_id;
    opt.textContent = ngo.ngo_name;
    sel.appendChild(opt);
  });
}

function render(list) {
  var grid = document.getElementById('resultsGrid');

  if(!list.length){
    grid.innerHTML = '<div class="empty">No results.</div>';
    return;
  }

  grid.innerHTML = list.map(card).join('');
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

function doSearch(){
  var dtVal = document.getElementById('dateTime').value; // "YYYY-MM-DDTHH:mm"
  var date = dtVal ? new Date(dtVal) : null;
  var location = document.getElementById('location').value;
  var ngo = document.getElementById('ngoSelect').value;
  var category = document.getElementById('categorySelect').value;


  fetch('/api/events/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      date,
      location,
      ngo,
      category
    })
  })
    .then(res => res.json())
    .then(data => {
      render(data);
      var rc = document.getElementById('resultCount');
      rc.textContent = data.length + ' Results';
    }).catch(err => {
      console.log(err)
      document.getElementById('resultsGrid').innerHTML = '<div class="empty">'+ 'Failed to search events' +'</div>';
    });
}

// get all ngos
fetch('/api/ngos')
  .then(res => res.json())
  .then(data => {
    fillNgoOptions(data)
  })
  .catch(err => {
    console.log(err)
    document.getElementById('resultsGrid').innerHTML = '<div class="empty">'+ 'Failed to load ngos' +'</div>';
  });


// get all events categories
fetch('/api/events/categories')
  .then(res => res.json())
  .then(data => {
    fillCategoryOptions(data)
  })
  .catch(err => {
    console.log(err)
    document.getElementById('resultsGrid').innerHTML = '<div class="empty">'+ 'Failed to load categoryes' +'</div>';
  });


// form handlers
var form = document.getElementById('searchForm');
form.addEventListener('submit', ev => {
  ev.preventDefault();
  doSearch();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('dateTime').value = '';
  document.getElementById('location').value = '';
  document.getElementById('ngoSelect').value = 'all';
  document.getElementById('categorySelect').value = 'all';
  render([]);
  document.getElementById('resultCount').textContent = '';
});
