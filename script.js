// Script to handle sending messages
document.addEventListener('DOMContentLoaded', () => {
    const chatWrapper = document.getElementById('chat-wrapper');
    const chat = document.getElementById('chat');
    const chatInput = document.getElementById('chat-input');

    // Toggle chat visibility (optional)
    chatWrapper.style.display = 'block';

    // Handle input submission
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && chatInput.value.trim() !== '') {
            const message = chatInput.value;
            chatInput.value = '';

            // Create a message element
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messageElement.style.marginBottom = '10px';
            messageElement.style.wordWrap = 'break-word';

            // Append message
            chat.appendChild(messageElement);

            // Scroll to the bottom
            chat.scrollTop = chat.scrollHeight;
        }
    });
});
