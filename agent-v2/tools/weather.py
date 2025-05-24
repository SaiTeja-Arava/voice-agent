from qwen_agent.tools.base import register_tool, BaseTool
from datetime import datetime

@register_tool('get_weather')
class WeatherTool(BaseTool):
    """Tool to get current weather information for a location."""
    
    description = "Get the current weather for a specified location."
    parameters = [
        {
            "name": "location",
            "type": "string",
            "description": "City name or location, e.g., 'New York' or 'London, UK'"
        },
        {
            "name": "units",
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit (celsius or fahrenheit)",
            "default": "celsius"
        }
    ]
    
    def call(self, location, units="celsius"):
        """Mock implementation of a weather service."""
        # In a real implementation, you would call a weather API
        # This is a mock version for demonstration
        
        # Simulate API response with mock data
        weather_conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Partly Cloudy"]
        import random
        condition = random.choice(weather_conditions)
        
        # Generate a random temperature based on condition
        temp_ranges = {
            "Sunny": (25, 35),
            "Cloudy": (15, 25),
            "Rainy": (10, 20),
            "Snowy": (-5, 5),
            "Partly Cloudy": (20, 30)
        }
        
        min_temp, max_temp = temp_ranges[condition]
        temperature = random.uniform(min_temp, max_temp)
        
        # Convert to fahrenheit if requested
        if units.lower() == "fahrenheit":
            temperature = (temperature * 9/5) + 32
            unit_symbol = "°F"
        else:
            unit_symbol = "°C"
        
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        response = {
            "location": location,
            "temperature": f"{temperature:.1f}{unit_symbol}",
            "condition": condition,
            "humidity": f"{random.randint(40, 95)}%",
            "wind_speed": f"{random.randint(0, 30)} km/h",
            "time": current_time
        }
        
        return f"Weather for {location}: {condition}, {response['temperature']}, " \
               f"Humidity: {response['humidity']}, Wind: {response['wind_speed']}"