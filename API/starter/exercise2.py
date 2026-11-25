"""Exercise 2: The Awards, in Python. Run with:  python exercise2.py   (not in the REPL)"""
awards = [
    {"id": 1, "award": "Chairman's Award for Platform Renewal", "awarded_by": "Lumina Software", "year": 2026, "category": "Company"},
    {"id": 2, "award": "Technology Leader of the Year", "awarded_by": "South India CIO Forum", "year": 2024, "category": "Industry"},
    {"id": 3, "award": "Engineering Excellence Award", "awarded_by": "Aster Data Platforms", "year": 2020, "category": "Company"},
    {"id": 4, "award": "Women in Technology Leadership Award", "awarded_by": "Tech Leaders Council", "year": 2019, "category": "Industry"},
    {"id": 5, "award": "Platform Pioneer Award", "awarded_by": "CloudHarbor Software", "year": 2009, "category": "Company"},
]

# 1. Loop and print each award:  2026 — Chairman's Award for Platform Renewal (Company)
for award in awards:
    print(f"{award['year']} — {award['award']} ({award['category']})")


# 2. Write count_by_category(awards, category) and call it for Company.
def count_by_category(awards, category):
    return len([a for a in awards if a["category"] == category])


print("Company awards:", count_by_category(awards, "Company"))

# 3. Print the awards sorted newest first.
for award in sorted(awards, key=lambda a: a["year"], reverse=True):
    print(award["year"], award["award"])

# 4. A list comprehension of only the Industry awards' names.
print([a["award"] for a in awards if a["category"] == "Industry"])

# Fast finishers: count all three categories in one dictionary with a loop.
counts = {}
for award in awards:
    counts[award["category"]] = counts.get(award["category"], 0) + 1
print(counts)
