// Game client controller
document.addEventListener('DOMContentLoaded', () => {
  let stages = [];
  let currentStageIndex = 0;
  let attempts = 0;
  const completedStages = new Set();

  const stageBadge = document.getElementById('stage-badge');
  const stageTitle = document.getElementById('stage-title');
  const stageDesc = document.getElementById('stage-description');
  const stageFeedback = document.getElementById('stage-feedback');
  const stageSelect = document.getElementById('stage-select');
  const attemptsCount = document.getElementById('attempts-count');

  const httpMethod = document.getElementById('http-method');
  const requestPath = document.getElementById('request-path');
  const requestBody = document.getElementById('request-body');
  const bodyContainer = document.getElementById('body-container');
  const requestForm = document.getElementById('request-form');
  const sendBtn = document.getElementById('send-btn');

  const statusBadge = document.getElementById('status-badge');
  const responseOutput = document.getElementById('response-output');

  // Toggle JSON body editor based on HTTP method
  httpMethod.addEventListener('change', () => {
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(httpMethod.value);
    bodyContainer.style.display = hasBody ? 'block' : 'none';
  });

  // Fetch stage scenarios from server
  async function loadStages() {
    try {
      const res = await fetch('/api/game/stages');
      stages = await res.json();
      populateStageSelect();
      renderStage(0);
    } catch (err) {
      stageTitle.textContent = 'Error loading game stages';
    }
  }

  function populateStageSelect() {
    stageSelect.innerHTML = '';
    stages.forEach((s, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `Stage ${s.id}: ${s.title}`;
      stageSelect.appendChild(opt);
    });
  }

  stageSelect.addEventListener('change', (e) => {
    renderStage(parseInt(e.target.value, 10));
  });

  function renderStage(idx) {
    currentStageIndex = idx;
    stageSelect.value = idx;
    const stage = stages[idx];

    stageBadge.textContent = `Stage ${stage.id} of ${stages.length}`;
    stageTitle.textContent = stage.title;
    stageDesc.textContent = stage.description;
    stageFeedback.style.display = 'none';

    // Reset default form inputs
    httpMethod.value = 'GET';
    requestPath.value = '/api/products';
    requestBody.value = '';
    bodyContainer.style.display = 'none';
  }

  // Handle request submission
  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempts++;
    attemptsCount.textContent = attempts;

    const method = httpMethod.value;
    const path = requestPath.value.trim();
    const currentStage = stages[currentStageIndex];

    const options = {
      method,
      headers: {
        'X-Stage-Id': currentStage.id
      }
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.value.trim()) {
      try {
        JSON.parse(requestBody.value); // Validate JSON format
        options.headers['Content-Type'] = 'application/json';
        options.body = requestBody.value.trim();
      } catch (err) {
        alert('Invalid JSON format in Request Body.');
        return;
      }
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    try {
      const res = await fetch(path, options);
      const passed = res.headers.get('X-Stage-Passed') === 'true';
      const feedback = res.headers.get('X-Stage-Feedback');

      let responseData;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      // Display Status Code Badge
      statusBadge.style.display = 'inline-block';
      statusBadge.textContent = `${res.status} ${res.statusText || ''}`;
      statusBadge.className = `badge ${res.status < 400 ? 'badge-2xx' : 'badge-4xx'}`;

      // Pretty-print JSON
      responseOutput.textContent = typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData;

      // Handle Validation Feedback
      stageFeedback.style.display = 'block';
      if (passed) {
        stageFeedback.style.background = '#064e3b';
        stageFeedback.style.color = '#6ee7b7';
        stageFeedback.innerHTML = `✓ ${feedback || 'Passed!'} <button id="next-stage-btn" class="btn btn-primary" style="margin-left: 1rem; padding: 0.3rem 0.8rem;">Next Stage →</button>`;
        completedStages.add(currentStage.id);

        document.getElementById('next-stage-btn').addEventListener('click', () => {
          if (currentStageIndex + 1 < stages.length) {
            renderStage(currentStageIndex + 1);
          } else {
            alert('🎉 Congratulations! You completed all available stages!');
          }
        });
      } else {
        stageFeedback.style.background = '#7f1d1d';
        stageFeedback.style.color = '#fca5a5';
        stageFeedback.textContent = `✗ ${feedback || 'Request did not match stage requirements. Adjust method, path, or body and try again.'}`;
      }
    } catch (err) {
      statusBadge.style.display = 'inline-block';
      statusBadge.textContent = 'Network Error';
      statusBadge.className = 'badge badge-4xx';
      responseOutput.textContent = `Failed to fetch: ${err.message}`;
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Request';
    }
  });

  loadStages();
});
