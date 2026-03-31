# server/ws_logger.py
import logging
import asyncio
from fastapi import WebSocket

# Async queue to hold log messages before broadcasting
log_queue: asyncio.Queue = asyncio.Queue()


class WebSocketLogHandler(logging.Handler):
    """Custom logging handler that puts logs into an asyncio Queue."""

    def emit(self, record: logging.LogRecord) -> None:
        msg = self.format(record)
        try:
            loop = asyncio.get_running_loop()
            # Threadsafe way to put logs into the queue from sync logging calls
            loop.call_soon_threadsafe(log_queue.put_nowait, msg)
        except RuntimeError:
            # Fallback if no event loop is running
            pass


class WebSocketManager:
    def __init__(self) -> None:
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str) -> None:
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
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