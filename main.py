from fastapi import FastAPI

app = FastAPI()

json = {
    "id": 0,
    "name": "asd asdf fddd",
    "email": "ASdWww@asd.ras",
    "registration": "10.01.2020",
    "phone": "+1234556",
    "isActive": False,
}

@app.get("/items/")
async def get_item():
 return json