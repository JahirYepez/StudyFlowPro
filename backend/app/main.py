from fastapi import FastAPI


app = FastAPI(
    title="StudyFlow API",
    version="0.1.0",
    description="API academica para StudyFlow.",
)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "studyflow-api"}
