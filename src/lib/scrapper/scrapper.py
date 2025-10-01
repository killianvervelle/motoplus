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


def scrap(makes_list, start_year=2000, end_year=2025):
    global grouped_data
    global API_KEY

    for make in makes_list:
        grouped_data.setdefault(make, [])
        total_found = 0

        for year in range(start_year, end_year + 1):
            url = "https://api.api-ninjas.com/v1/motorcycles"
            headers = {"X-Api-Key": API_KEY}
            params = {"make": make, "year": year}

            response = requests.get(url, headers=headers, params=params)

            if response.status_code != 200:
                print(
                    f"❌ {make} ({year}) - Error {response.status_code}: {response.text}")
                continue

            data = response.json()
            if not data:
                continue  # nothing for this year

            for bike in data:
                model_name = bike.get("model")
                year_val = bike.get("year")
                if model_name:
                    entry = f"{model_name} ({year_val})" if year_val else model_name
                    # avoid duplicates
                    if entry not in grouped_data[make]:
                        grouped_data[make].append(entry)

            total_found += len(data)

        print(f"✅ {make}: {total_found} motorcycles found")

    with open("motorcycles_simplified.json", "w", encoding="utf-8") as f:
        json.dump(grouped_data, f, indent=4, ensure_ascii=False)
    print("\n📁 Saved dataset to motorcycles_simplified.json")


scrap(makes)
