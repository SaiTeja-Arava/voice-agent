from nats_client import NatsClient
from nats.aio.client import Msg, json
from app import transcribe
import asyncio

async def transcribeHandler(msg: Msg):

    text = transcribe(audio_data=msg.data)

    await msg.respond(json.dumps({"text": text}).encode())


async def startProvider():

    nc = NatsClient("localhost", 4222, "nats-test")
    await nc.start()

    await nc.subscribe(subject="keus-transcribe", handler=transcribeHandler )

    try:
        print("Listening for messages... Press Ctrl+C to stop")
        while True:
            await asyncio.sleep(1)  # Prevent the loop from consuming too much CPU
    except asyncio.CancelledError:
        print("Shutting down...")
        await nc.nc.close()

if __name__ == "__main__":
    asyncio.run(startProvider())