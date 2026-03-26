document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHistory = document.getElementById('chatHistory');

    let isTyping = false;

    // Send Message Function
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text || isTyping) return;

        // 1. Add User Message to UI
        addMessage(text, 'user');
        chatInput.value = '';
        isTyping = true;

        // 2. Add Thinking Indicator
        const thinkingId = addThinkingIndicator();

        try {
            // 3. Call API (Assumes Next.js API is still running at /api/chat)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: text, 
                    history: [], // For simplification, we start with empty history
                    style: 'professional' 
                })
            });

            const data = await response.json();
            
            // 4. Remove Thinking & Add Bot Response
            removeElement(thinkingId);
            if (data.response) {
                addMessage(data.response, 'bot');
            } else {
                addMessage('عذراً، حدث خطأ في النظام. حاول مجدداً.', 'bot');
            }

        } catch (error) {
            console.error('Error:', error);
            removeElement(thinkingId);
            addMessage('لا يمكن الاتصال بالذكاء الاصطناعي حالياً. تأكد من تشغيل السيرفر المحلي.', 'bot');
        } finally {
            isTyping = false;
        }
    }

    // Helper: Add Message to UI
    function addMessage(content, role) {
        const div = document.createElement('div');
        div.className = `flex flex-col ${role === 'user' ? 'items-end' : 'items-start'} gap-2 w-full message-animate`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="flex items-center gap-2 mb-1 ${role === 'user' ? 'flex-row-reverse' : ''}">
                <div class="w-8 h-8 rounded-full ${role === 'user' ? 'bg-blue-600' : 'bg-accent/20 text-accent font-bold'} flex items-center justify-center">
                    ${role === 'user' ? '<i data-lucide="user" class="w-4 h-4"></i>' : 'LM'}
                </div>
                <span class="text-[10px] font-black text-muted uppercase tracking-tighter">${role === 'user' ? 'أنت' : 'المساعد'}</span>
            </div>
            <div class="chat-bubble ${role === 'user' ? 'chat-bubble-user shadow-blue-500/20 shadow-lg' : 'chat-bubble-bot shadow-lg shadow-black/20'}">
                <div class="whitespace-pre-wrap text-sm md:text-base">${content}</div>
                <div class="text-[9px] mt-2 opacity-60 text-left">${timestamp}</div>
            </div>
        `;
        
        chatHistory.appendChild(div);
        lucide.createIcons(); // Refresh icons
        scrollToBottom();
    }

    // Helper: Add Thinking Indicator
    function addThinkingIndicator() {
        const id = 'thinking-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'flex items-center gap-3 p-4 bg-zinc-800/50 rounded-2xl w-max animate-pulse message-animate';
        div.innerHTML = `
            <div class="flex gap-1">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-bounce delay-100"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-bounce delay-200"></div>
            </div>
            <span class="text-xs font-semibold text-muted">المساعد يفكر...</span>
        `;
        chatHistory.appendChild(div);
        scrollToBottom();
        return id;
    }

    function removeElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
