console.log('Loaded API key:', config.DEEPGRAM_API_KEY);

/**
 * Main function that integrates tokenizer, parser, and generator
 * for the Shape Drawing DSL
 */
function processCommand(input) {
    try {
      // Step 1: Tokenize the input
      const tokens = tokenize(input);
      
      // Step 2: Parse the tokens
      const parser = new Parser(tokens);
      const parsedData = parser.parse();
      
      // Step 3: Generate SVG from parsed data
      const svgOutput = generateSVG(parsedData);
      
      return {
        tokens,
        parsedData,
        svgOutput
      };
    } catch (error) {
      return {
        error: error.message
      };
    }
  }

/**
 * Voice-to-text functionality
 */
let mediaRecorder;
let audioChunks = [];
const DEEPGRAM_API_KEY = config.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error('Deepgram API key not found. Please set DEEPGRAM_API_KEY in config.js');
}

/**
 * Sends audio to Deepgram for transcription
 * @param {Blob} audioBlob - The recorded audio
 * @returns {Promise<string>} The transcribed text
 */
async function transcribeWithDeepgram(audioBlob) {
  if (!DEEPGRAM_API_KEY) {
    throw new Error('Deepgram API key not configured');
  }

  try {
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/webm'
      },
      body: audioBlob
    });

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    throw error;
  }
}

/**
 * Initializes the microphone button and voice-to-text functionality
 */
function initVoiceToText() {
  const micButton = document.getElementById('micButton');
  const micStatus = document.getElementById('micStatus');
  const commandInput = document.getElementById('commandInput');

  micButton.addEventListener('click', async () => {
    try {
      if (!mediaRecorder) {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        // Handle recording data
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        // Handle recording stop
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          audioChunks = [];
          
          try {
            micStatus.textContent = 'Transcribing...';
            const transcript = await transcribeWithDeepgram(audioBlob);
            commandInput.value = transcript;
            micStatus.textContent = 'Transcription complete!';
          } catch (error) {
            micStatus.textContent = 'Transcription failed: ' + error.message;
          }
        };

        micStatus.textContent = 'Recording...';
        mediaRecorder.start();
        micButton.textContent = '⏹️';
      } else {
        // Stop recording
        mediaRecorder.stop();
        mediaRecorder = null;
        micButton.textContent = '🎤';
      }
    } catch (error) {
      micStatus.textContent = 'Error: ' + error.message;
    }
  });
}

// Initialize voice-to-text when the page loads
document.addEventListener('DOMContentLoaded', initVoiceToText);