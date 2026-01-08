/** @type {Map<string, Session>} */
const sessions = new Map();

export class Session {
    constructor(connectionID) {
        this.connectionID = connectionID;
        this.lobby = undefined;
        sessions.set(connectionID, this);
    }

    onDisconnect() {
        this.leaveLobby();
        sessions.delete(this.connectionID);
    }

    /**
     * Add lobby to session
     * @param {Lobby} lobby lobby instance
     */
    joinLobby(lobby) {
        // Try to leave lobby first so that players 
        // are not in multiple lobbies at the same time
        this.leaveLobby();
        // Set lobby to new lobby
        this.lobby = lobby;
    }

    leaveLobby() {
        if (this.lobby) {
            this.lobby.removeParticipant(this.connectionID);
            this.lobby = undefined;
        }
    }

    
    /**
     * 
     * @param {string} connectionID connection ID
     * @returns 
     */
    static getSession(connectionID) {
        return sessions.get(connectionID);
    }
}