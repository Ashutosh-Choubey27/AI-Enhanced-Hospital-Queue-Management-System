# FastAPI ML Service (Wait + Crowd Prediction)

This service provides:
- **Wait time prediction** (simple linear regression trained on synthetic patterned data)
- **Crowd level prediction** (`low|medium|high`) + arrivals/hour
- **Explanation** field in every response

## Run

```bash
cd "ml-service"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Endpoints

- `GET /health`
- `POST /predict/wait-time`
- `POST /predict/crowd`

