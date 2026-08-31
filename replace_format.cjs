const fs = require('fs');

function addFormatter(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const formatter = `
const formatMessage = (text: string) => {
  const parts = text.split(/(\\**.*?\\**)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};
`;

  if (!content.includes('formatMessage')) {
    // Add formatMessage outside the component or inside. Let's add it before export const.
    content = content.replace('export const ', formatter + '\nexport const ');
  }

  // For ChatBubble.tsx
  content = content.replace(
    '<div className="whitespace-pre-line">{msg.content}</div>',
    '<div className="whitespace-pre-line">{formatMessage(msg.content)}</div>'
  );

  // For WeatherChatWorkbench.tsx
  content = content.replace(
    '{msg.content}',
    '{formatMessage(msg.content)}'
  );

  fs.writeFileSync(filePath, content);
}

addFormatter('src/components/ChatBubble.tsx');
addFormatter('src/components/WeatherChatWorkbench.tsx');
