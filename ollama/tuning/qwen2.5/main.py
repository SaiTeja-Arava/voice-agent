import json

input = "/Users/saitejaarava/Documents/playground/arena/test/voice-agent/ollama/tuning/data.bkp/valid.json"

# Read the JSON file
with open( input, 'r') as json_file:
    data = json.load(json_file)

# Write to JSONL file
with open(f'{input}l', 'w') as jsonl_file:
    for item in data:
        jsonl_file.write(json.dumps(item) + '\n')