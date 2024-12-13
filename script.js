document.addEventListener('DOMContentLoaded', () => {
    const chat = document.getElementById('chat');
    const chatInput = document.getElementById('chat-input');
    const resizeHandle = document.getElementById('resize-handle');
    const chatWrapper = document.getElementById('chat-wrapper');

    let isResizing = false;
    let loggedInAs = null;

    // Add a message to the chat with proper styling
    const addMessage = (message, className = '') => {
        const messageElement = document.createElement('div');

        // Split the message into username and text
        const [username, text] = message.split(": ");

        // Check if the message is from the logged-in moderator
        const isModeratorMessage = loggedInAs && username === loggedInAs;

        // Create username element
        const usernameElement = document.createElement('span');
        if (isModeratorMessage) {
            usernameElement.textContent = `${username}: `;
            usernameElement.style.fontWeight = 'bold';
            usernameElement.style.color = '#ff0000'; // Red for logged-in moderators
        } else {
            usernameElement.textContent = `${username}: `;
            if (username === 'SERVER') {
                usernameElement.style.fontWeight = 'bold';
                usernameElement.style.color = 'white';
            } else {
                usernameElement.classList.add('user');
            }
        }

        // Create message text element
        const messageElementText = document.createElement('span');
        if (isModeratorMessage) {
            messageElementText.textContent = text;
            messageElementText.style.fontWeight = 'bold';
            messageElementText.style.color = 'rgb(86, 14, 14)'; // Dark red for logged-in moderator messages
        } else {
            messageElementText.textContent = text;
            if (username === 'SERVER') {
                messageElementText.classList.add('server');
            } else {
                messageElementText.classList.add('message');
            }
        }

        // Append the username and message to the chat
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(messageElementText);

        // Apply additional class if provided
        if (className) {
            messageElement.classList.add(className);
        }

        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
    };

    // Simulate an initial conversation
    const simulateConversation = () => {
        const messages = [
            "user1: user2 is a stupid potato!",
            "user2: Hi user1! why so mad?",
            "user1: don't talk to me idiot!",
            "user2: oof."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < messages.length) {
                addMessage(messages[i]);
                i++;
            } else {
                clearInterval(interval); // End the simulation when all messages are sent
            }
        }, 5000);
    };

    // Show a server message in the chat
    const showServerMessage = (message) => {
        const serverMessage = "SERVER: ";
        const messageElement = document.createElement('div');

        const serverElement = document.createElement('span');
        serverElement.textContent = serverMessage;
        serverElement.style.fontWeight = 'bold';

        const announcementElement = document.createElement('span');
        announcementElement.textContent = message;
        announcementElement.classList.add('moderator'); // Red, bold for announcements

        messageElement.appendChild(serverElement);
        messageElement.appendChild(announcementElement);

        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight; // Keep chat scrolled to bottom
    };

    // Handle user input from chat
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const userMessage = chatInput.value.trim();

            // Handle login command
            if (userMessage.startsWith('/login')) {
                const loginName = userMessage.split(' ')[1];

                if (loginName === 'SkyView' || loginName === 'JoseFredo') { // replace with your accounts that are moderator.
                    loggedInAs = loginName; // Set the logged-in username
                    addMessage(`SERVER: Welcome ${loginName}, your commands are /mod_ban`, 'server');
                } else {
                    addMessage('SERVER: invalid account credentials.', 'server'); // @Client-side for invalid logging information.
                }

                chatInput.value = '';
            }
            // Handle mod ban command
            else if (userMessage === '/mod_ban user1 10 toxicity') { // @Client-side message to not reveal moderator commands. || user1 can be replaced with actual server id or uuid, 10 is ban time in minutes, toxicity is just the reason.
                if (loggedInAs) {
                    const banMessage = `${loggedInAs} banned user1 for 10 minutes for [toxicity]`; //@Server-side announcement to inform other's to not repeat what is specified inside reason tab.
                    showServerMessage(banMessage);
                } else {
                    showServerMessage("No access."); // @Client-side No access for attempting to use Mod commands as guest.
                }
                chatInput.value = '';
            }
            // Handle other messages
            else {
                if (loggedInAs) {
                    addMessage(`${loggedInAs}: ${userMessage}`); // Message from logged-in moderator
                } else {
                    if (userMessage.startsWith("user1") || userMessage.startsWith("user2")) {
                        addMessage(`${userMessage}`);
                    } else {
                        addMessage(`user3: ${userMessage}`); // user3 will always be us not logged in. this works as example for guest accounts.
                    }
                }
                chatInput.value = '';
            }
        }
    });

    // Start the simulated conversation on page load
    simulateConversation();

    // Resize chat window
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;

        const startWidth = chatWrapper.offsetWidth;
        const startHeight = chatWrapper.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        const onMouseMove = (moveEvent) => {
            if (!isResizing) return;

            const newWidth = startWidth + (moveEvent.clientX - startX);
            const newHeight = startHeight + (startY - moveEvent.clientY);

            if (newWidth >= 150 && newWidth <= window.innerWidth * 0.5) {
                chatWrapper.style.width = `${newWidth}px`;
            }
            if (newHeight >= 100 && newHeight <= window.innerHeight * 0.85) {
                chatWrapper.style.height = `${newHeight}px`;
            }
        };

        const onMouseUp = () => {
            isResizing = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });
});
