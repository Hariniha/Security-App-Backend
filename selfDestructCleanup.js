    // Periodically delete expired chat messages (self-destruct)

const ChatMessage = require('./models/ChatMessage');
let ioInstance = null;

// Allow server.js to inject the socket.io instance
function setIO(io) {
  ioInstance = io;
}


function startSelfDestructCleanup() {
  setInterval(async () => {
    try {
      const now = new Date();
      // Find expired messages first so we can emit their IDs
      const expiredMessages = await ChatMessage.find({ selfDestructAt: { $lte: now } }, '_id');
      if (expiredMessages.length > 0) {
        const ids = expiredMessages.map(m => m._id.toString());
        await ChatMessage.deleteMany({ _id: { $in: ids } });
        console.log(`[SelfDestruct] Deleted ${ids.length} expired messages at ${now.toISOString()}`);
        if (ioInstance) {
          ioInstance.emit('messages_deleted', { ids });
        }
      }
    } catch (err) {
      console.error('[SelfDestruct] Error deleting expired messages:', err);
    }
  }, 60 * 1000); // Run every 60 seconds
}

module.exports = { startSelfDestructCleanup, setIO };
