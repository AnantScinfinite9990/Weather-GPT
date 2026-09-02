const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.tsx', 'utf8');

const useE = "const [isGeneratingAI, setIsGeneratingAI] = useState(false);";
const injectCode = `const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (currentUser && token) {
        try {
          const res = await fetch(\`\${import.meta.env.VITE_API_URL || ''}/api/chat/history\`, {
            headers: { 'Authorization': \`Bearer \${token}\` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages);
            }
          }
        } catch (e) {}
      }
    };
    fetchHistory();
  }, [currentUser]);

  const saveHistory = async (newMessages: ChatMessage[]) => {
    const token = localStorage.getItem('token');
    if (currentUser && token) {
      try {
        await fetch(\`\${import.meta.env.VITE_API_URL || ''}/api/chat/history\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${token}\`
          },
          body: JSON.stringify({ messages: newMessages })
        });
      } catch (e) {}
    }
  };`;
code = code.replace(useE, injectCode);

const handleSendMessageOriginal = `setMessages(prev => [...prev, userMsg]);
    setIsGeneratingAI(true);
    setTranscript('');

    try {`;

const handleSendMessagePatch = `const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveHistory(newMessages);
    setIsGeneratingAI(true);
    setTranscript('');

    try {`;
code = code.replace(handleSendMessageOriginal, handleSendMessagePatch);

const aiMsgPushOriginal = `setMessages(prev => [...prev, aiMsg]);
      } else {`;
const aiMsgPushPatch = `const updatedMessages = [...newMessages, aiMsg];
        setMessages(updatedMessages);
        saveHistory(updatedMessages);
      } else {`;
code = code.replace(aiMsgPushOriginal, aiMsgPushPatch);

fs.writeFileSync('frontend/src/App.tsx', code);
