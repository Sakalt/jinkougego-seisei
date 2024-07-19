document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const mediaWikiOutput = document.getElementById('mediaWikiOutput');
  const modeSelect = document.getElementById('modeSelect');

  let wordList = [];

  function fetchWordList(mode) {
    if (mode === 'japanese') {
      wordList = japaneseWords;
    } else if (mode === 'tokiPona') {
      wordList = tokiPonaWords;
    }
  }

  function generateArtificialWord(minLength, maxLength, syllableStructure, consonants, vowels) {
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let word = '';
    
    const structure = syllableStructure.split(',');
    
    for (let i = 0; i < length; i++) {
      const pattern = structure[i % structure.length];
      
      pattern.split('').forEach(char => {
        if (char === 'C') {
          word += consonants[Math.floor(Math.random() * consonants.length)];
        } else if (char === 'V') {
          word += vowels[Math.floor(Math.random() * vowels.length)];
        }
      });
    }
    return word;
  }

  function generateWords() {
    const mode = modeSelect.value;
    fetchWordList(mode);

    const minLength = parseInt(document.getElementById('minLength').value, 10);
    const maxLength = parseInt(document.getElementById('maxLength').value, 10);
    const syllableStructure = document.getElementById('syllableStructure').value;
    const consonants = document.getElementById('consonants').value.split(',').map(c => c.trim());
    const vowels = document.getElementById('vowels').value.split(',').map(v => v.trim());
    const wordCount = parseInt(document.getElementById('wordCount').value, 10);

    const words = [];
    for (let i = 0; i < wordCount; i++) {
      const word = generateArtificialWord(minLength, maxLength, syllableStructure, consonants, vowels);
      words.push({
        entry: { id: i + 1, form: word },
        translations: [{ title: '意味', forms: [`意味${i + 1}`] }],
        tags: ['生成語'],
        contents: [{ title: '例文', text: `この単語「${word}」の例文です。` }],
        variations: [],
        relations: []
      });
    }

    const json = {
      words: words,
      version: 2,
      settings: {
        zpdic: {
          pronounciationTitle: "発音",
        },
        zpdicOnline: {
          enableMarkdown: true
        }
      }
    };

    const jsonBlob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    downloadBtn.href = url;
    downloadBtn.download = 'words.json';

    const tableData = words.map(word => `| ${word.entry.form} || ${word.translations[0].forms[0]} || ${word.contents[0].text}\n`).join('');
    mediaWikiOutput.textContent = `{| class="wikitable"\n|-\n! 単語 !! 意味 !! 例文\n|-\n${tableData}|}`;
  }

  generateBtn.addEventListener('click', generateWords);
});
