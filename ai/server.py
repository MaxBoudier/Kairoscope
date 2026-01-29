from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import sys
import os
import asyncio

# Ensure the current directory is in the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the pipeline generator
from main import run_prediction_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ws://localhost:8000/ws/predict?restaurantId=1
# ws://localhost:8000/ws/predict?restaurantId=1
@app.websocket("/ws/predict")
async def websocket_endpoint(websocket: WebSocket, restaurantId: int):
    """
    Websocket endpoint that:
    1. Accepts a connection
    2. Runs the prediction pipeline
    3. Streams status updates and final result
    4. Closes connection
    """
    
    await websocket.accept()
    print("Websocket client connected.")
    
    try:
        # NOTE: run_prediction_pipeline contains blocking code (training).
        # In a production async environment, we would run valid blocking
        # code in a threadpool, but for this 'basic structure', we iterate directly.
        # This means the server won't respond to *other* requests during heavy computation steps,
        # but it will yield messages between steps.
        
        # Optionally wait for a start message or configuration
        # data = await websocket.receive_text() 
        
        epochs = 30 # Default or could be parsed from initial message
        
        # Iterate through the pipeline steps
        for step in run_prediction_pipeline(epochs=epochs, restaurant_id=restaurantId):
            # Handle heartbeat (empty queue) from generator
            if step is None:
                await asyncio.sleep(0.1)
                continue

            # Send each step as a JSON message to the frontend
            await websocket.send_json(step)
            
            # Small sleep to ensure the event loop yields (helps with stability)
            await asyncio.sleep(0.01)
            
    except Exception as e:
        print(f"Error in websocket loop: {e}")
        await websocket.send_json({"type": "error", "message": str(e)})
        
    finally:
        print("Websocket connection closed.")
        await websocket.close()

if __name__ == "__main__":
    # Run the server
    # You can access the websocket at ws://localhost:8000/ws/predict
    uvicorn.run(app, host="0.0.0.0", port=8000)
