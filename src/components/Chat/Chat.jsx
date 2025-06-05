import { useState } from 'react';
import { askAgent } from '../../agent';
import styles from './Chat.module.scss';

export default function Chat({ onAdd }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { from: 'user', text: input };
    const thinkingMessage = { from: 'bot', text: '...' };
    setMessages((prev) => [...prev, newMessage, thinkingMessage]);

    askAgent(input).then((responseText) => {
      let tasks = [];

      if (typeof responseText === 'string') {
        tasks = responseText
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line);
      } else if (Array.isArray(responseText)) {
        tasks = responseText.map((line) => line.trim()).filter((line) => line);
      } else {
        console.error('Response from agent is not a valid string or array:', responseText);
        setMessages((prev) => {
          const updated = [...prev];
          updated.pop(); // remove '...'
          return [...updated, { from: 'bot', text: '[Błąd AI: Niepoprawny format odpowiedzi]' }];
        });
        return;
      }

      if (tasks.length === 0) {
        setMessages((prev) => {
          const updated = [...prev];
          updated.pop();
          return [...updated];
        });
        return;
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // remove '...'
        return [
          ...updated,
          {
            from: 'bot',
            text: tasks
              .map((t, i) => `${i + 1}. ${typeof t === 'string' ? t.replace(/^- /, '') : String(t)}`)
              .join('\n'),
          },
        ];
      });

      tasks.forEach((task) => {
        if (typeof task === 'string') {
          onAdd(task.replace(/^- /, ''));
        } else {
          // In your second approach, we ignore non-string data from the chatbot
          // You can optionally add a console.error here
          console.error('Received non-string task. Ignoring:', task);
        }
      });
    });
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.from === 'user' ? styles.userBubble : styles.botBubble}
          >
            {msg.text === '...' ? (
              <span className={styles.loadingDots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </span>
            ) : msg.text}
          </div>
        ))}
      </div>
      <div className={styles.chatInputBar}>
        <input
          type="text"
          placeholder="Napisz wiadomość..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Wyślij</button>
      </div>
    </div>
  );
}