from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import random

app = FastAPI(title="CivicEye AI Engine")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "engine": "CivicEye AI v1.0"}

@app.post("/api/detect-hazard")
async def detect_hazard(file: UploadFile = File(...)):
    # This is where we would call Gemini Vision API
    # For the prototype, we simulate a sophisticated AI response
    
    hazards = ["Severe Waterlogging", "Deep Potholes", "Road Damage", "Debris"]
    hazard = random.choice(hazards)
    severity = random.choice(["High", "Moderate"])
    risk_score = random.randint(70, 95) if severity == "High" else random.randint(40, 69)
    
    return {
        "hazard_class": hazard,
        "severity": severity,
        "risk_score": risk_score,
        "detection_details": {
            "depth_estimate": "12-18 inches" if "Water" in hazard else "N/A",
            "vehicle_risk": "High for 2W/4W" if risk_score > 70 else "Moderate",
            "surface_condition": "Poor"
        },
        "ai_advisory": f"AI Action: Incident classified as {severity} Risk. Nearby commuters alerted."
    }

@app.get("/api/risk-score")
async def get_risk_score(lat: float, lng: float):
    # Simulated Geospatial Risk Engine
    # In production, this queries MongoDB Atlas
    base_score = random.randint(10, 90)
    return {
        "lat": lat,
        "lng": lng,
        "safety_score": base_score,
        "risk_factors": ["Monsoon Flood Zone"] if base_score < 40 else ["Clear Path"]
    }

# Serve static files (Frontend)
# Ensure this is after API routes
app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
