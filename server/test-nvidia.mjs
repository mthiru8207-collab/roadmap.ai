const key = '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';

async function test() {
  console.log('Sending test request to NVIDIA NIM...');
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.2-90b-vision-instruct',
        messages: [{ role: 'user', content: 'Say hello to RoadmapAI learner in 5 words.' }],
        max_tokens: 30,
        temperature: 0.2
      })
    });

    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('Response content:', data.choices?.[0]?.message?.content || JSON.stringify(data));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

test();

