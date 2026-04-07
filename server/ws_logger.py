# server/ws_logger.py
import logging
import asyncio
from contextvars import ContextVar
from fastapi import WebSocket

# Context variable to track current session ID
current_session_id: ContextVar[str | None] = ContextVar('session_id', default=None)

# Async queue to hold log messages before broadcasting
log_queue: asyncio.Queue = asyncio.Queue()


class WebSocketLogHandler(logging.Handler):
    """Custom logging handler that puts logs into an asyncio Queue."""

    def emit(self, record: logging.LogRecord) -> None:
        msg = self.format(record)
        session_id = current_session_id.get()
        
        # Create a log object with metadata
        log_obj = {
            'message': msg,
            'session_id': session_id,
        }
        
        try:
            loop = asyncio.get_running_loop()
            # Threadsafe way to put logs into the queue from sync logging calls
            loop.call_soon_threadsafe(log_queue.put_nowait, log_obj)
        except RuntimeError:
            # Fallback if no event loop is running
            pass


class WebSocketManager:
    def __init__(self) -> None:
        self.active_connections: list[tuple[WebSocket, str | None]] = []

    async def connect(self, websocket: WebSocket, session_filter: str | None = None) -> None:
        await websocket.accept()
        self.active_connections.append((websocket, session_filter))

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections = [(ws, sf) for ws, sf in self.active_connections if ws != websocket]

    async def broadcast(self, log_obj: dict) -> None:
        msg = log_obj.get('message', '')
        session_id = log_obj.get('session_id')
        
        disconnected = []
        for connection, session_filter in self.active_connections:
            # Skip if user is filtering for a specific session
            if session_filter and session_id != session_filter:
                continue
            
            try:
                await connection.send_text(msg)
            except Exception:
                disconnected.append(connection)

        # Clean up dead connections
        for conn in disconnected:
            self.disconnect(conn)


ws_manager = WebSocketManager()


async def log_broadcaster() -> None:
    """Background task that continuously reads from the queue and broadcasts."""
    while True:
        msg = await log_queue.get()
        await ws_manager.broadcast(msg)
        log_queue.task_done()