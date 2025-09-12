import requests
import json
import os
from dotenv import load_dotenv

makes = [
    "Aprilia",
    "Ducati",
    "Harley-Davidson",
    "Kawasaki",
    "Suzuki",
    "Yamaha",
    "Triumph",
    "KTM",
    "Benelli",
    "BMW",
    "Honda",
    "Bajaj",
    "Bimota",
    "CF Moto",
    "Indian",
    "Moto Guzzi",
    "Hero",
    "MV Agusta",
    "ARCH",
]

load_dotenv()
API_KEY = os.getenv("API_KEY")

grouped_data = {} 


def scrap(makes_list):
    global dataset
    global API_KEY
    for make in makes_list:
        url = f"https://api.api-ninjas.com/v1/motorcycles?make={make}"
        headers = {"X-Api-Key": API_KEY}

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            grouped_data.setdefault(make, [])

            for bike in data:
                model_name = bike.get("model")
                year = bike.get("year")
                if model_name:
                    grouped_data[make].append(
                        f"{model_name} ({year})" if year else model_name
                    )

            print(f"✅ {make}: {len(data)} motorcycles found")
        else:
            print(f"❌ {make} - Error {response.status_code}: {response.text}")

    with open("motorcycles_simplified.json", "w", encoding="utf-8") as f:
        json.dump(grouped_data, f, indent=4, ensure_ascii=False)
    print("\n📁 Saved dataset to motorcycles_simplified.json")

scrap(makes)
