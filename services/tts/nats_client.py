from nats.aio.client import Client, Msg
from nats.js import JetStreamContext
from typing import Callable, Any

class NatsClient:
    nc: Client
    js: JetStreamContext

    def __init__(self, host: str, port: int, token: str):
        self.url = f"nats://{host}:{port}"
        self.token = token
        self.nc = Client()
        # self.js = self.nc.jetstream()

    async def start(self):
        
        await self.nc.connect(servers=[self.url], token=self.token)
        
        print(f"Connected to NATS servers: {self.nc.is_connected}")

    async def subscribe(self, subject, handler: Callable[[Msg], Any]):
        sub = await self.nc.subscribe(subject=subject, cb=handler)

        return sub